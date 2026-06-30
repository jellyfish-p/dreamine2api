import axios from "axios";
import type { AxiosRequestConfig } from "axios";

import {
  APP_SDK_VERSION,
  DEFAULT_ASSISTANT_ID,
  PLATFORM_CODE,
  VERSION_CODE,
  WEB_VERSION,
} from "~~/server/clients/dreamina/consts/common";
import { acquireToken, generateCookie } from "~~/server/clients/dreamina/core";
import type { RequestProxyOptions } from "~~/server/clients/dreamina/core";
import { withProxyConfig } from "~~/server/clients/proxy/agents";
import { resolveCreditProxy } from "~~/server/services/pool/settings";
import logger from "~~/server/utils/logger";
import util from "~~/server/utils/util";

const COMMERCE_BENEFIT_METADATA_BASE_URL = "https://commerce-api-sg.capcut.com";
const COMMERCE_BENEFIT_METADATA_URI = "/commerce/v3/resource/benefit_metadata";
const BENEFIT_METADATA_DA_VERSION = "3.3.20";
const DEFAULT_COMMERCE_DEVICE_ID = `765${util.generateRandomString({
  length: 16,
  charset: "numeric",
})}`;

export type BenefitPriceEntry = {
  resourceType: string;
  resourceId: string;
  benefitType: string;
  benefitId?: number;
  unit: string;
  creditUnitPrice: number;
  originalCreditUnitPrice: number;
  minChargeCount: number;
  roles: string[];
  name: string;
};

export type BenefitPriceIndex = Record<string, BenefitPriceEntry[]>;

export type CommerceBenefitMetadataRequestOptions = {
  deviceTime?: number;
  deviceId?: string;
};

export type CommerceBenefitMetadataRequest = {
  method: "POST";
  url: string;
  headers: Record<string, string>;
  data: {
    query_list: Array<{
      resource_type: "aigc" | "normal_func";
      resource_id: "get_all";
      benefit_type_list: string[];
    }>;
  };
};

export async function buildCommerceBenefitMetadataRequest(
  refreshToken: string,
  options: CommerceBenefitMetadataRequestOptions = {}
): Promise<CommerceBenefitMetadataRequest> {
  const token = await acquireToken(refreshToken);
  const deviceTime = options.deviceTime ?? util.unixTimestamp();
  const deviceId = options.deviceId ?? DEFAULT_COMMERCE_DEVICE_ID;
  const sign = util.md5(
    `9e2c|${COMMERCE_BENEFIT_METADATA_URI.slice(-7)}|${PLATFORM_CODE}|${VERSION_CODE}|${deviceTime}||11ac`
  );
  const url = new URL(`${COMMERCE_BENEFIT_METADATA_BASE_URL}${COMMERCE_BENEFIT_METADATA_URI}`);
  url.searchParams.set("aid", DEFAULT_ASSISTANT_ID);
  url.searchParams.set("web_version", WEB_VERSION);
  url.searchParams.set("da_version", BENEFIT_METADATA_DA_VERSION);
  url.searchParams.set("aigc_features", "app_lip_sync");

  return {
    method: "POST",
    url: url.toString(),
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "app-sdk-version": APP_SDK_VERSION,
      appid: DEFAULT_ASSISTANT_ID,
      appvr: VERSION_CODE,
      "content-type": "application/json",
      "device-time": String(deviceTime),
      did: deviceId,
      lan: "en",
      loc: "VN",
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
      cookie: generateCookie(token),
    },
    data: {
      query_list: [
        { resource_type: "aigc", resource_id: "get_all", benefit_type_list: [] },
        { resource_type: "normal_func", resource_id: "get_all", benefit_type_list: [] },
      ],
    },
  };
}

function isSuccessfulEnvelope(body: any): boolean {
  return (
    body?.ret === "0" ||
    body?.ret === 0 ||
    body?.code === "0" ||
    body?.code === 0 ||
    body?.err_no === 0
  );
}

function getBenefitMetadataPayload(body: any): Record<string, any> {
  if (typeof body === "string") {
    const parsed = util.ignoreJSONParse(body);
    if (parsed && typeof parsed === "object") return getBenefitMetadataPayload(parsed);
  }
  if (body?.data && typeof body.data === "object") return getBenefitMetadataPayload(body.data);
  if (Array.isArray(body?.metadata_list)) return body;
  if (typeof body?.response === "string") {
    const parsed = util.ignoreJSONParse(body.response);
    if (parsed && typeof parsed === "object") return getBenefitMetadataPayload(parsed);
  }
  return {};
}

export function normalizeBenefitMetadataResponse(body: any): BenefitPriceEntry[] {
  const payload = getBenefitMetadataPayload(body);
  const hasMetadataList = Array.isArray(payload.metadata_list);
  const ok = isSuccessfulEnvelope(body) || hasMetadataList;
  if (!ok) {
    throw new Error(`权益元数据查询失败: ${body?.errmsg || body?.message || body?.ret || body?.code || "未知错误"}`);
  }
  if (isSuccessfulEnvelope(body) && !hasMetadataList) {
    throw new Error("Invalid benefit metadata format: metadata_list missing or malformed");
  }

  const metadataList = payload.metadata_list;
  const entries: BenefitPriceEntry[] = [];

  for (const resource of metadataList) {
    const strategies = Array.isArray(resource?.benefits_pay_strategy) ? resource.benefits_pay_strategy : [];
    for (const strategy of strategies) {
      const pricing = strategy?.credit_strategy?.credit_pricing_info;
      const creditUnitPrice = Number(pricing?.credit_unit_price);
      if (!Number.isFinite(creditUnitPrice)) continue;

      const benefitId = Number(strategy?.benefit_id);
      const originalCreditUnitPrice = Number(pricing?.original_credit_unit_price ?? creditUnitPrice);
      const minChargeCount = Number(pricing?.min_charge_cnt ?? 1);
      const roles = Array.isArray(strategy?.credit_strategy?.credit_limits)
        ? strategy.credit_strategy.credit_limits
            .map((limit: any) => String(limit?.role || ""))
            .filter(Boolean)
        : [];

      entries.push({
        resourceType: String(resource?.resource_type || ""),
        resourceId: String(resource?.resource_id || ""),
        benefitType: String(strategy?.benefit_type || ""),
        benefitId: Number.isFinite(benefitId) ? benefitId : undefined,
        unit: String(strategy?.unit || "count"),
        creditUnitPrice,
        originalCreditUnitPrice: Number.isFinite(originalCreditUnitPrice)
          ? originalCreditUnitPrice
          : creditUnitPrice,
        minChargeCount: Number.isFinite(minChargeCount) ? minChargeCount : 1,
        roles,
        name: String(strategy?.name || ""),
      });
    }
  }

  return entries.filter((entry) => entry.benefitType);
}

export function buildBenefitPriceIndex(entries: BenefitPriceEntry[]): BenefitPriceIndex {
  return entries.reduce<BenefitPriceIndex>((index, entry) => {
    index[entry.benefitType] ||= [];
    index[entry.benefitType]!.push(entry);
    return index;
  }, {});
}

export async function getCommerceBenefitMetadata(
  refreshToken: string,
  proxyOpts: RequestProxyOptions = {}
) {
  const request = await buildCommerceBenefitMetadataRequest(refreshToken);
  const axiosConfig: AxiosRequestConfig = {
    ...request,
    timeout: 30000,
    validateStatus: () => true,
  };

  logger.info(`发送权益元数据请求: POST ${request.url}`);

  const response = await axios.request(
    withProxyConfig(axiosConfig, resolveCreditProxy(proxyOpts.proxyUrl))
  );
  if (response.status >= 400) {
    throw new Error(`HTTP错误: ${response.status}`);
  }

  normalizeBenefitMetadataResponse(response.data);
  return getBenefitMetadataPayload(response.data);
}
