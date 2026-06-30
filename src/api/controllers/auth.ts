import axios, { AxiosRequestConfig } from "axios";
import _ from "lodash";

import APIException from "@/lib/exceptions/APIException.ts";
import EX from "@/api/consts/exceptions.ts";
import util from "@/lib/util.ts";
import logger from "@/lib/logger.ts";
import { DEFAULT_ASSISTANT_ID, PLATFORM_CODE, VERSION_CODE, APP_SDK_VERSION, WEB_VERSION } from "@/api/consts/common.ts";
import { withProxyConfig } from "@/lib/proxy/agents.ts";
import { resolveApiProxy } from "@/lib/pool/settings.ts";
import type { RequestProxyOptions } from "./core.ts";

// 海外站 Passport 域名 (passport.us.capcut.com 在国内被 SNI 阻断,
// 改用网页真实登录域名 login-row.www.capcut.com, 经 CDN 可达)
const PASSPORT_API_URL = "https://login-row.www.capcut.com";

// 伪装 headers (海外站)
const PASSPORT_HEADERS = {
  "Accept": "application/json, text/plain, */*",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "zh-CN,zh;q=0.9",
  "Cache-Control": "no-cache",
  "Content-Type": "application/x-www-form-urlencoded",
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

/**
 * ByteDance passport mix_mode=1 / fixed_mix_mode=1 字段混淆
 *
 * 网页真实算法: 每个字符 charCode XOR 0x05, 转 2 位小写 hex 拼接
 * 用于 email 与 password 字段 (mix_mode=1 标识已混淆)
 */
function mixEncode(text: string): string {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    out += (text.charCodeAt(i) ^ 0x05).toString(16).padStart(2, "0");
  }
  return out;
}

export interface LoginResult {
  sessionId: string;
  userId?: string;
  userInfo?: Record<string, unknown>;
}

/**
 * 邮箱密码登录 Dreamina（海外站 passport）
 *
 * @param email 邮箱
 * @param password 明文密码
 * @param proxyOpts 代理选项
 */
export async function loginWithEmail(
  email: string,
  password: string,
  proxyOpts: RequestProxyOptions = {}
): Promise<LoginResult> {
  const cleanEmail = email.trim();
  if (!cleanEmail) {
    throw new APIException(EX.API_REQUEST_PARAMS_INVALID, "邮箱不能为空");
  }
  if (!password) {
    throw new APIException(EX.API_REQUEST_PARAMS_INVALID, "密码不能为空");
  }

  const encPassword = mixEncode(password);
  const encEmail = mixEncode(cleanEmail);
  const deviceTime = util.unixTimestamp();
  const uri = "/passport/web/email/login/";
  const sign = util.md5(
    `9e2c|${uri.slice(-7)}|${PLATFORM_CODE}|${VERSION_CODE}|${deviceTime}||11ac`
  );

  const fullUrl = `${PASSPORT_API_URL}${uri}`;
  // 网页真实协议: form-urlencoded, email/password 用 mixEncode(XOR 0x05) 混淆
  const requestData = new URLSearchParams();
  requestData.append("mix_mode", "1");
  requestData.append("email", encEmail);
  requestData.append("password", encPassword);
  requestData.append("fixed_mix_mode", "1");
  requestData.append("account_sdk_source", "web");
  requestData.append("aid", String(DEFAULT_ASSISTANT_ID));

  const params = {
    aid: DEFAULT_ASSISTANT_ID,
    device_platform: "web",
    region: "US",
  };

  const headers = {
    ...PASSPORT_HEADERS,
    "Device-Time": deviceTime.toString(),
    "Sign": sign,
    "Sign-Ver": "1",
    "Tdid": "",
  };

  const axiosConfig: AxiosRequestConfig = {
    method: "POST",
    url: fullUrl,
    params,
    headers,
    data: requestData,
    timeout: 45000,
    validateStatus: () => true,
    maxRedirects: 0,
  };

  logger.info(`开始邮箱登录: ${cleanEmail}`);

  const proxyUrl = resolveApiProxy(proxyOpts.proxyUrl);
  if (!proxyUrl) {
    logger.warn(
      `未配置代理，直连 login-row.www.capcut.com 可能被网络阻断(ECONNRESET)。建议在配置中设置 global_proxy_url`
    );
  }

  let response;
  const maxAttempts = 3;
  let lastError: any;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      response = await axios.request(withProxyConfig(axiosConfig, proxyUrl));
      break;
    } catch (e: any) {
      lastError = e;
      const code = e?.code || "";
      logger.error(`登录请求失败(第 ${attempt}/${maxAttempts} 次): ${code} ${e.message}`);
      if (
        attempt < maxAttempts &&
        (code === "ECONNRESET" ||
          code === "ETIMEDOUT" ||
          code === "ECONNABORTED" ||
          code === "EAI_AGAIN")
      ) {
        await new Promise((r) => setTimeout(r, 1500 * attempt));
        continue;
      }
      if (code === "ECONNRESET") {
        throw new APIException(
          EX.API_REQUEST_FAILED,
          `无法连接 login-row.www.capcut.com(TLS 被重置)。该域名可能被本机网络/代理阻断，请在配置中设置 global_proxy_url 或在代理规则中放行该域名`
        );
      }
      throw e;
    }
  }
  if (!response) {
    throw new APIException(
      EX.API_REQUEST_FAILED,
      `登录请求失败: ${lastError?.message || "未知错误"}`
    );
  }

  logger.info(`登录响应状态: ${response.status}`);

  if (response.status >= 400) {
    throw new APIException(
      EX.API_REQUEST_FAILED,
      `登录请求失败: HTTP ${response.status}`
    );
  }

  const body = response.data || {};
  const data = body.data || {};

  // 优先从响应体取 sessionid
  let sessionId: string | undefined =
    data.sessionid || data.session_id || data.access_token;

  // 兜底从 Set-Cookie 取 sessionid
  if (!sessionId) {
    const setCookies: string[] = response.headers?.["set-cookie"] || [];
    for (const cookie of setCookies) {
      const match = cookie.match(/sessionid=([^;]+)/);
      if (match && match[1]) {
        sessionId = decodeURIComponent(match[1]);
        break;
      }
    }
  }

  if (!sessionId) {
    const msg = body.description || body.message || body.errmsg || "未知错误";
    throw new APIException(
      EX.API_REQUEST_FAILED,
      `登录失败: ${msg}${body.error_code ? `(错误码: ${body.error_code})` : ""}`
    );
  }

  logger.success(`邮箱登录成功: ${cleanEmail}, user_id=${data.user_id ?? "未知"}`);

  return {
    sessionId,
    userId: data.user_id != null ? String(data.user_id) : undefined,
    userInfo: data,
  };
}
