export type VideoInputMediaType =
  | "unified_edit"
  | "prompt"
  | "first_frame"
  | "end_frame";

export type VideoModelInputConfig = {
  modelReqKey: string;
  resolutions: string[];
  inputMediaTypes: VideoInputMediaType[];
  frames: number[];
  fps: number[];
  aspectRatios: string[];
};

export type AdaptedVideoInput = {
  width: number;
  height: number;
  resolution: string;
  fps: number;
  frames: number;
  durationMs: number;
  aspectRatio: string;
  filePaths: string[];
  inputMediaType: VideoInputMediaType;
  useEndFrame: boolean;
};

export const VIDEO_MODEL_INPUT_CONFIGS: VideoModelInputConfig[] = [
  {
    modelReqKey: "dreamina_seedance_40_mini",
    resolutions: ["720p"],
    inputMediaTypes: ["unified_edit", "prompt", "first_frame", "end_frame"],
    frames: [96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336, 360],
    fps: [24],
    aspectRatios: ["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"],
  },
  {
    modelReqKey: "dreamina_seedance_40",
    resolutions: ["720p"],
    inputMediaTypes: ["unified_edit", "prompt", "first_frame", "end_frame"],
    frames: [96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336, 360],
    fps: [24],
    aspectRatios: ["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"],
  },
  {
    modelReqKey: "dreamina_seedance_40_pro",
    resolutions: ["720p", "1080p", "4k"],
    inputMediaTypes: ["unified_edit", "prompt", "first_frame", "end_frame"],
    frames: [96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336, 360],
    fps: [24],
    aspectRatios: ["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"],
  },
  {
    modelReqKey: "dreamina_ic_generate_video_model_vgfm_3.5_pro",
    resolutions: ["720p", "1080p"],
    inputMediaTypes: ["prompt", "first_frame", "end_frame"],
    frames: [120, 240, 288],
    fps: [24],
    aspectRatios: ["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"],
  },
  {
    modelReqKey: "dreamina_ic_generate_video_model_vgfm_3.0_pro",
    resolutions: ["1080p"],
    inputMediaTypes: ["prompt", "first_frame"],
    frames: [120, 240],
    fps: [24],
    aspectRatios: ["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"],
  },
];

const byReqKey = new Map(VIDEO_MODEL_INPUT_CONFIGS.map((config) => [config.modelReqKey, config]));

export function listSupportedVideoModelReqKeys(): string[] {
  return VIDEO_MODEL_INPUT_CONFIGS.map((config) => config.modelReqKey);
}

export function getVideoModelInputConfig(modelReqKey: string): VideoModelInputConfig | undefined {
  return byReqKey.get(modelReqKey);
}

export function isSupportedVideoModelReqKey(modelReqKey: string): boolean {
  return byReqKey.has(modelReqKey);
}

export function normalizeVideoResolutionValue(resolution?: string): string {
  const value = (resolution || "").trim().toLowerCase();
  if (value === "4k" || value === "2160p") return "4k";
  if (value === "1080p") return "1080p";
  if (value === "720p") return "720p";
  return "720p";
}

export function adaptVideoGenerationInput(
  modelReqKey: string,
  input: {
    width: number;
    height: number;
    resolution?: string;
    durationSec?: number;
    filePaths?: string[];
  },
): AdaptedVideoInput {
  const config = getVideoModelInputConfig(modelReqKey);
  if (!config) {
    throw new Error(`unsupported video model: ${modelReqKey}`);
  }

  const fps = config.fps[0] ?? 24;
  const frames = pickFrames(input.durationSec, fps, config.frames);
  const nonEmptyFilePaths = (input.filePaths || []).filter((filePath): filePath is string => Boolean(filePath));
  const canUseFirstFrame = config.inputMediaTypes.includes("first_frame");
  const canUseEndFrame = config.inputMediaTypes.includes("end_frame");
  const useEndFrame = nonEmptyFilePaths.length > 1 && canUseEndFrame;
  const filePaths = canUseFirstFrame
    ? nonEmptyFilePaths.slice(0, useEndFrame ? 2 : 1)
    : [];

  return {
    width: input.width,
    height: input.height,
    resolution: pickResolution(input.resolution, config.resolutions),
    fps,
    frames,
    durationMs: Math.round((frames / fps) * 1000),
    aspectRatio: pickAspectRatio(input.width, input.height, config.aspectRatios),
    filePaths,
    inputMediaType: pickInputMediaType(filePaths.length, useEndFrame),
    useEndFrame,
  };
}

function pickResolution(resolution: string | undefined, supported: string[]): string {
  const normalized = normalizeVideoResolutionValue(resolution);
  return supported.includes(normalized) ? normalized : supported[0] ?? "720p";
}

function pickFrames(durationSec: number | undefined, fps: number, supported: number[]): number {
  if (supported.length === 0) return 120;
  if (!Number.isFinite(durationSec) || !durationSec || durationSec <= 0) {
    return supported[0]!;
  }

  const target = durationSec * fps;
  return supported.reduce((best, current) => {
    const bestDiff = Math.abs(best - target);
    const currentDiff = Math.abs(current - target);
    return currentDiff < bestDiff ? current : best;
  }, supported[0]!);
}

function pickAspectRatio(width: number, height: number, supported: string[]): string {
  const target = width / height;
  return supported.reduce((best, current) => {
    const bestDiff = Math.abs(ratioValue(best) - target);
    const currentDiff = Math.abs(ratioValue(current) - target);
    return currentDiff < bestDiff ? current : best;
  }, supported[0] ?? "16:9");
}

function ratioValue(ratio: string): number {
  const [w, h] = ratio.split(":").map(Number);
  if (!w || !h) return 1;
  return w / h;
}

function pickInputMediaType(fileCount: number, useEndFrame: boolean): VideoInputMediaType {
  if (fileCount === 0) return "prompt";
  return useEndFrame ? "end_frame" : "first_frame";
}
