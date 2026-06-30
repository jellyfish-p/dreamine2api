import { sample } from "lodash";
import type { PoolAccountRow } from "~~/server/repositories/sqlite/schema";
import { getBenefitPriceIndexesForAccount } from "~~/server/services/pool/benefit-metadata-cache";
import {
  estimateCreditCost,
  type CreditCostContext,
} from "~~/server/services/pool/credit-cost";
import { listEnabledAccounts } from "~~/server/services/pool/accounts";
import logger from "~~/server/utils/logger";

export function pickAccountForCost(costContext?: CreditCostContext): PoolAccountRow | undefined {
  const rows = listEnabledAccounts();
  if (rows.length === 0) return undefined;
  if (!costContext) return sample(rows);

  const eligible: PoolAccountRow[] = [];
  let hasKnownCredit = false;
  let hasKnownCreditEstimate = false;

  for (const row of rows) {
    if (row.last_total_credit == null) continue;
    hasKnownCredit = true;

    try {
      const estimate = estimateCreditCostForAccount(row, costContext);
      if (!estimate) return fallback(rows, "credit cost could not be estimated");
      hasKnownCreditEstimate = true;
      if (row.last_total_credit >= estimate.credits) eligible.push(row);
    } catch (e: any) {
      return fallback(rows, `credit cost estimation failed: ${e?.message || String(e)}`);
    }
  }

  if (!hasKnownCredit) return fallback(rows, "cached credit is missing");
  if (!hasKnownCreditEstimate) return fallback(rows, "credit cost could not be estimated");
  if (eligible.length === 0) return fallback(rows, "no account has enough cached credit");
  return sample(eligible);
}

function estimateCreditCostForAccount(row: PoolAccountRow, costContext: CreditCostContext) {
  for (const priceIndex of getBenefitPriceIndexesForAccount(row)) {
    const estimate = estimateCreditCost(costContext, priceIndex, row.account_type || undefined);
    if (estimate) return estimate;
  }
  return null;
}

function fallback(rows: PoolAccountRow[], reason: string): PoolAccountRow | undefined {
  logger.warn(`Pool account scheduler fell back to random enabled account: ${reason}`);
  return sample(rows);
}
