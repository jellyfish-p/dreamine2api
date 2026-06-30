import type {
  BenefitPriceEntry,
  BenefitPriceIndex,
} from "~~/server/clients/dreamina/benefit-metadata";

import { resolveModelReqKey } from "./model-catalog";
import { adaptVideoGenerationInput } from "./video-model-config";

type ImageOperation = "generate" | "edit" | string;
type ImageResolutionTier = "2k" | "4k";
type VideoResolutionTier = "480p" | "720p" | "1080p" | "4k";

export type ImageCreditCostContext = {
  kind: "image";
  operation?: ImageOperation;
  model?: string;
  width: number;
  height: number;
};

export type VideoCreditCostContext = {
  kind: "video";
  model?: string;
  width: number;
  height: number;
  resolution?: string;
  durationSec?: number;
  filePaths?: string[];
};

export type CreditCostContext = ImageCreditCostContext | VideoCreditCostContext;

export type CreditCostEstimate = {
  credits: number;
  benefitType: string;
  unit: string;
  quantity: number;
  unitPrice: number;
};

const IMAGE_GENERATE_BENEFITS: Record<string, Record<ImageResolutionTier, string>> = {
  dreamina_lib_img_20260423: {
    "2k": "image_basic_gpt_image_v2",
    "4k": "image_basic_gpt_image_v2",
  },
  high_aes_general_v50: {
    "2k": "image_basic_v5_2k",
    "4k": "image_basic_v5_4k",
  },
  high_aes_general_v43: {
    "2k": "image_basic_v43_2k",
    "4k": "image_basic_v43_4k",
  },
  high_aes_general_v42: {
    "2k": "image_basic_v46_2k",
    "4k": "image_basic_v46_4k",
  },
  high_aes_general_v40l: {
    "2k": "image_basic_v4_pro_2k",
    "4k": "image_basic_v4_pro_4k",
  },
};

const VIDEO_OUTPUT_BENEFITS: Record<string, Partial<Record<VideoResolutionTier, string>>> = {
  dreamina_seedance_40_mini: {
    "720p": "seedance_20_mini_720p_output",
    "1080p": "seedance_20_mini_1080p_output",
    "4k": "seedance_20_mini_1080p_output",
  },
  dreamina_seedance_40: {
    "480p": "seedance_20_fast_480p_output",
    "720p": "seedance_20_fast_720p_output",
    "1080p": "seedance_20_fast_1080p_output",
    "4k": "seedance_20_fast_1080p_output",
  },
  dreamina_seedance_40_pro: {
    "480p": "seedance_20_pro_480p_output",
    "720p": "seedance_20_pro_720p_output",
    "1080p": "seedance_20_pro_1080p_output",
    "4k": "seedance_20_pro_4k_output",
  },
  "dreamina_ic_generate_video_model_vgfm_3.5_pro": {
    "720p": "basic_video_operation_vgfm_v_three",
    "1080p": "basic_video_operation_vgfm_v_three_1080",
    "4k": "basic_video_operation_vgfm_v_three_1080",
  },
  "dreamina_ic_generate_video_model_vgfm_3.0_pro": {
    "720p": "basic_video_operation_vgfm",
    "1080p": "basic_video_operation_vgfm",
    "4k": "basic_video_operation_vgfm",
  },
};

export function estimateCreditCost(
  context?: CreditCostContext | null,
  index?: BenefitPriceIndex | null,
  accountType?: string,
): CreditCostEstimate | null {
  if (!context || !index) return null;
  if (!hasFiniteDimensions(context)) return null;

  const modelOptional = context.kind === "image" && (context.operation || "generate") === "edit";
  const modelReqKey = resolveModelReqKey(context.model);
  if (!modelReqKey && !modelOptional) return null;

  const benefitType = benefitTypeForContext(context, modelReqKey || "");
  if (!benefitType) return null;

  const price = pickPrice(index[benefitType], accountType);
  if (!price) return null;

  const quantity = quantityForContext(context, modelReqKey, price);
  const unitPrice = price.creditUnitPrice;

  return {
    credits: unitPrice * quantity,
    benefitType,
    unit: price.unit,
    quantity,
    unitPrice,
  };
}

function benefitTypeForContext(context: CreditCostContext, modelReqKey: string): string | null {
  if (context.kind === "image") {
    if ((context.operation || "generate") === "edit") return "image_blend";
    return IMAGE_GENERATE_BENEFITS[modelReqKey]?.[imageResolutionTier(context)] ?? null;
  }

  const benefits = VIDEO_OUTPUT_BENEFITS[modelReqKey];
  if (!benefits) return null;

  return benefits[normalizeVideoResolution(context.resolution)] ?? benefits["720p"] ?? null;
}

function imageResolutionTier(context: ImageCreditCostContext): ImageResolutionTier {
  return Math.max(context.width, context.height) >= 3840 ? "4k" : "2k";
}

function normalizeVideoResolution(resolution?: string): VideoResolutionTier {
  const value = (resolution || "").trim().toLowerCase();
  if (value === "4k" || value === "2160p") return "4k";
  if (value === "1080p") return "1080p";
  if (value === "480p") return "480p";
  return "720p";
}

function pickPrice(
  entries?: BenefitPriceEntry[] | null,
  accountType?: string,
): BenefitPriceEntry | null {
  const candidates = (entries || []).filter((entry) => Number.isFinite(entry.creditUnitPrice));
  if (candidates.length === 0) return null;

  const compatible = candidates.filter((entry) => isCompatiblePrice(entry, accountType));
  return cheapestPrice(compatible.length > 0 ? compatible : candidates);
}

function isCompatiblePrice(entry: BenefitPriceEntry, accountType?: string): boolean {
  const roles = entry.roles || [];
  if (roles.length === 0) return true;

  const normalizedRoles = roles.map((role) => role.trim().toLowerCase()).filter(Boolean);
  if (normalizedRoles.length === 0 || normalizedRoles.includes("all")) return true;

  const normalizedAccountType = accountType?.trim().toLowerCase();
  if (!normalizedAccountType) return false;

  return normalizedRoles.some(
    (role) => role.includes(normalizedAccountType) || normalizedAccountType.includes(role),
  );
}

function cheapestPrice(entries: BenefitPriceEntry[]): BenefitPriceEntry {
  return entries.reduce((cheapest, entry) =>
    entry.creditUnitPrice < cheapest.creditUnitPrice ? entry : cheapest,
  );
}

function quantityForContext(
  context: CreditCostContext,
  modelReqKey: string,
  price: BenefitPriceEntry,
): number {
  const minChargeCount = positiveCeil(price.minChargeCount, 1);
  let quantity = 1;

  if (context.kind === "video" && price.unit === "second") {
    quantity = adaptedDurationSeconds(context, modelReqKey);
  }

  return Math.max(quantity, minChargeCount);
}

function adaptedDurationSeconds(context: VideoCreditCostContext, modelReqKey: string): number {
  const fallbackSeconds = positiveCeil(context.durationSec, 5);

  try {
    const adapted = adaptVideoGenerationInput(modelReqKey, {
      width: context.width,
      height: context.height,
      resolution: context.resolution,
      durationSec: context.durationSec,
      filePaths: context.filePaths,
    });
    return positiveCeil(adapted.durationMs / 1000, fallbackSeconds);
  } catch {
    return fallbackSeconds;
  }
}

function positiveCeil(value: number | undefined, fallback: number): number {
  if (!Number.isFinite(value) || !value || value <= 0) return fallback;
  return Math.ceil(value);
}

function hasFiniteDimensions(context: CreditCostContext): boolean {
  return Number.isFinite(context.width) && Number.isFinite(context.height);
}
