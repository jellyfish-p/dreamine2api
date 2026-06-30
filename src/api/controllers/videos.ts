import _ from "lodash";
import crypto from "crypto";

import APIException from "@/lib/exceptions/APIException.ts";
import EX from "@/api/consts/exceptions.ts";
import util from "@/lib/util.ts";
import { getCredit, receiveCredit, request, type RequestProxyOptions } from "./core.ts";
import logger from "@/lib/logger.ts";
import { SmartPoller, PollingStatus } from "@/lib/smart-poller.ts";
import { DEFAULT_ASSISTANT_ID, DRAFT_VERSION } from "@/api/consts/common.ts";
import { resolveModelReqKey as resolvePublicModel } from "@/lib/pool/model-catalog.ts";

export const DEFAULT_MODEL = "seedance-2.0";

export function getModel(model: string) {
  const resolved = resolvePublicModel(model || DEFAULT_MODEL);
  return resolved || "dreamina_seedance_40_pro";
}

// AWS4-HMAC-SHA256 签名生成函数
function createSignature(
  method: string,
  url: string,
  headers: { [key: string]: string },
  accessKeyId: string,
  secretAccessKey: string,
  sessionToken?: string,
  payload: string = ''
) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname || '/';
  const search = urlObj.search;
  
  const timestamp = headers['x-amz-date'];
  const date = timestamp.substr(0, 8);
  const region = 'us-east-1';
  const service = 'imagex';
  
  const queryParams: Array<[string, string]> = [];
  const searchParams = new URLSearchParams(search);
  searchParams.forEach((value, key) => {
    queryParams.push([key, value]);
  });
  
  queryParams.sort(([a], [b]) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
  
  const canonicalQueryString = queryParams
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  
  const headersToSign: { [key: string]: string } = {
    'x-amz-date': timestamp
  };
  
  if (sessionToken) {
    headersToSign['x-amz-security-token'] = sessionToken;
  }
  
  let payloadHash = crypto.createHash('sha256').update('').digest('hex');
  if (method.toUpperCase() === 'POST' && payload) {
    payloadHash = crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
    headersToSign['x-amz-content-sha256'] = payloadHash;
  }
  
  const signedHeaders = Object.keys(headersToSign)
    .map(key => key.toLowerCase())
    .sort()
    .join(';');
  
  const canonicalHeaders = Object.keys(headersToSign)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map(key => `${key.toLowerCase()}:${headersToSign[key].trim()}\n`)
    .join('');
  
  const canonicalRequest = [
    method.toUpperCase(),
    pathname,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join('\n');
  
  const credentialScope = `${date}/${region}/${service}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    timestamp,
    credentialScope,
    crypto.createHash('sha256').update(canonicalRequest, 'utf8').digest('hex')
  ].join('\n');
  
  const kDate = crypto.createHmac('sha256', `AWS4${secretAccessKey}`).update(date).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
  const kService = crypto.createHmac('sha256', kRegion).update(service).digest();
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');
  
  return `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
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
    crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xFF];
  }
  return ((crc ^ (-1)) >>> 0).toString(16).padStart(8, '0');
}

function getUploadFilename(imageUrl: string, contentType: string | null, prefix = "dreamina-video-frame"): string {
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

// 视频专用图片上传功能
async function uploadImageForVideo(imageUrl: string, refreshToken: string): Promise<string> {
  try {
    logger.info(`开始上传视频图片: ${imageUrl}`);
    
    const tokenResult = await request("post", "/mweb/v1/get_upload_token", refreshToken, {
      data: {
        scene: 2,
      },
    });
    
    const { access_key_id, secret_access_key, session_token, service_id } = tokenResult;
    if (!access_key_id || !secret_access_key || !session_token) {
      throw new Error("获取上传令牌失败");
    }
    
    const actualServiceId = service_id || "tb4s082cfz";
    logger.info(`获取上传令牌成功: service_id=${actualServiceId}`);
    
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`下载图片失败: ${imageResponse.status}`);
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const fileSize = imageBuffer.byteLength;
    const crc32 = calculateCRC32(imageBuffer);
    const uploadFilename = getUploadFilename(imageUrl, imageResponse.headers.get('content-type'));
    
    logger.info(`图片下载完成: 大小=${fileSize}字节, CRC32=${crc32}`);
    
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:\-]/g, '').replace(/\.\d{3}Z$/, 'Z');
    
    const randomStr = Math.random().toString(36).substring(2, 12);
    const applyUrl = `https://imagex.bytedanceapi.com/?Action=ApplyImageUpload&Version=2018-08-01&ServiceId=${actualServiceId}&FileSize=${fileSize}&s=${randomStr}`;
    
    const requestHeaders = {
      'x-amz-date': timestamp,
      'x-amz-security-token': session_token
    };
    
    const authorization = createSignature('GET', applyUrl, requestHeaders, access_key_id, secret_access_key, session_token);
    
    logger.info(`申请上传权限: ${applyUrl}`);
    
    const applyResponse = await fetch(applyUrl, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'authorization': authorization,
        'origin': 'https://dreamina.capcut.com',
        'referer': 'https://dreamina.capcut.com/ai-tool/video/generate',
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
        'Referer': 'https://dreamina.capcut.com/ai-tool/video/generate',
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
        'referer': 'https://dreamina.capcut.com/ai-tool/video/generate',
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
    if (pluginResult && pluginResult.ImageUri) {
      logger.info(`视频图片上传完成: ${pluginResult.ImageUri}`);
      return pluginResult.ImageUri;
    }
    
    logger.info(`视频图片上传完成: ${fullImageUri}`);
    return fullImageUri;
    
  } catch (error: any) {
    logger.error(`视频图片上传失败: ${error.message}`);
    throw error;
  }
}

/**
 * 生成视频
 */
export async function generateVideo(
  _model: string,
  prompt: string,
  {
    width = 1024,
    height = 1024,
    resolution = "720p",
    filePaths = [],
  }: {
    width?: number;
    height?: number;
    resolution?: string;
    filePaths?: string[];
  },
  refreshToken: string,
  proxyOpts: RequestProxyOptions = {}
) {
  const model = getModel(_model);
  logger.info(`使用模型: ${_model} 映射模型: ${model} ${width}x${height} 分辨率: ${resolution}`);

  // 海外站暂时跳过积分检查
  try {
    const { totalCredit } = await getCredit(refreshToken, proxyOpts);
    if (totalCredit <= 0)
      await receiveCredit(refreshToken);
  } catch (creditError: any) {
    logger.warn(`获取积分失败，继续尝试生成: ${creditError.message}`);
  }

  let first_frame_image = undefined;
  let end_frame_image = undefined;
  
  if (filePaths && filePaths.length > 0) {
    let uploadIDs: string[] = [];
    logger.info(`开始上传 ${filePaths.length} 张图片用于视频生成`);
    
    for (let i = 0; i < filePaths.length; i++) {
      const filePath = filePaths[i];
      if (!filePath) {
        logger.warn(`第 ${i + 1} 张图片路径为空，跳过`);
        continue;
      }
      
      try {
        logger.info(`开始上传第 ${i + 1} 张图片: ${filePath}`);
        const imageUri = await uploadImageForVideo(filePath, refreshToken);
        
        if (imageUri) {
          uploadIDs.push(imageUri);
          logger.info(`第 ${i + 1} 张图片上传成功: ${imageUri}`);
        } else {
          logger.error(`第 ${i + 1} 张图片上传失败: 未获取到 image_uri`);
        }
      } catch (error: any) {
        logger.error(`第 ${i + 1} 张图片上传失败: ${error.message}`);
        
        if (i === 0) {
          logger.error(`首帧图片上传失败，停止视频生成以避免浪费积分`);
          throw new APIException(EX.API_REQUEST_FAILED, `首帧图片上传失败: ${error.message}`);
        } else {
          logger.warn(`第 ${i + 1} 张图片上传失败，将跳过此图片继续处理`);
        }
      }
    }
    
    logger.info(`图片上传完成，成功上传 ${uploadIDs.length} 张图片`);
    
    if (uploadIDs.length === 0) {
      logger.error(`所有图片上传失败，停止视频生成以避免浪费积分`);
      throw new APIException(EX.API_REQUEST_FAILED, '所有图片上传失败，请检查图片URL是否有效');
    }
    
    if (uploadIDs[0]) {
      first_frame_image = {
        format: "",
        height: height,
        id: util.uuid(),
        image_uri: uploadIDs[0],
        name: "",
        platform_type: 1,
        source_from: "upload",
        type: "image",
        uri: uploadIDs[0],
        width: width,
      };
      logger.info(`设置首帧图片: ${uploadIDs[0]}`);
    }
    
    if (uploadIDs[1]) {
      end_frame_image = {
        format: "",
        height: height,
        id: util.uuid(),
        image_uri: uploadIDs[1],
        name: "",
        platform_type: 1,
        source_from: "upload",
        type: "image",
        uri: uploadIDs[1],
        width: width,
      };
      logger.info(`设置尾帧图片: ${uploadIDs[1]}`);
    } else if (filePaths.length > 1) {
      logger.warn(`第二张图片上传失败或未提供，将仅使用首帧图片`);
    }
  } else {
    logger.info(`未提供图片文件，将进行纯文本视频生成`);
  }

  const componentId = util.uuid();
  const metricsExtra = JSON.stringify({
    "enterFrom": "click",
    "isDefaultSeed": 1,
    "promptSource": "custom",
    "isRegenerate": false,
    "originSubmitId": util.uuid(),
  });
  
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(width, height);
  const aspectRatio = `${width / divisor}:${height / divisor}`;
  
  const { aigc_data } = await request(
    "post",
    "/mweb/v1/aigc_draft/generate",
    refreshToken,
    {
      proxyUrl: proxyOpts.proxyUrl,
      params: {
        aigc_features: "app_lip_sync",
        web_version: "6.6.0",
        da_version: DRAFT_VERSION,
      },
      data: {
        "extend": {
          "root_model": end_frame_image ? "dreamina_ic_generate_video_model_vgfm_3.0" : model,
          "m_video_commerce_info": {
            benefit_type: "basic_video_operation_vgfm_v_three",
            resource_id: "generate_video",
            resource_id_type: "str",
            resource_sub_type: "aigc"
          },
          "m_video_commerce_info_list": [{
            benefit_type: "basic_video_operation_vgfm_v_three",
            resource_id: "generate_video",
            resource_id_type: "str",
            resource_sub_type: "aigc"
          }]
        },
        "submit_id": util.uuid(),
        "metrics_extra": metricsExtra,
        "draft_content": JSON.stringify({
          "type": "draft",
          "id": util.uuid(),
          "min_version": "3.0.5",
          "is_from_tsn": true,
          "version": DRAFT_VERSION,
          "main_component_id": componentId,
          "component_list": [{
            "type": "video_base_component",
            "id": componentId,
            "min_version": "1.0.0",
            "metadata": {
              "type": "",
              "id": util.uuid(),
              "created_platform": 3,
              "created_platform_version": "",
              "created_time_in_ms": Date.now(),
              "created_did": ""
            },
            "generate_type": "gen_video",
            "aigc_mode": "workbench",
            "abilities": {
              "type": "",
              "id": util.uuid(),
              "gen_video": {
                "id": util.uuid(),
                "type": "",
                "text_to_video_params": {
                  "type": "",
                  "id": util.uuid(),
                  "model_req_key": model,
                  "priority": 0,
                  "seed": Math.floor(Math.random() * 100000000) + 2500000000,
                  "video_aspect_ratio": aspectRatio,
                  "video_gen_inputs": [{
                    duration_ms: 5000,
                    first_frame_image: first_frame_image,
                    end_frame_image: end_frame_image,
                    fps: 24,
                    id: util.uuid(),
                    min_version: "3.0.5",
                    prompt: prompt,
                    resolution: resolution,
                    type: "",
                    video_mode: 2
                  }]
                },
                "video_task_extra": metricsExtra,
              }
            }
          }],
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

  let status = 20, failCode, item_list: any[] = [];
  let retryCount = 0;
  const maxRetries = 60;
  
  await new Promise((resolve) => setTimeout(resolve, 5000));
  
  logger.info(`开始轮询视频生成结果，历史ID: ${historyId}，最大重试次数: ${maxRetries}`);
  logger.info(`Dreamina官网API地址: https://dreamina.capcut.com/mweb/v1/get_history_by_ids`);
  logger.info(`视频生成请求已发送，请同时在Dreamina官网查看: https://dreamina.capcut.com/ai-tool/video/generate`);
  
  while (status === 20 && retryCount < maxRetries) {
    try {
      const requestUrl = "/mweb/v1/get_history_by_ids";
      const requestData = {
        history_ids: [historyId],
      };
      
      let result;
      let useAlternativeApi = retryCount > 10 && retryCount % 2 === 0;
      
      if (useAlternativeApi) {
        logger.info(`尝试备用API请求方式，URL: ${requestUrl}, 历史ID: ${historyId}, 重试次数: ${retryCount + 1}/${maxRetries}`);
        const alternativeRequestData = {
          history_record_ids: [historyId],
        };
        result = await request("post", "/mweb/v1/get_history_records", refreshToken, {
          data: alternativeRequestData,
        });
        logger.info(`备用API响应: ${JSON.stringify(result)}`);
        
        const responseStr = JSON.stringify(result);
        const videoUrlMatch = responseStr.match(/https:\/\/v[0-9]+-artist\.vlabvod\.com\/[^"\s]+/);
        if (videoUrlMatch && videoUrlMatch[0]) {
          logger.info(`从备用API响应中直接提取到视频URL: ${videoUrlMatch[0]}`);
          return videoUrlMatch[0];
        }
      } else {
        logger.info(`发送请求获取视频生成结果，URL: ${requestUrl}, 历史ID: ${historyId}, 重试次数: ${retryCount + 1}/${maxRetries}`);
        result = await request("post", requestUrl, refreshToken, {
          data: requestData,
        });
        const responseStr = JSON.stringify(result);
        logger.info(`标准API响应摘要: ${responseStr.substring(0, 300)}...`);
        
        const videoUrlMatch = responseStr.match(/https:\/\/v[0-9]+-artist\.vlabvod\.com\/[^"\s]+/);
        if (videoUrlMatch && videoUrlMatch[0]) {
          logger.info(`从标准API响应中直接提取到视频URL: ${videoUrlMatch[0]}`);
          return videoUrlMatch[0];
        }
      }
      

      let historyData;
      
      if (useAlternativeApi && result.history_records && result.history_records.length > 0) {
        historyData = result.history_records[0];
        logger.info(`从备用API获取到历史记录`);
      } else if (result.history_list && result.history_list.length > 0) {
        historyData = result.history_list[0];
        logger.info(`从标准API获取到历史记录`);
      } else {
        logger.warn(`历史记录不存在，重试中 (${retryCount + 1}/${maxRetries})... 历史ID: ${historyId}`);
        logger.info(`请同时在Dreamina官网检查视频是否已生成: https://dreamina.capcut.com/ai-tool/video/generate`);
        
        retryCount++;
        const waitTime = Math.min(2000 * (retryCount + 1), 30000);
        logger.info(`等待 ${waitTime}ms 后进行第 ${retryCount + 1} 次重试`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }
      
      logger.info(`获取到历史记录结果: ${JSON.stringify(historyData)}`);
      

      status = historyData.status;
      failCode = historyData.fail_code;
      item_list = historyData.item_list || [];
      
      logger.info(`视频生成状态: ${status}, 失败代码: ${failCode || '无'}, 项目列表长度: ${item_list.length}`);
      
      let tempVideoUrl = item_list?.[0]?.video?.transcoded_video?.origin?.video_url;
      if (!tempVideoUrl) {
        tempVideoUrl = item_list?.[0]?.video?.play_url || 
                      item_list?.[0]?.video?.download_url || 
                      item_list?.[0]?.video?.url;
      }
      
      if (tempVideoUrl) {
        logger.info(`检测到视频URL: ${tempVideoUrl}`);
      }

      if (status === 30) {
        const error = failCode === '2038' 
          ? new APIException(EX.API_CONTENT_FILTERED, "内容被过滤")
          : new APIException(EX.API_IMAGE_GENERATION_FAILED, `生成失败，错误码: ${failCode}`);
        error.historyId = historyId;
        throw error;
      }
      
      if (status === 20) {
        const waitTime = 2000 * (Math.min(retryCount + 1, 5));
        logger.info(`视频生成中，状态码: ${status}，等待 ${waitTime}ms 后继续查询`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    } catch (error: any) {
      logger.error(`轮询视频生成结果出错: ${error.message}`);
      retryCount++;
      await new Promise((resolve) => setTimeout(resolve, 2000 * (retryCount + 1)));
    }
  }
  
  if (retryCount >= maxRetries && status === 20) {
    logger.error(`视频生成超时，已尝试 ${retryCount} 次，总耗时约 ${Math.floor(retryCount * 2000 / 1000 / 60)} 分钟`);
    const error = new APIException(EX.API_IMAGE_GENERATION_FAILED, "获取视频生成结果超时，请稍后在Dreamina官网查看您的视频");
    error.historyId = historyId;
    throw error;
  }

  let videoUrl = item_list?.[0]?.video?.transcoded_video?.origin?.video_url;
  
  if (!videoUrl) {
    if (item_list?.[0]?.video?.play_url) {
      videoUrl = item_list[0].video.play_url;
      logger.info(`从play_url获取到视频URL: ${videoUrl}`);
    } else if (item_list?.[0]?.video?.download_url) {
      videoUrl = item_list[0].video.download_url;
      logger.info(`从download_url获取到视频URL: ${videoUrl}`);
    } else if (item_list?.[0]?.video?.url) {
      videoUrl = item_list[0].video.url;
      logger.info(`从url获取到视频URL: ${videoUrl}`);
    } else {
      logger.error(`未能获取视频URL，item_list: ${JSON.stringify(item_list)}`);
      const error = new APIException(EX.API_IMAGE_GENERATION_FAILED, "未能获取视频URL，请稍后在Dreamina官网查看");
      error.historyId = historyId;
      throw error;
    }
  }

  logger.info(`视频生成成功，URL: ${videoUrl}`);
  return videoUrl;
}
