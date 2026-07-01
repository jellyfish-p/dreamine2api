import { createError } from "h3";
import {
  DEFAULT_MODEL,
  generateImageComposition,
  generateImages,
} from "~~/server/clients/dreamina/images";
import { ASPECT_RATIOS } from "~~/server/clients/dreamina/consts/common";
import { imageResultResponse, normalizeImageBody } from "~~/server/services/media-format";
import type { CreditCostContext } from "~~/server/services/pool/credit-cost";
import { refreshActiveSessionCredit, requireActiveSession } from "~~/server/services/pool/session-context";
import util from "~~/server/utils/util";

function resolveImageSize(ratio?: string): { width: number; height: number } {
  if (!ratio) return { width: 2048, height: 2048 };
  const size = ASPECT_RATIOS[ratio];
  if (size) return size;
  throw createError({
    statusCode: 400,
    message: `unsupported ratio "${ratio}". supported ratios: ${Object.keys(ASPECT_RATIOS).join(", ")}`,
  });
}

function imageCostContext(
  request: ReturnType<typeof normalizeImageBody>,
  size: { width: number; height: number },
  operation: "generate" | "edit",
): CreditCostContext {
  return {
    kind: "image",
    operation,
    model: request.model || DEFAULT_MODEL,
    width: size.width,
    height: size.height,
    outputCount: operation === "generate" ? 4 : 1,
  };
}

async function formatImageResult(urls: string[], responseFormat = "url") {
  const payload =
    responseFormat === "b64_json"
      ? await Promise.all(urls.map((url) => util.fetchFileBASE64(url)))
      : urls;
  return imageResultResponse(payload, responseFormat, util.unixTimestamp());
}

export async function createImageGeneration(
  body: Record<string, unknown>,
  authorization: string,
) {
  const request = normalizeImageBody(body);
  if (request.imageUrls.length > 0) {
    throw createError({
      statusCode: 400,
      message: "image generation does not accept input images; use image edit or composition",
    });
  }

  const size = resolveImageSize(request.ratio);
  const costContext = imageCostContext(request, size, "generate");
  const session = requireActiveSession(authorization, costContext);
  const urls = await generateImages(
    request.model || DEFAULT_MODEL,
    request.prompt,
    {
      width: size.width,
      height: size.height,
      sampleStrength: request.sampleStrength,
      negativePrompt: request.negativePrompt,
    },
    session.sessionId,
    { proxyUrl: session.apiProxy },
  );
  await refreshActiveSessionCredit(session);
  return formatImageResult(urls, request.responseFormat);
}

export async function createImageEdit(
  body: Record<string, unknown>,
  authorization: string,
) {
  const request = normalizeImageBody(body);
  if (request.imageUrls.length === 0) {
    throw createError({ statusCode: 400, message: "at least one input image is required" });
  }
  if (request.imageUrls.length > 10) {
    throw createError({ statusCode: 400, message: "at most 10 input images are supported" });
  }

  const size = resolveImageSize(request.ratio);
  const costContext = imageCostContext(request, size, "edit");
  const session = requireActiveSession(authorization, costContext);
  const urls = await generateImageComposition(
    request.model || DEFAULT_MODEL,
    request.prompt,
    request.imageUrls,
    {
      width: size.width,
      height: size.height,
      sampleStrength: request.sampleStrength,
      negativePrompt: request.negativePrompt,
    },
    session.sessionId,
    { proxyUrl: session.apiProxy },
  );
  await refreshActiveSessionCredit(session);
  return formatImageResult(urls, request.responseFormat);
}
