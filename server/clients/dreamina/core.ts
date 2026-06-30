import path from "path";
import _ from "lodash";
import mime from "mime";
import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

import APIException from "~~/server/utils/errors/APIException";
import EX from "~~/server/clients/dreamina/consts/exceptions";
import logger from "~~/server/utils/logger";
import util from "~~/server/utils/util";
import { DreaminaErrorHandler } from "~~/server/clients/dreamina/error-handler";
import type { DreaminaErrorResponse } from "~~/server/clients/dreamina/error-handler";
import { DEFAULT_ASSISTANT_ID, PLATFORM_CODE, VERSION_CODE, RETRY_CONFIG, APP_SDK_VERSION, WEB_VERSION, DA_VERSION } from "~~/server/clients/dreamina/consts/common";
import { withProxyConfig } from "~~/server/clients/proxy/agents";
import { resolveApiProxy, resolveCreditProxy } from "~~/server/services/pool/settings";

export type RequestProxyOptions = { proxyUrl?: string | null };

// 模型名称
const MODEL_NAME = "dreamina";
// 设备ID - 使用固定格式的大数字
const DEVICE_ID = Math.floor(Math.random() * 999999999999999999) + 7000000000000000000;
// WebID
const WEB_ID = Math.floor(Math.random() * 999999999999999999) + 7000000000000000000;
// 用户ID
const USER_ID = util.uuid(false);

// 海外站 API 基础域名
const API_BASE_URL = "https://dreamina-api.us.capcut.com";
// 海外站积分 API 域名
const COMMERCE_API_URL = "https://commerce.us.capcut.com";
const COMMERCE_CREDIT_BASE_URL = "https://commerce-api-sg.capcut.com";
const COMMERCE_CREDIT_URI = "/commerce/v1/benefits/user_credit";
const DEFAULT_COMMERCE_CREDIT_DEVICE_ID = `765${util.generateRandomString({
  length: 16,
  charset: "numeric",
})}`;
// 伪装headers (海外站)
const FAKE_HEADERS = {
  "Accept": "application/json, text/plain, */*",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "zh-CN,zh;q=0.9",
  "Cache-Control": "no-cache",
  "Content-Type": "application/json",
  "App-Sdk-Version": APP_SDK_VERSION,
  "Appid": DEFAULT_ASSISTANT_ID,
  "Appvr": VERSION_CODE,
  "Origin": "https://dreamina.capcut.com",
  "Pragma": "no-cache",
  "Priority": "u=1, i",
  "Referer": "https://dreamina.capcut.com/",
  "Pf": PLATFORM_CODE,
  "Lan": "en",
  "Loc": "US",
  "Store-Country-Code": "us",
  "Store-Country-Code-Src": "uid",
  "Sec-Ch-Ua": '"Not(A:Brand";v="8", "Chromium";v="144", "Microsoft Edge";v="144"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"macOS"',
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-site",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
};
// 文件最大大小
const FILE_MAX_SIZE = 100 * 1024 * 1024;

export type CommerceCreditRequestOptions = {
  deviceTime?: number;
  deviceId?: string;
  uifid?: string;
};

export type CommerceCreditRequest = {
  method: "POST";
  url: string;
  headers: Record<string, string>;
  data: Record<string, never>;
};

export type CommerceCreditPoints = {
  giftCredit: number;
  purchaseCredit: number;
  vipCredit: number;
  totalCredit: number;
};

export async function buildCommerceCreditRequest(
  refreshToken: string,
  options: CommerceCreditRequestOptions = {}
): Promise<CommerceCreditRequest> {
  const token = await acquireToken(refreshToken);
  const deviceTime = options.deviceTime ?? util.unixTimestamp();
  const deviceId = options.deviceId ?? DEFAULT_COMMERCE_CREDIT_DEVICE_ID;
  const sign = util.md5(
    `9e2c|${COMMERCE_CREDIT_URI.slice(-7)}|${PLATFORM_CODE}|${VERSION_CODE}|${deviceTime}||11ac`
  );
  const url = new URL(`${COMMERCE_CREDIT_BASE_URL}${COMMERCE_CREDIT_URI}`);
  const uifid = options.uifid || process.env.DREAMINE_CREDIT_UIFID || "";
  if (uifid) url.searchParams.set("uifid", uifid);
  url.searchParams.set("timestamp", String(deviceTime));

  return {
    method: "POST",
    url: url.toString(),
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      appid: DEFAULT_ASSISTANT_ID,
      appvr: VERSION_CODE,
      "content-type": "application/json",
      "device-time": String(deviceTime),
      did: deviceId,
      lan: "EN",
      origin: "https://dreamina.capcut.com",
      pf: PLATFORM_CODE,
      referer: "https://dreamina.capcut.com/",
      "sec-ch-ua": '"Not;A=Brand";v="8", "Chromium";v="150", "Microsoft Edge";v="150"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      sign,
      "sign-ver": "1",
      "store-country-code": "vn",
      "store-country-code-src": "uid",
      tdid: "",
      "x-secsdk-sign-config": "1_5000",
      cookie: generateCookie(token),
    },
    data: {},
  };
}

export const buildCommerceCreditHistoryRequest = buildCommerceCreditRequest;

function getCommerceCreditPayload(body: any): Record<string, any> {
  if (body?.data && typeof body.data === "object") return body.data;
  if (typeof body?.response === "string") {
    const parsed = util.ignoreJSONParse(body.response);
    if (parsed && typeof parsed === "object") return parsed;
  }
  return {};
}

export function normalizeCommerceCreditResponse(body: any): CommerceCreditPoints {
  const ok =
    body?.ret === "0" ||
    body?.ret === 0 ||
    body?.code === "0" ||
    body?.code === 0 ||
    body?.err_no === 0;
  if (!ok) {
    throw new Error(`积分查询失败: ${body?.errmsg || body?.message || body?.ret || body?.code || "未知错误"}`);
  }

  const payload = getCommerceCreditPayload(body);
  const credit = payload.credit && typeof payload.credit === "object" ? payload.credit : null;
  if (credit) {
    const giftCredit = Number(credit.gift_credit ?? 0);
    const purchaseCredit = Number(credit.purchase_credit ?? 0);
    const vipCredit = Number(credit.vip_credit ?? 0);
    const totalCredit = giftCredit + purchaseCredit + vipCredit;
    if (![giftCredit, purchaseCredit, vipCredit, totalCredit].every(Number.isFinite)) {
      throw new Error("积分查询返回异常格式: credit 字段非数字");
    }

    return {
      giftCredit,
      purchaseCredit,
      vipCredit,
      totalCredit,
    };
  }

  const totalCredit = Number(payload.total_credit ?? 0);
  if (!Number.isFinite(totalCredit)) {
    throw new Error("积分查询返回异常格式: total_credit 非数字");
  }

  return {
    giftCredit: totalCredit,
    purchaseCredit: 0,
    vipCredit: 0,
    totalCredit,
  };
}

/**
 * 获取缓存中的access_token
 *
 * 目前dreamina的access_token是固定的，暂无刷新功能
 *
 * @param refreshToken 用于刷新access_token的refresh_token
 */
export async function acquireToken(refreshToken: string): Promise<string> {
  return refreshToken;
}

/**
 * 生成cookie (海外站格式)
 */
export function generateCookie(refreshToken: string) {
  const timestamp = util.unixTimestamp();
  return [
    `store-idc=useast5`,
    `store-country-code=us`,
    `store-country-code-src=uid`,
    `cc-target-idc=useast5`,
    `sid_guard=${refreshToken}%7C${timestamp}%7C5184000%7CWed%2C+25-Mar-2026+12%3A16%3A01+GMT`,
    `uid_tt=${USER_ID}`,
    `uid_tt_ss=${USER_ID}`,
    `sid_tt=${refreshToken}`,
    `sessionid=${refreshToken}`,
    `sessionid_ss=${refreshToken}`,
  ].join("; ");
}

/**
 * 获取积分信息 (海外站使用 user_credit 接口)
 *
 * @param refreshToken 用于刷新access_token的refresh_token
 */
export async function getCredit(refreshToken: string, proxyOpts: RequestProxyOptions = {}) {
  try {
    const requestConfig = await buildCommerceCreditRequest(refreshToken);
    logger.info(`发送积分请求: POST ${requestConfig.url}`);

    const proxyUrl = resolveCreditProxy(proxyOpts.proxyUrl);
    const response = await axios.request(
      withProxyConfig(
        {
          ...requestConfig,
          timeout: 30000,
          validateStatus: () => true,
        },
        proxyUrl
      )
    );

    if (response.status >= 400) {
      throw new Error(`HTTP错误: ${response.status}`);
    }

    const points = normalizeCommerceCreditResponse(response.data);
    logger.info(`\n积分信息: 总积分: ${points.totalCredit}`);
    return points;
  } catch (error: any) {
    logger.warn(`获取积分失败: ${error.message}，跳过积分检查`);
    return { giftCredit: 999, purchaseCredit: 0, vipCredit: 0, totalCredit: 999 };
  }
}

/**
 * 接收今日积分 (海外站可能不需要此功能)
 *
 * @param refreshToken 用于刷新access_token的refresh_token
 */
export async function receiveCredit(refreshToken: string) {
  logger.info("海外站暂不支持自动收取积分，跳过");
  return 0;
}

/**
 * 请求积分相关API (使用 commerce.us.capcut.com)
 */
export async function requestCommerce(
  method: string,
  uri: string,
  refreshToken: string,
  options: AxiosRequestConfig = {},
  proxyOpts: RequestProxyOptions = {}
) {
  const token = await acquireToken(refreshToken);
  const deviceTime = util.unixTimestamp();
  const sign = util.md5(
    `9e2c|${uri.slice(-7)}|${PLATFORM_CODE}|${VERSION_CODE}|${deviceTime}||11ac`
  );

  const fullUrl = `${COMMERCE_API_URL}${uri}`;
  
  const headers = {
    ...FAKE_HEADERS,
    Cookie: generateCookie(token),
    "Device-Time": deviceTime.toString(),
    "Sign": sign,
    "Sign-Ver": "1",
    "Tdid": "",
    ...(options.headers || {}),
  };

  logger.info(`发送积分请求: ${method.toUpperCase()} ${fullUrl}`);

  const proxyUrl = resolveCreditProxy(proxyOpts.proxyUrl);
  try {
    const response = await axios.request(
      withProxyConfig(
        {
          method,
          url: fullUrl,
          headers: headers,
          timeout: 30000,
          validateStatus: () => true,
          ..._.omit(options, "headers"),
        },
        proxyUrl
      )
    );

    if (response.status >= 400) {
      throw new Error(`HTTP错误: ${response.status}`);
    }

    const { ret, data } = response.data;
    if (ret === "0" || ret === 0) {
      return data;
    }
    
    throw new Error(`API错误: ${response.data.errmsg || '未知错误'}`);
  } catch (error: any) {
    logger.error(`积分API请求失败: ${error.message}`);
    throw error;
  }
}

/**
 * 请求dreamina API (使用 dreamina-api.us.capcut.com)
 *
 * @param method 请求方法
 * @param uri 请求路径
 * @param params 请求参数
 * @param headers 请求头
 */
export async function request(
  method: string,
  uri: string,
  refreshToken: string,
  options: AxiosRequestConfig & RequestProxyOptions = {}
) {
  const { proxyUrl, ...axiosOpts } = options;
  const token = await acquireToken(refreshToken);
  const deviceTime = util.unixTimestamp();
  const sign = util.md5(
    `9e2c|${uri.slice(-7)}|${PLATFORM_CODE}|${VERSION_CODE}|${deviceTime}||11ac`
  );

  const fullUrl = `${API_BASE_URL}${uri}`;
  const requestParams = {
    aid: DEFAULT_ASSISTANT_ID,
    device_platform: "web",
    region: "US",
    da_version: DA_VERSION,
    os: "mac",
    web_component_open_flag: 1,
    web_version: WEB_VERSION,
    aigc_features: "app_lip_sync",
    ...(axiosOpts.params || {}),
  };

  const headers = {
    ...FAKE_HEADERS,
    Cookie: generateCookie(token),
    "Device-Time": deviceTime.toString(),
    "Did": DEVICE_ID.toString(),
    "Sign": sign,
    "Sign-Ver": "1",
    "Tdid": "",
    ...(axiosOpts.headers || {}),
  };

  logger.info(`发送请求: ${method.toUpperCase()} ${fullUrl}`);
  logger.info(`请求参数: ${JSON.stringify(requestParams)}`);
  logger.info(`请求数据: ${JSON.stringify(axiosOpts.data || {})}`);

  // 添加重试逻辑
  let retries = 0;
  const maxRetries = RETRY_CONFIG.MAX_RETRY_COUNT;
  let lastError = null;

  while (retries <= maxRetries) {
    try {
      if (retries > 0) {
        logger.info(`第 ${retries} 次重试请求: ${method.toUpperCase()} ${fullUrl}`);
        // 重试前等待一段时间
        await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.RETRY_DELAY));
      }

      const response = await axios.request(
        withProxyConfig(
          {
            method,
            url: fullUrl,
            params: requestParams,
            headers: headers,
            timeout: 45000,
            validateStatus: () => true,
            ..._.omit(axiosOpts, "params", "headers"),
          },
          resolveApiProxy(proxyUrl)
        )
      );

      // 记录响应状态和头信息
      logger.info(`响应状态: ${response.status} ${response.statusText}`);

      // 流式响应直接返回response
      if (axiosOpts.responseType == "stream") return response;

      // 记录响应数据摘要
      const responseDataSummary = JSON.stringify(response.data).substring(0, 500) +
        (JSON.stringify(response.data).length > 500 ? "..." : "");
      logger.info(`响应数据摘要: ${responseDataSummary}`);

      // 检查HTTP状态码
      if (response.status >= 400) {
        logger.warn(`HTTP错误: ${response.status} ${response.statusText}`);
        if (retries < maxRetries) {
          retries++;
          continue;
        }
      }

      return checkResult(response);
    }
    catch (error: any) {
      lastError = error;
      logger.error(`请求失败 (尝试 ${retries + 1}/${maxRetries + 1}): ${error.message}`);

      // 如果是网络错误或超时，尝试重试
      if ((error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT' ||
           error.message.includes('timeout') || error.message.includes('network')) &&
          retries < maxRetries) {
        retries++;
        continue;
      }

      // 其他错误直接抛出
      break;
    }
  }

  // 所有重试都失败了，抛出最后一个错误
  if (lastError) {
    logger.error(`请求失败，已重试 ${retries} 次: ${lastError.message}`);
    if (lastError.response) {
      logger.error(`响应状态: ${lastError.response.status}`);
      logger.error(`响应数据: ${JSON.stringify(lastError.response.data)}`);
    }
    throw lastError;
  } else {
    // 这种情况理论上不应该发生，但为了安全起见
    const error = new Error(`请求失败，已重试 ${retries} 次，但没有具体错误信息`);
    logger.error(error.message);
    throw error;
  }
 }

 /**
  * 预检查文件URL有效性
  *
  * @param fileUrl 文件URL
  */
 export async function checkFileUrl(fileUrl: string) {
  if (util.isBASE64Data(fileUrl)) return;
  const result = await axios.head(fileUrl, {
    timeout: 15000,
    validateStatus: () => true,
  });
  if (result.status >= 400)
    throw new APIException(
      EX.API_FILE_URL_INVALID,
      `File ${fileUrl} is not valid: [${result.status}] ${result.statusText}`
    );
  // 检查文件大小
  if (result.headers && result.headers["content-length"]) {
    const fileSize = parseInt(result.headers["content-length"], 10);
    if (fileSize > FILE_MAX_SIZE)
      throw new APIException(
        EX.API_FILE_EXECEEDS_SIZE,
        `File ${fileUrl} is not valid`
      );
  }
}

/**
 * 上传文件
 *
 * @param refreshToken 用于刷新access_token的refresh_token
 * @param fileUrl 文件URL或BASE64数据
 * @param isVideoImage 是否是用于视频图像
 * @returns 上传结果，包含image_uri
 */
export async function uploadFile(
  refreshToken: string,
  fileUrl: string,
  isVideoImage: boolean = false
) {
  try {
    logger.info(`开始上传文件: ${fileUrl}, 视频图像模式: ${isVideoImage}`);

    // 预检查远程文件URL可用性
    await checkFileUrl(fileUrl);

    let filename, fileData, mimeType;
    // 如果是BASE64数据则直接转换为Buffer
    if (util.isBASE64Data(fileUrl)) {
      mimeType = util.extractBASE64DataFormat(fileUrl);
      const ext = mime.getExtension(mimeType!);
      filename = `${util.uuid()}.${ext}`;
      fileData = Buffer.from(util.removeBASE64DataHeader(fileUrl), "base64");
      logger.info(`处理BASE64数据，文件名: ${filename}, 类型: ${mimeType}, 大小: ${fileData.length}字节`);
    }
    // 下载文件到内存，如果您的服务器内存很小，建议考虑改造为流直传到下一个接口上，避免停留占用内存
    else {
      filename = path.basename(fileUrl);
      logger.info(`开始下载远程文件: ${fileUrl}`);
      ({ data: fileData } = await axios.get(fileUrl, {
        responseType: "arraybuffer",
        // 100M限制
        maxContentLength: FILE_MAX_SIZE,
        // 60秒超时
        timeout: 60000,
      }));
      logger.info(`文件下载完成，文件名: ${filename}, 大小: ${fileData.length}字节`);
    }

    // 获取文件的MIME类型
    mimeType = mimeType || mime.getType(filename);
    logger.info(`文件MIME类型: ${mimeType}`);

    // 构建FormData
    const formData = new FormData();
    const blob = new Blob([fileData], { type: mimeType! });
    formData.append('file', blob, filename);

    // 获取上传凭证
    logger.info(`请求上传凭证，场景: ${isVideoImage ? 'video_cover' : 'aigc_image'}`);
    const uploadProofUrl = 'https://imagex.bytedanceapi.com/';
    const proofResult = await request(
      'POST',
      '/mweb/v1/get_upload_image_proof',
      refreshToken,
      {
        data: {
          scene: isVideoImage ? 'video_cover' : 'aigc_image',
          file_name: filename,
          file_size: fileData.length,
        }
      }
    );

    if (!proofResult || !proofResult.proof_info) {
      logger.error(`获取上传凭证失败: ${JSON.stringify(proofResult)}`);
      throw new APIException(EX.API_REQUEST_FAILED, '获取上传凭证失败');
    }

    logger.info(`获取上传凭证成功`);

    // 上传文件
    const { proof_info } = proofResult;
    logger.info(`开始上传文件到: ${uploadProofUrl}`);

    const uploadResult = await axios.post(
      uploadProofUrl,
      formData,
      {
        headers: {
          ...proof_info.headers,
          'Content-Type': 'multipart/form-data',
        },
        params: proof_info.query_params,
        timeout: 60000,
        validateStatus: () => true, // 允许任何状态码以便详细处理
      }
    );

    logger.info(`上传响应状态: ${uploadResult.status}`);

    if (!uploadResult || uploadResult.status !== 200) {
      logger.error(`上传文件失败: 状态码 ${uploadResult?.status}, 响应: ${JSON.stringify(uploadResult?.data)}`);
      throw new APIException(EX.API_REQUEST_FAILED, `上传文件失败: 状态码 ${uploadResult?.status}`);
    }

    // 验证 proof_info.image_uri 是否存在
    if (!proof_info.image_uri) {
      logger.error(`上传凭证中缺少 image_uri: ${JSON.stringify(proof_info)}`);
      throw new APIException(EX.API_REQUEST_FAILED, '上传凭证中缺少 image_uri');
    }

    logger.info(`文件上传成功: ${proof_info.image_uri}`);

    // 返回上传结果
    return {
      image_uri: proof_info.image_uri,
      uri: proof_info.image_uri,
    }
  } catch (error: any) {
    logger.error(`文件上传过程中发生错误: ${error.message}`);
    throw error;
  }
}

/**
 * 检查请求结果
 *
 * @param result 结果
 */
export function checkResult(result: AxiosResponse) {
  const { ret, errmsg, data } = result.data;
  if (!_.isFinite(Number(ret))) return result.data;
  if (ret === '0') return data;

  // 使用统一错误处理器
  DreaminaErrorHandler.handleApiResponse(result.data as DreaminaErrorResponse, {
    context: 'Dreamina API请求',
    operation: '请求'
  });
}

/**
 * Token切分
 *
 * @param authorization 认证字符串
 */
export function tokenSplit(authorization: string) {
  return authorization.replace("Bearer ", "").split(",");
}

// 海外站 Passport 域名 (account/info 等 passport 端点在此域名, 非 dreamina-api)
const PASSPORT_API_URL = "https://login-row.www.capcut.com";

/**
 * 获取Token存活状态
 */
export async function getTokenLiveStatus(refreshToken: string, proxyOpts: RequestProxyOptions = {}) {
  try {
    const info = await getAccountInfo(refreshToken, proxyOpts);
    return !!info?.user_id;
  } catch (err) {
    return false;
  }
}

/**
 * 获取账户完整信息 (海外站 /passport/account/info/v2)
 *
 * 注意: passport 端点在 login-row.www.capcut.com, 不在 dreamina-api.us.capcut.com
 * 返回 user_id / name / screen_name / email / store_country / store_geo 等
 */
export async function getAccountInfo(refreshToken: string, proxyOpts: RequestProxyOptions = {}) {
  const token = await acquireToken(refreshToken);
  const deviceTime = util.unixTimestamp();
  const uri = "/passport/account/info/v2";
  const sign = util.md5(
    `9e2c|${uri.slice(-7)}|${PLATFORM_CODE}|${VERSION_CODE}|${deviceTime}||11ac`
  );

  const fullUrl = `${PASSPORT_API_URL}${uri}`;
  const headers = {
    ...FAKE_HEADERS,
    Cookie: generateCookie(token),
    "Device-Time": deviceTime.toString(),
    "Sign": sign,
    "Sign-Ver": "1",
    "Tdid": "",
  };

  logger.info(`发送账户信息请求: POST ${fullUrl}`);

  const proxyUrl = resolveApiProxy(proxyOpts.proxyUrl);
  const response = await axios.request(
    withProxyConfig(
      {
        method: "POST",
        url: fullUrl,
        params: {
          aid: DEFAULT_ASSISTANT_ID,
          device_platform: "web",
          region: "US",
          account_sdk_source: "web",
        },
        headers,
        timeout: 30000,
        validateStatus: () => true,
      },
      proxyUrl
    )
  );

  if (response.status >= 400) {
    throw new Error(`HTTP错误: ${response.status}`);
  }
  const { ret, data, errmsg } = response.data;
  if (ret === "0" || ret === 0) {
    return data as Record<string, any>;
  }
  throw new Error(`账户信息查询失败: ${errmsg || ret}`);
}

