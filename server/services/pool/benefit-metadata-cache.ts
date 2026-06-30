import fs from "fs";
import path from "path";

import {
  buildBenefitPriceIndex,
  normalizeBenefitMetadataResponse,
  type BenefitPriceIndex,
} from "~~/server/clients/dreamina/benefit-metadata";
import type { PoolAccountRow } from "~~/server/repositories/sqlite/schema";
import logger from "~~/server/utils/logger";
import util from "~~/server/utils/util";

const FALLBACK_BENEFIT_METADATA_PATH = path.resolve(
  process.cwd(),
  "data/dreamina-benefit-metadata-fallback.json"
);

let startupBenefitPriceIndex: BenefitPriceIndex | null = null;

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

export function getStartupBenefitPriceIndex(): BenefitPriceIndex {
  if (startupBenefitPriceIndex) return startupBenefitPriceIndex;

  const raw = fs.readFileSync(FALLBACK_BENEFIT_METADATA_PATH, "utf8");
  const parsed = util.ignoreJSONParse(raw);
  if (!parsed || typeof parsed !== "object") {
    throw new Error(`Invalid fallback benefit metadata JSON: ${FALLBACK_BENEFIT_METADATA_PATH}`);
  }

  const entries = normalizeBenefitMetadataResponse(parsed);
  startupBenefitPriceIndex = buildBenefitPriceIndex(entries);
  logger.debug(`启动权益价格索引已加载: ${entries.length}`);
  return startupBenefitPriceIndex;
}

export function getBenefitPriceIndexForAccount(row?: PoolAccountRow | null): BenefitPriceIndex {
  return parseBenefitMetadataToIndex(row?.last_benefit_metadata) || getStartupBenefitPriceIndex();
}
