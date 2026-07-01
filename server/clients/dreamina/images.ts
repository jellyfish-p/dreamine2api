import _ from "lodash";
import crypto from "crypto";

import APIException from "~~/server/utils/errors/APIException";
import EX from "~~/server/clients/dreamina/consts/exceptions";
import util from "~~/server/utils/util";
import { getCredit, receiveCredit, request, type RequestProxyOptions } from "./core";
import logger from "~~/server/utils/logger";
import { SmartPoller } from "~~/server/clients/dreamina/smart-poller";
import type { PollingStatus } from "~~/server/clients/dreamina/smart-poller";
import { DEFAULT_ASSISTANT_ID, DRAFT_VERSION } from "~~/server/clients/dreamina/consts/common";
import { resolveModelReqKey as resolvePublicModel } from "~~/server/services/pool/model-catalog";
import { createSignature } from "~~/server/clients/dreamina/aws-signature";

export const DEFAULT_MODEL = "seedream-4.5";

// 根据宽高计算image_ratio（基于官方抓包数据分析的实际参数）
function getImageRatio(width: number, height: number): number {
  const aspectRatio = width / height;

  if (Math.abs(aspectRatio - 1) < 0.1) return 1;        // 1:1
  if (Math.abs(aspectRatio - 4/3) < 0.1) return 4;      // 4:3
  if (Math.abs(aspectRatio - 3/4) < 0.1) return 2;      // 3:4
  if (Math.abs(aspectRatio - 16/9) < 0.1) return 3;     // 16:9
  if (Math.abs(aspectRatio - 9/16) < 0.1) return 5;     // 9:16
  if (Math.abs(aspectRatio - 3/2) < 0.1) return 7;      // 3:2
  if (Math.abs(aspectRatio - 2/3) < 0.1) return 6;      // 2:3
  if (Math.abs(aspectRatio - 21/9) < 0.1) return 8;     // 21:9

  // 默认返回1（正方形）
  return 1;
}
export function getModel(model: string) {
  const resolved = resolvePublicModel(model || DEFAULT_MODEL);
  return resolved || DEFAULT_MODEL;
}

type DreaminaImageRecord = Record<string, any>;

export type DreaminaImageCompletion = {
  expectedCount: number;
  successCount: number;
  failedCount: number;
  completedCount: number;
  complete: boolean;
};

export type DreaminaFailedImageResult = {
  id: string;
  code: number | string;
  message: string;
};

export function getDreaminaImageUrls(itemList: any[] = []): string[] {
  return itemList
    .map((item) =>
      item?.image?.large_images?.[0]?.image_url ||
      item?.common_attr?.cover_url ||
      item?.image_url ||
      item?.url ||
      null
    )
    .filter((url): url is string => typeof url === "string" && url.length > 0);
}

export function getDreaminaFailedImageResults(failedItemList: any[] = []): DreaminaFailedImageResult[] {
  return failedItemList.map((item) => ({
    id: item?.common_attr?.id || item?.common_attr?.effect_id || "",
    code: item?.gen_result_data?.result_code ?? item?.common_attr?.status ?? "",
    message: item?.gen_result_data?.result_msg || item?.fail_msg || item?.fail_code || "unknown",
  }));
}

function positiveNumber(value: unknown): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : 0;
}

export function getDreaminaImageCompletion(
  record: DreaminaImageRecord,
  fallbackExpectedCount = 4,
): DreaminaImageCompletion {
  const successCount = Array.isArray(record?.item_list) ? record.item_list.length : 0;
  const failedCount = Array.isArray(record?.failed_item_list) ? record.failed_item_list.length : 0;
  const preGenCount = Array.isArray(record?.pre_gen_item_ids) ? record.pre_gen_item_ids.length : 0;
  const expectedCount = preGenCount || positiveNumber(record?.total_image_count) || fallbackExpectedCount;
  const listedCompletedCount = successCount + failedCount;
  const completedCount = Math.max(listedCompletedCount, positiveNumber(record?.finished_image_count));
  const hasTerminalStatus = record?.status === 10 || record?.status === 50;
  const hasFinishTime = positiveNumber(record?.task?.finish_time || record?.finish_time) > 0;

  return {
    expectedCount,
    successCount,
    failedCount,
    completedCount,
    complete:
      hasTerminalStatus ||
      completedCount >= expectedCount ||
      (hasFinishTime && completedCount > 0),
  };
}

export function ensureDreaminaImageUrls(
  imageUrls: string[],
  record: DreaminaImageRecord,
  context: string,
): string[] {
  if (imageUrls.length > 0) return imageUrls;
  if (record?.fail_code === "2038") throw new APIException(EX.API_CONTENT_FILTERED);

  const failed = getDreaminaFailedImageResults(record?.failed_item_list);
  const reason = failed
    .map((item) => [item.id, item.message].filter(Boolean).join(": "))
    .filter(Boolean)
    .join("; ");

  throw new APIException(
    EX.API_IMAGE_GENERATION_FAILED,
    `${context}失败: ${reason || record?.fail_msg || record?.fail_code || "未返回可用图片"}`,
  );
}

function logDreaminaFailedImages(context: string, failedItemList: any[] = []) {
  const failed = getDreaminaFailedImageResults(failedItemList);
  if (failed.length === 0) return;
  logger.warn(`${context}部分图片生成失败: ${JSON.stringify(failed)}`);
}

// 计算文件的CRC32值
function calculateCRC32(buffer: ArrayBuffer): string {
  const crcTable: number[] = [];
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
    crcTable[i] = crc;
  }

  let crc = 0 ^ (-1);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]!) & 0xFF]!;
  }
  return ((crc ^ (-1)) >>> 0).toString(16).padStart(8, '0');
}

function getUploadFilename(imageUrl: string, contentType: string | null, prefix = "dreamina-image"): string {
  let extension = "";
  try {
    extension = util.extractURLExtension(imageUrl);
  } catch {
    extension = "";
  }

  if (!extension && contentType) {
    const normalizedContentType = contentType.split(";")[0]?.trim();
    extension = normalizedContentType ? util.mimeToExtension(normalizedContentType) || "" : "";
  }

  extension = extension.replace(/[^a-z0-9]/gi, "").toLowerCase() || "bin";
  return `${prefix}.${extension}`;
}

// 图片上传功能：将外部图片URL上传到Dreamina系统
async function uploadImageFromUrl(imageUrl: string, refreshToken: string): Promise<string> {
  try {
    logger.info(`开始上传图片: ${imageUrl}`);

    // 第一步：获取上传令牌
    const tokenResult = await request("post", "/mweb/v1/get_upload_token", refreshToken, {
      data: {
        scene: 2, // AIGC 图片上传场景
      },
    });

    const { access_key_id, secret_access_key, session_token, service_id } = tokenResult;
    if (!access_key_id || !secret_access_key || !session_token) {
      throw new Error("获取上传令牌失败");
    }

    // 使用固定的service_id
    const actualServiceId = service_id || "tb4s082cfz";

    logger.info(`获取上传令牌成功: service_id=${actualServiceId}`);

    // 下载图片数据
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`下载图片失败: ${imageResponse.status}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const fileSize = imageBuffer.byteLength;
    const crc32 = calculateCRC32(imageBuffer);
    const uploadFilename = getUploadFilename(imageUrl, imageResponse.headers.get('content-type'));

    logger.info(`图片下载完成: 大小=${fileSize}字节, CRC32=${crc32}`);

    // 第二步：申请图片上传权限
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:\-]/g, '').replace(/\.\d{3}Z$/, 'Z');

    const randomStr = Math.random().toString(36).substring(2, 12);
    const applyUrl = `https://imagex.bytedanceapi.com/?Action=ApplyImageUpload&Version=2018-08-01&ServiceId=${actualServiceId}&FileSize=${fileSize}&s=${randomStr}`;

    logger.debug(`原始URL: ${applyUrl}`);

    const requestHeaders = {
      'x-amz-date': timestamp,
      'x-amz-security-token': session_token
    };

    const authorization = createSignature('GET', applyUrl, requestHeaders, access_key_id, secret_access_key, session_token);

    logger.info(`AWS签名调试信息:
      URL: ${applyUrl}
      AccessKeyId: ${access_key_id}
      SessionToken: ${session_token ? '存在' : '不存在'}
      Timestamp: ${timestamp}
      Authorization: ${authorization}
    `);

    const applyResponse = await fetch(applyUrl, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'authorization': authorization,
        'origin': 'https://dreamina.capcut.com',
        'referer': 'https://dreamina.capcut.com/ai-tool/generate',
        'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
        'x-amz-date': timestamp,
        'x-amz-security-token': session_token,
      },
    });

    if (!applyResponse.ok) {
      const errorText = await applyResponse.text();
      throw new Error(`申请上传权限失败: ${applyResponse.status} - ${errorText}`);
    }

    const applyResult = await applyResponse.json();

    if (applyResult?.ResponseMetadata?.Error) {
      throw new Error(`申请上传权限失败: ${JSON.stringify(applyResult.ResponseMetadata.Error)}`);
    }

    logger.info(`申请上传权限成功`);

    // 解析上传信息
    const uploadAddress = applyResult?.Result?.UploadAddress;
    if (!uploadAddress || !uploadAddress.StoreInfos || !uploadAddress.UploadHosts) {
      throw new Error(`获取上传地址失败: ${JSON.stringify(applyResult)}`);
    }

    const storeInfo = uploadAddress.StoreInfos[0];
    const uploadHost = uploadAddress.UploadHosts[0];
    const auth = storeInfo.Auth;

    const uploadUrl = `https://${uploadHost}/upload/v1/${storeInfo.StoreUri}`;
    const imageId = storeInfo.StoreUri.split('/').pop();

    logger.info(`准备上传图片: imageId=${imageId}, uploadUrl=${uploadUrl}`);

    // 第三步：上传图片文件
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Authorization': auth,
        'Connection': 'keep-alive',
        'Content-CRC32': crc32,
        'Content-Disposition': `attachment; filename="${uploadFilename}"`,
        'Content-Type': 'application/octet-stream',
        'Origin': 'https://dreamina.capcut.com',
        'Referer': 'https://dreamina.capcut.com/ai-tool/generate',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
        'X-Storage-U': '704135154117550',
      },
      body: imageBuffer,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`图片上传失败: ${uploadResponse.status} - ${errorText}`);
    }

    logger.info(`图片文件上传成功`);

    // 第四步：提交上传
    const commitUrl = `https://imagex.bytedanceapi.com/?Action=CommitImageUpload&Version=2018-08-01&ServiceId=${actualServiceId}`;

    const commitTimestamp = new Date().toISOString().replace(/[:\-]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const commitPayload = JSON.stringify({
      SessionKey: uploadAddress.SessionKey,
      SuccessActionStatus: "200"
    });

    const payloadHash = crypto.createHash('sha256').update(commitPayload, 'utf8').digest('hex');

    const commitRequestHeaders = {
      'x-amz-date': commitTimestamp,
      'x-amz-security-token': session_token,
      'x-amz-content-sha256': payloadHash
    };

    const commitAuthorization = createSignature('POST', commitUrl, commitRequestHeaders, access_key_id, secret_access_key, session_token, commitPayload);

    const commitResponse = await fetch(commitUrl, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'authorization': commitAuthorization,
        'content-type': 'application/json',
        'origin': 'https://dreamina.capcut.com',
        'referer': 'https://dreamina.capcut.com/ai-tool/generate',
        'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
        'x-amz-date': commitTimestamp,
        'x-amz-security-token': session_token,
        'x-amz-content-sha256': payloadHash,
      },
      body: commitPayload,
    });

    if (!commitResponse.ok) {
      const errorText = await commitResponse.text();
      throw new Error(`提交上传失败: ${commitResponse.status} - ${errorText}`);
    }

    const commitResult = await commitResponse.json();

    if (commitResult?.ResponseMetadata?.Error) {
      throw new Error(`提交上传失败: ${JSON.stringify(commitResult.ResponseMetadata.Error)}`);
    }

    if (!commitResult?.Result?.Results || commitResult.Result.Results.length === 0) {
      throw new Error(`提交上传响应缺少结果: ${JSON.stringify(commitResult)}`);
    }

    const uploadResult = commitResult.Result.Results[0];
    if (uploadResult.UriStatus !== 2000) {
      throw new Error(`图片上传状态异常: UriStatus=${uploadResult.UriStatus}`);
    }

    const fullImageUri = uploadResult.Uri;

    const pluginResult = commitResult.Result?.PluginResult?.[0];
    if (pluginResult) {
      logger.info(`图片上传成功详情:`, {
        imageUri: pluginResult.ImageUri,
        sourceUri: pluginResult.SourceUri,
        size: `${pluginResult.ImageWidth}x${pluginResult.ImageHeight}`,
        format: pluginResult.ImageFormat,
        fileSize: pluginResult.ImageSize,
        md5: pluginResult.ImageMd5
      });

      if (pluginResult.ImageUri) {
        logger.info(`图片上传完成: ${pluginResult.ImageUri}`);
        return pluginResult.ImageUri;
      }
    }

    logger.info(`图片上传完成: ${fullImageUri}`);
    return fullImageUri;

  } catch (error: any) {
    logger.error(`图片上传失败: ${error.message}`);
    throw error;
  }
}

// 图片合成功能：先上传图片，然后进行图生图
export async function generateImageComposition(
  _model: string,
  prompt: string,
  imageUrls: string[],
  {
    width = 2560,
    height = 1440,
    sampleStrength = 0.5,
    negativePrompt = "",
  }: {
    width?: number;
    height?: number;
    sampleStrength?: number;
    negativePrompt?: string;
  },
  refreshToken: string,
  proxyOpts: RequestProxyOptions = {}
) {
  const model = getModel(_model);
  const imageCount = imageUrls.length;
  logger.info(`使用模型: ${_model} 映射模型: ${model} 图生图功能 ${imageCount}张图片 ${width}x${height} 精细度: ${sampleStrength}`);

  // 海外站暂时跳过积分检查
  try {
    const { totalCredit } = await getCredit(refreshToken, proxyOpts);
    if (totalCredit <= 0)
      await receiveCredit(refreshToken);
  } catch (creditError: any) {
    logger.warn(`获取积分失败，继续尝试生成: ${creditError.message}`);
  }

  // 上传所有输入图片
  const uploadedImageIds: string[] = [];
  for (let i = 0; i < imageUrls.length; i++) {
    try {
      const imageId = await uploadImageFromUrl(imageUrls[i]!, refreshToken);
      uploadedImageIds.push(imageId);
      logger.info(`图片 ${i + 1}/${imageCount} 上传成功: ${imageId}`);
    } catch (error: any) {
      logger.error(`图片 ${i + 1}/${imageCount} 上传失败: ${error.message}`);
      throw new APIException(EX.API_IMAGE_GENERATION_FAILED, `图片上传失败: ${error.message}`);
    }
  }

  logger.info(`所有图片上传完成，开始图生图: ${uploadedImageIds.join(', ')}`);

  const componentId = util.uuid();
  const submitId = util.uuid();
  const { aigc_data } = await request(
    "post",
    "/mweb/v1/aigc_draft/generate",
    refreshToken,
    {
      proxyUrl: proxyOpts.proxyUrl,
      params: {
        babi_param: encodeURIComponent(
          JSON.stringify({
            scenario: "image_video_generation",
            feature_key: "aigc_to_image",
            feature_entrance: "to_image",
            feature_entrance_detail: "to_image-" + model,
          })
        ),
      },
      data: {
        extend: {
          root_model: model,
        },
        submit_id: submitId,
        metrics_extra: JSON.stringify({
          promptSource: "custom",
          generateCount: 1,
          enterFrom: "click",
          generateId: submitId,
          isRegenerate: false
        }),
        draft_content: JSON.stringify({
          type: "draft",
          id: util.uuid(),
          min_version: "3.2.9",
          min_features: [],
          is_from_tsn: true,
          version: "3.2.9",
          main_component_id: componentId,
          component_list: [
            {
              type: "image_base_component",
              id: componentId,
              min_version: "3.0.2",
              aigc_mode: "workbench",
              metadata: {
                type: "",
                id: util.uuid(),
                created_platform: 3,
                created_platform_version: "",
                created_time_in_ms: Date.now().toString(),
                created_did: "",
              },
              generate_type: "blend",
              abilities: {
                type: "",
                id: util.uuid(),
                blend: {
                  type: "",
                  id: util.uuid(),
                  min_version: "3.2.9",
                  min_features: [],
                  core_param: {
                    type: "",
                    id: util.uuid(),
                    model,
                    prompt: `####${prompt}`,
                    sample_strength: sampleStrength,
                    image_ratio: getImageRatio(width, height),
                    large_image_info: {
                      type: "",
                      id: util.uuid(),
                      height,
                      width,
                      resolution_type: width >= 2048 || height >= 2048 ? "2k" : "1k"
                    },
                    intelligent_ratio: false,
                  },
                  ability_list: uploadedImageIds.map((imageId) => ({
                    type: "",
                    id: util.uuid(),
                    name: "byte_edit",
                    image_uri_list: [imageId],
                    image_list: [{
                      type: "image",
                      id: util.uuid(),
                      source_from: "upload",
                      platform_type: 1,
                      name: "",
                      image_uri: imageId,
                      width: 0,
                      height: 0,
                      format: "",
                      uri: imageId
                    }],
                    strength: 0.5
                  })),
                  prompt_placeholder_info_list: uploadedImageIds.map((_, index) => ({
                    type: "",
                    id: util.uuid(),
                    ability_index: index
                  })),
                  postedit_param: {
                    type: "",
                    id: util.uuid(),
                    generate_type: 0
                  }
                },
              },
            },
          ],
        }),
        http_common_info: {
          aid: Number(DEFAULT_ASSISTANT_ID),
        },
      },
    }
  );

  const historyId = aigc_data?.history_record_id;
  if (!historyId)
    throw new APIException(EX.API_IMAGE_GENERATION_FAILED, "记录ID不存在");

  logger.info(`图生图任务已提交，history_id: ${historyId}，等待生成完成...`);

  let status = 20, failCode: string | undefined, item_list: any[] = [], finalTaskInfo: any = null;
  let pollCount = 0;
  const maxPollCount = 600;

  while (pollCount < maxPollCount) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    pollCount++;

    if (pollCount % 30 === 0) {
      logger.info(`图生图进度: 第 ${pollCount} 次轮询 (history_id: ${historyId})，当前状态: ${status}，已生成: ${item_list.length} 张图片...`);
    }

    // 不传递 image_info 参数，以获取原始分辨率的图片URL
    const result = await request("post", "/mweb/v1/get_history_by_ids", refreshToken, {
      data: {
        history_ids: [historyId],
      },
    });

    if (!result[historyId])
      throw new APIException(EX.API_IMAGE_GENERATION_FAILED, "记录不存在");

    const taskInfo = result[historyId];
    finalTaskInfo = taskInfo;
    status = taskInfo.status;
    failCode = taskInfo.fail_code;
    item_list = taskInfo.item_list || [];
    const completion = getDreaminaImageCompletion(taskInfo, 1);

    if (status === 30 && completion.successCount === 0) {
      logger.info(`图生图失败: status=${status}, failCode=${failCode || 'none'}`);
      break;
    }

    if (completion.complete) {
      logger.info(`图生图完成: 状态=${status}, 已生成 ${completion.successCount} 张图片，失败 ${completion.failedCount} 张`);
      break;
    }

    if (status === 10 && item_list.length === 0 && pollCount % 30 === 0) {
      logger.info(`图生图状态已完成但无图片生成: 状态=${status}, 继续等待...`);
    }
  }

  if (pollCount >= maxPollCount) {
    logger.warn(`图生图超时: 轮询了 ${pollCount} 次，当前状态: ${status}，已生成图片数: ${item_list.length}`);
  }

  if (status === 30 && item_list.length === 0) {
    if (failCode === '2038')
      throw new APIException(EX.API_CONTENT_FILTERED);
    else
      throw new APIException(EX.API_IMAGE_GENERATION_FAILED, `图生图失败，错误代码: ${failCode}`);
  }

  const finalRecord = finalTaskInfo || { status, fail_code: failCode, item_list };
  logDreaminaFailedImages("图生图", finalRecord.failed_item_list || []);
  const resultImageUrls = ensureDreaminaImageUrls(
    getDreaminaImageUrls(finalRecord.item_list || []),
    finalRecord,
    "图生图",
  );

  logger.info(`图生图结果: 成功生成 ${resultImageUrls.length} 张图片`);
  return resultImageUrls;
}

export async function generateImages(
  _model: string,
  prompt: string,
  {
    width = 2048,
    height = 2048,
    sampleStrength = 0.5,
    negativePrompt = "",
  }: {
    width?: number;
    height?: number;
    sampleStrength?: number;
    negativePrompt?: string;
  },
  refreshToken: string,
  proxyOpts: RequestProxyOptions = {}
) {
  const model = getModel(_model);
  logger.info(`使用模型: ${_model} 映射模型: ${model} ${width}x${height} 精细度: ${sampleStrength} (2K分辨率)`);

  // 海外站暂时跳过积分检查，直接进行生成
  try {
    const { totalCredit, giftCredit, purchaseCredit, vipCredit } = await getCredit(refreshToken, proxyOpts);
    logger.info(`当前积分状态: 总计=${totalCredit}, 赠送=${giftCredit}, 购买=${purchaseCredit}, VIP=${vipCredit}`);
    if (totalCredit <= 0)
      await receiveCredit(refreshToken);
  } catch (creditError: any) {
    logger.warn(`获取积分失败，继续尝试生成: ${creditError.message}`);
  }

  const componentId = util.uuid();
  const submitId = util.uuid();
  const resolutionType = width >= 2048 || height >= 2048 ? "2k" : "1k";
  
  const { aigc_data } = await request(
    "post",
    "/mweb/v1/aigc_draft/generate",
    refreshToken,
    {
      proxyUrl: proxyOpts.proxyUrl,
      data: {
        extend: {
          root_model: model,
        },
        submit_id: submitId,
        metrics_extra: JSON.stringify({
          promptSource: "custom",
          generateCount: 1,
          enterFrom: "click",
          position: "page_bottom_box",
          sceneOptions: JSON.stringify([{
            type: "image",
            scene: "ImageBasicGenerate",
            modelReqKey: model,
            resolutionType: resolutionType,
            abilityList: [],
            benefitCount: 4,
            reportParams: {
              enterSource: "generate",
              vipSource: "generate",
              extraVipFunctionKey: `${model}-${resolutionType}`,
              useVipFunctionDetailsReporterHoc: true
            }
          }]),
          isBoxSelect: false,
          isCutout: false,
          generateId: submitId,
          isRegenerate: false
        }),
        draft_content: JSON.stringify({
          type: "draft",
          id: util.uuid(),
          min_version: "3.0.2",
          min_features: [],
          is_from_tsn: true,
          version: DRAFT_VERSION,
          main_component_id: componentId,
          component_list: [
            {
              type: "image_base_component",
              id: componentId,
              min_version: "3.0.2",
              aigc_mode: "workbench",
              metadata: {
                type: "",
                id: util.uuid(),
                created_platform: 3,
                created_platform_version: "",
                created_time_in_ms: Date.now().toString(),
                created_did: ""
              },
              generate_type: "generate",
              abilities: {
                type: "",
                id: util.uuid(),
                generate: {
                  type: "",
                  id: util.uuid(),
                  core_param: {
                    type: "",
                    id: util.uuid(),
                    model,
                    prompt,
                    negative_prompt: negativePrompt,
                    seed: Math.floor(Math.random() * 100000000) + 2500000000,
                    sample_strength: sampleStrength,
                    image_ratio: getImageRatio(width, height),
                    large_image_info: {
                      type: "",
                      id: util.uuid(),
                      height,
                      width,
                      resolution_type: resolutionType
                    },
                    intelligent_ratio: false
                  },
                },
                gen_option: {
                  type: "",
                  id: util.uuid(),
                  generate_all: false
                }
              },
            },
          ],
        }),
        http_common_info: {
          aid: Number(DEFAULT_ASSISTANT_ID),
        },
      },
    }
  );
  const historyId = aigc_data.history_record_id;
  if (!historyId)
    throw new APIException(EX.API_IMAGE_GENERATION_FAILED, "记录ID不存在");

  const maxPollCount = 900;
  const expectedImageCount = getDreaminaImageCompletion(aigc_data, 4).expectedCount;

  const poller = new SmartPoller({
    maxPollCount,
    expectedItemCount: expectedImageCount,
    type: 'image'
  });

  const { result: pollingResult, data: finalTaskInfo } = await poller.poll(async () => {
    // 不传递 image_info 参数，以获取原始分辨率的图片URL
    const response = await request("post", "/mweb/v1/get_history_by_ids", refreshToken, {
      proxyUrl: proxyOpts.proxyUrl,
      data: {
        history_ids: [historyId],
      },
    });

    if (!response[historyId]) {
      logger.error(`历史记录不存在: historyId=${historyId}`);
      throw new APIException(EX.API_IMAGE_GENERATION_FAILED, "记录不存在");
    }

    const taskInfo = response[historyId];
    const currentStatus = taskInfo.status;
    const currentFailCode = taskInfo.fail_code;
    const finishTime = taskInfo.task?.finish_time || 0;
    const completion = getDreaminaImageCompletion(taskInfo, expectedImageCount);
    const statusForPolling =
      currentStatus === 30 && completion.completedCount >= completion.expectedCount
        ? 20
        : currentStatus;

    return {
      status: {
        status: statusForPolling,
        failCode: currentFailCode,
        itemCount: completion.completedCount,
        finishTime,
        historyId
      } as PollingStatus,
      data: taskInfo
    };
  }, historyId);

  const item_list = finalTaskInfo.item_list || [];

  logDreaminaFailedImages("图像生成", finalTaskInfo.failed_item_list || []);
  const imageUrls = ensureDreaminaImageUrls(
    getDreaminaImageUrls(item_list),
    finalTaskInfo,
    "图像生成",
  );

  logger.info(`图像生成完成: 成功生成 ${imageUrls.length} 张图片，总耗时 ${pollingResult.elapsedTime} 秒，最终状态: ${pollingResult.status}`);

  return imageUrls;
}

export default {
  generateImages,
  generateImageComposition,
};
