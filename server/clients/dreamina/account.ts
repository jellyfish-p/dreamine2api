import axios from "axios";
import type { AxiosRequestConfig } from "axios";

import { DEFAULT_ASSISTANT_ID, PLATFORM_CODE, VERSION_CODE } from "~~/server/clients/dreamina/consts/common";
import { acquireToken, generateCookie } from "~~/server/clients/dreamina/core";
import type { RequestProxyOptions } from "~~/server/clients/dreamina/core";
import { withProxyConfig } from "~~/server/clients/proxy/agents";
import { resolveCreditProxy } from "~~/server/services/pool/settings";
import logger from "~~/server/utils/logger";
import util from "~~/server/utils/util";

export {
  buildCommerceCreditRequest,
  buildCommerceCreditHistoryRequest,
  normalizeCommerceCreditResponse,
} from "~~/server/clients/dreamina/core";

const COMMERCE_ACCOUNT_BASE_URL = "https://commerce-api-sg.capcut.com";
const COMMERCE_ACCOUNT_URI = "/commerce/v1/subscription/user_info";
const COMMERCE_ACCOUNT_STORE_COUNTRY = "vn";
const DEFAULT_COMMERCE_DEVICE_ID = `765${util.generateRandomString({
  length: 16,
  charset: "numeric",
})}`;

export type CommerceAccountRequestOptions = {
  deviceTime?: number;
  deviceId?: string;
  uifid?: string;
};

export type CommerceAccountRequest = {
  method: "POST";
  url: string;
  headers: Record<string, string>;
  data: {
    aid: number;
    scene: "vip";
    need_sign_info: true;
  };
};

export async function buildCommerceAccountRequest(
  refreshToken: string,
  options: CommerceAccountRequestOptions = {}
): Promise<CommerceAccountRequest> {
  const token = await acquireToken(refreshToken);
  const deviceTime = options.deviceTime ?? util.unixTimestamp();
  const deviceId = options.deviceId ?? DEFAULT_COMMERCE_DEVICE_ID;
  const sign = util.md5(
    `9e2c|${COMMERCE_ACCOUNT_URI.slice(-7)}|${PLATFORM_CODE}|${VERSION_CODE}|${deviceTime}||11ac`
  );
  const url = new URL(`${COMMERCE_ACCOUNT_BASE_URL}${COMMERCE_ACCOUNT_URI}`);
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
      pf: PLATFORM_CODE,
      "sec-ch-ua": '"Not;A=Brand";v="8", "Chromium";v="150", "Microsoft Edge";v="150"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      sign,
      "sign-ver": "1",
      "store-country-code": COMMERCE_ACCOUNT_STORE_COUNTRY,
      "store-country-code-src": "uid",
      tdid: "",
      "x-secsdk-sign-config": "1_5000",
      cookie: generateCookie(token),
    },
    data: { aid: Number(DEFAULT_ASSISTANT_ID), scene: "vip", need_sign_info: true },
  };
}

export async function getCommerceAccountInfo(
  refreshToken: string,
  proxyOpts: RequestProxyOptions = {}
) {
  const request = await buildCommerceAccountRequest(refreshToken);
  const axiosConfig: AxiosRequestConfig = {
    ...request,
    timeout: 30000,
    validateStatus: () => true,
  };

  logger.info(`发送 Commerce 账户请求: POST ${request.url}`);

  const response = await axios.request(
    withProxyConfig(axiosConfig, resolveCreditProxy(proxyOpts.proxyUrl))
  );

  if (response.status >= 400) {
    throw new Error(`HTTP错误: ${response.status}`);
  }

  const body = response.data || {};
  const ok =
    body.ret === "0" ||
    body.ret === 0 ||
    body.code === "0" ||
    body.code === 0 ||
    body.err_no === 0;
  if (ok) {
    if (body.data && typeof body.data === "object") return body.data as Record<string, any>;
    if (typeof body.response === "string") {
      const parsed = util.ignoreJSONParse(body.response);
      if (parsed && typeof parsed === "object") return parsed as Record<string, any>;
    }
    return {};
  }

  throw new Error(`Commerce账户查询失败: ${body.errmsg || body.message || body.ret || body.code || "未知错误"}`);
}
