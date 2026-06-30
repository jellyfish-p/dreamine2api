import fallbackBenefitMetadataRaw from "~~/data/dreamina-benefit-metadata-fallback.raw";
import {
  buildBenefitPriceIndex,
  normalizeBenefitMetadataResponse,
  type BenefitPriceIndex,
} from "~~/server/clients/dreamina/benefit-metadata";
import type { PoolAccountRow } from "~~/server/repositories/sqlite/schema";
import logger from "~~/server/utils/logger";
import util from "~~/server/utils/util";

let startupBenefitPriceIndex: BenefitPriceIndex | null = null;
const BENEFIT_METADATA_TTL_SECONDS = 60 * 60;

export function parseBenefitMetadataToIndex(raw?: string | null): BenefitPriceIndex | null {
  if (!raw) return null;
  const parsed = util.ignoreJSONParse(raw);
  if (!parsed || typeof parsed !== "object") return null;

  try {
    return buildBenefitPriceIndex(normalizeBenefitMetadataResponse(parsed));
  } catch (e: any) {
    logger.warn(`缓存权益元数据解析失败，使用启动兜底价格索引: ${e?.message || String(e)}`);
    return null;
  }
}

export function parseFallbackBenefitMetadataRaw(raw: string): BenefitPriceIndex {
  try {
    const parsed = JSON.parse(raw);
    const entries = normalizeBenefitMetadataResponse(parsed);
    return buildBenefitPriceIndex(entries);
  } catch (e: any) {
    logger.warn(`启动权益价格索引加载失败，保留随机选号兜底: ${e?.message || String(e)}`);
    return {};
  }
}

export function getStartupBenefitPriceIndex(): BenefitPriceIndex {
  if (startupBenefitPriceIndex) return startupBenefitPriceIndex;

  try {
    startupBenefitPriceIndex = parseFallbackBenefitMetadataRaw(fallbackBenefitMetadataRaw);
    logger.debug(`启动权益价格索引已加载: ${Object.keys(startupBenefitPriceIndex).length}`);
  } catch (e: any) {
    logger.warn(`启动权益价格索引加载失败，保留随机选号兜底: ${e?.message || String(e)}`);
    startupBenefitPriceIndex = {};
    return {};
  }
  return startupBenefitPriceIndex;
}

export function getBenefitPriceIndexForAccount(row?: PoolAccountRow | null): BenefitPriceIndex {
  return getBenefitPriceIndexesForAccount(row)[0] || getStartupBenefitPriceIndex();
}

export function getBenefitPriceIndexesForAccount(row?: PoolAccountRow | null): BenefitPriceIndex[] {
  const indexes: BenefitPriceIndex[] = [];

  if (isFreshBenefitMetadata(row?.last_benefit_metadata_at)) {
    const accountIndex = parseBenefitMetadataToIndex(row?.last_benefit_metadata);
    if (accountIndex) indexes.push(accountIndex);
  }

  const startupIndex = getStartupBenefitPriceIndex();
  if (!indexes.includes(startupIndex)) indexes.push(startupIndex);
  return indexes;
}

function isFreshBenefitMetadata(timestamp?: number | null): boolean {
  if (!Number.isFinite(timestamp) || !timestamp) return false;
  return Math.floor(Date.now() / 1000) - timestamp <= BENEFIT_METADATA_TTL_SECONDS;
}
