import _ from "lodash";
import { ASPECT_RATIOS } from "~~/server/clients/dreamina/consts/common";
import { resolveModelReqKey as resolvePublicModel } from "~~/server/services/pool/model-catalog";

const OPENAI_SIZE_MAP: Record<string, string> = {
  "1024x1024": "1:1",
  "1792x1024": "16:9",
  "1024x1792": "9:16",
  "1536x1024": "3:2",
  "1024x1536": "2:3",
};

export type NormalizedImageRequest = {
  model?: string;
  prompt: string;
  negativePrompt?: string;
  ratio?: string;
  sampleStrength?: number;
  responseFormat?: string;
  imageUrls: string[];
};

export type NormalizedVideoRequest = {
  model?: string;
  prompt: string;
  ratio?: string;
  width: number;
  height: number;
  resolution: string;
  durationSec?: number;
  filePaths: string[];
  responseFormat?: string;
  asyncMode: boolean;
};

function ratioFromDimensions(width: number, height: number): string | undefined {
  for (const [key, cfg] of Object.entries(ASPECT_RATIOS)) {
    if (cfg.width === width && cfg.height === height) return key;
  }
  const aspect = width / height;
  let best = "1:1";
  let bestDiff = Infinity;
  for (const [key, cfg] of Object.entries(ASPECT_RATIOS)) {
    const r = cfg.width / cfg.height;
    const diff = Math.abs(r - aspect);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = key;
    }
  }
  return best;
}

function resolutionFromGrok(res?: string): string {
  if (!res) return "720p";
  const v = res.toLowerCase();
  if (v === "4k" || v === "2160p") return "4k";
  if (v === "1080p") return "1080p";
  return "720p";
}

function parseDimension(value: unknown): number | undefined {
  if (_.isFinite(value)) return Number(value);
  if (typeof value !== "string") return undefined;
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function parseDurationSec(value: unknown): number | undefined {
  if (_.isFinite(value)) return Number(value);
  if (typeof value !== "string") return undefined;

  const match = value.trim().toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(?:s|sec|secs|second|seconds)?$/);
  if (!match) return undefined;

  const parsed = Number(match[1]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function parseSize(size: unknown): { width: number; height: number } | undefined {
  if (typeof size !== "string") return undefined;

  const match = size.trim().toLowerCase().match(/^(\d+)\s*x\s*(\d+)$/);
  if (!match) return undefined;

  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return undefined;
  }

  return { width, height };
}

function resolutionFromDimensions(width: number, height: number): string {
  const shortSide = Math.min(width, height);
  if (shortSide >= 2160) return "4k";
  if (shortSide >= 1080) return "1080p";
  return "720p";
}

function imageUrlFromValue(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return undefined;

  const obj = value as {
    url?: unknown;
    image_url?: unknown;
    uri?: unknown;
  };
  if (typeof obj.url === "string") return obj.url;
  if (typeof obj.image_url === "string") return obj.image_url;
  if (typeof obj.uri === "string") return obj.uri;
  return undefined;
}

function appendImageRefs(target: string[], value: unknown) {
  if (Array.isArray(value)) {
    for (const item of value) {
      const url = imageUrlFromValue(item);
      if (url) target.push(url);
    }
    return;
  }

  const url = imageUrlFromValue(value);
  if (url) target.push(url);
}

export function normalizeImageBody(body: Record<string, unknown>): NormalizedImageRequest {
  const prompt = String(body.prompt ?? "");
  if (!prompt && !body.image && !body.image_url) {
    throw new Error("prompt is required");
  }

  const model = resolvePublicModel(body.model as string | undefined);

  let ratio = body.ratio as string | undefined;
  if (!ratio && typeof body.size === "string" && OPENAI_SIZE_MAP[body.size]) {
    ratio = OPENAI_SIZE_MAP[body.size];
  }
  if (!ratio && body.aspect_ratio) {
    ratio = String(body.aspect_ratio);
  }

  const imageUrls: string[] = [];
  if (typeof body.image === "string") imageUrls.push(body.image);
  if (typeof body.image_url === "string") imageUrls.push(body.image_url);
  if (body.image && typeof body.image === "object") {
    const img = body.image as { url?: string };
    if (img.url) imageUrls.push(img.url);
  }
  if (Array.isArray(body.images)) {
    for (const item of body.images) {
      if (typeof item === "string") imageUrls.push(item);
      else if (item && typeof item === "object" && (item as { url?: string }).url) {
        imageUrls.push((item as { url: string }).url);
      }
    }
  }

  return {
    model,
    prompt: prompt || "enhance",
    negativePrompt: (body.negative_prompt as string) || undefined,
    ratio,
    sampleStrength: _.isFinite(body.sample_strength) ? (body.sample_strength as number) : undefined,
    responseFormat: (body.response_format as string) || "url",
    imageUrls,
  };
}

export function normalizeVideoBody(body: Record<string, unknown>): NormalizedVideoRequest {
  const prompt = String(body.prompt ?? "");
  if (!prompt) throw new Error("prompt is required");

  const model = resolvePublicModel(body.model as string | undefined);

  const size = parseSize(body.size);
  let width = parseDimension(body.width) ?? size?.width ?? 1024;
  let height = parseDimension(body.height) ?? size?.height ?? 1024;

  let ratio = body.ratio as string | undefined;
  if (!ratio && body.aspect_ratio) ratio = String(body.aspect_ratio);
  const ratioConfig = ratio ? ASPECT_RATIOS[ratio] : undefined;
  if (ratioConfig) {
    width = ratioConfig.width;
    height = ratioConfig.height;
  }

  const resolution = typeof body.resolution === "string"
    ? resolutionFromGrok(body.resolution)
    : resolutionFromDimensions(width, height);

  const durationSec =
    parseDurationSec(body.duration) ??
    parseDurationSec(body.duration_seconds) ??
    parseDurationSec(body.durationSec);

  const filePaths: string[] = [];
  const openaiPaths = (body.file_paths || body.filePaths) as string[] | undefined;
  if (Array.isArray(openaiPaths)) filePaths.push(...openaiPaths.filter(Boolean));

  appendImageRefs(filePaths, body.images);
  appendImageRefs(filePaths, body.input_images);
  appendImageRefs(filePaths, body.input_image);

  if (body.image && typeof body.image === "object") {
    const url = (body.image as { url?: string }).url;
    if (url) filePaths.unshift(url);
  } else if (typeof body.image === "string") {
    filePaths.unshift(body.image);
  }
  if (typeof body.image_url === "string") filePaths.unshift(body.image_url);
  if (typeof body.first_frame_image === "string") filePaths.unshift(body.first_frame_image);
  if (typeof body.firstFrameRef === "string") filePaths.unshift(body.firstFrameRef);
  if (typeof body.end_frame_image === "string") filePaths.push(body.end_frame_image);
  if (typeof body.endFrameRef === "string") filePaths.push(body.endFrameRef);

  const asyncMode = body.async === true || body.deferred === true;

  return {
    model,
    prompt,
    ratio: ratio || ratioFromDimensions(width, height),
    width,
    height,
    resolution,
    durationSec,
    filePaths,
    responseFormat: (body.response_format as string) || "url",
    asyncMode,
  };
}

export function imageResultResponse(urls: string[], responseFormat: string, created: number) {
  if (responseFormat === "b64_json") {
    return { created, data: urls.map((b64) => ({ b64_json: b64 })) };
  }
  return { created, data: urls.map((url) => ({ url })) };
}

export function videoJobAcceptedResponse(requestId: string) {
  return { request_id: requestId, status: "pending" };
}

export function videoJobStatusResponse(
  requestId: string,
  status: "pending" | "processing" | "done" | "failed" | "expired",
  videoUrl?: string,
  error?: string
) {
  if (status === "done" && videoUrl) {
    return { request_id: requestId, status: "done", video: { url: videoUrl } };
  }
  if (status === "failed" || status === "expired") {
    return { request_id: requestId, status, error: error || status };
  }
  return { request_id: requestId, status };
}
