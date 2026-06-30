import fs from "fs";
import path from "path";
import { request } from "./core.ts";
import { pickOneSession } from "@/lib/pool/auth.ts";
import _ from "lodash";

export type DreaminaModelItem = {
  id: string;
  object: "model";
  owned_by: string;
  model_type: "image" | "video";
  model_req_key: string;
  model_name?: string;
  model_tip?: string;
  feats?: string[];
  options?: string[];
  resolution_map?: string[];
  source: "ssr" | "api" | "merged";
};

type ScrapedFile = {
  image_models: Array<{
    model_req_key: string;
    model_name?: string;
    model_tip?: string;
    feats?: string[];
    resolution_map?: string[];
  }>;
  video_models: Array<{
    model_req_key: string;
    model_name?: string;
    model_tip?: string;
    options?: string[];
  }>;
};

const SCRAPED_PATH = path.resolve(process.cwd(), "data/dreamina-models-scraped.json");

let cache: { expiresAt: number; data: DreaminaModelItem[] } | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000;

function loadScraped(): ScrapedFile | null {
  try {
    if (!fs.existsSync(SCRAPED_PATH)) return null;
    return JSON.parse(fs.readFileSync(SCRAPED_PATH, "utf8")) as ScrapedFile;
  } catch {
    return null;
  }
}

function fromScraped(file: ScrapedFile): DreaminaModelItem[] {
  const image = (file.image_models || []).map((m) => ({
    id: m.model_req_key,
    object: "model" as const,
    owned_by: "dreamina.capcut.com",
    model_type: "image" as const,
    model_req_key: m.model_req_key,
    model_name: m.model_name,
    model_tip: m.model_tip,
    feats: m.feats,
    resolution_map: m.resolution_map,
    source: "ssr" as const,
  }));
  const video = (file.video_models || []).map((m) => ({
    id: m.model_req_key,
    object: "model" as const,
    owned_by: "dreamina.capcut.com",
    model_type: "video" as const,
    model_req_key: m.model_req_key,
    model_name: m.model_name,
    model_tip: m.model_tip,
    options: m.options,
    source: "ssr" as const,
  }));
  return [...image, ...video];
}

type UpstreamMeta = {
  model_req_key: string;
  model_name?: string;
  model_tip?: string;
  feats?: string[];
  options?: { key: string }[];
  resolution_map?: Record<string, unknown>;
};

function parseUpstreamList(list: unknown[], modelType: "image" | "video"): DreaminaModelItem[] {
  if (!Array.isArray(list)) return [];
  const out: DreaminaModelItem[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const key = row.model_req_key;
    if (typeof key !== "string" || !key) continue;
    const meta = row as UpstreamMeta;
    out.push({
      id: key,
      object: "model",
      owned_by: "dreamina-api.us.capcut.com",
      model_type: modelType,
      model_req_key: key,
      model_name:
        (typeof meta.model_name === "string" && meta.model_name) ||
        (typeof row.model_name_starling_key === "string" ? row.model_name_starling_key : undefined),
      model_tip:
        (typeof meta.model_tip === "string" && meta.model_tip) ||
        (typeof row.model_tip_starling_key === "string" ? row.model_tip_starling_key : undefined),
      feats: Array.isArray(meta.feats) ? meta.feats : undefined,
      options: Array.isArray(meta.options)
        ? meta.options.map((o) => o?.key).filter((k): k is string => typeof k === "string")
        : undefined,
      resolution_map: meta.resolution_map ? Object.keys(meta.resolution_map) : undefined,
      source: "api",
    });
  }
  return out;
}

export async function fetchUpstreamModels(
  refreshToken: string,
  proxyOpts: { proxyUrl?: string | null } = {}
): Promise<DreaminaModelItem[]> {
  const [imageConfig, videoConfig] = await Promise.all([
    request("post", "/mweb/v1/get_common_config", refreshToken, {
      proxyUrl: proxyOpts.proxyUrl,
      params: { needCache: true, needRefresh: false },
      data: {},
    }),
    request("post", "/mweb/v1/video_generate/get_common_config", refreshToken, {
      proxyUrl: proxyOpts.proxyUrl,
      data: { scene: "generate_video", params: {} },
    }),
  ]);

  const imageList = parseUpstreamList(imageConfig?.model_list, "image");
  const videoList = parseUpstreamList(videoConfig?.model_list, "video");
  return [...imageList, ...videoList];
}

function mergeByReqKey(...lists: DreaminaModelItem[][]): DreaminaModelItem[] {
  const map = new Map<string, DreaminaModelItem>();
  for (const list of lists) {
    for (const item of list) {
      const prev = map.get(item.model_req_key);
      map.set(item.model_req_key, {
        ...prev,
        ...item,
        source: prev ? "merged" : item.source,
      });
    }
  }
  return [...map.values()].sort((a, b) => a.id.localeCompare(b.id));
}

export async function listModels(authorization?: string): Promise<{
  object: "list";
  data: DreaminaModelItem[];
  meta: { source: string; scraped_path: string };
}> {
  if (cache && cache.expiresAt > Date.now()) {
    return {
      object: "list",
      data: cache.data,
      meta: { source: "cache", scraped_path: SCRAPED_PATH },
    };
  }

  const scraped = loadScraped();
  const scrapedModels = scraped ? fromScraped(scraped) : [];

  let apiModels: DreaminaModelItem[] = [];
  const picked = authorization ? pickOneSession(authorization) : undefined;
  if (picked) {
    try {
      apiModels = await fetchUpstreamModels(picked.sessionId, { proxyUrl: picked.apiProxy });
    } catch {
      apiModels = [];
    }
  }

  const data = mergeByReqKey(scrapedModels, apiModels);
  cache = { expiresAt: Date.now() + CACHE_TTL_MS, data };

  const source =
    apiModels.length > 0 && scrapedModels.length > 0
      ? "ssr+api"
      : apiModels.length > 0
        ? "api"
        : "ssr";

  return {
    object: "list",
    data,
    meta: { source, scraped_path: SCRAPED_PATH },
  };
}

export function resolveModelReqKey(
  model: string | undefined,
  type: "image" | "video",
  models?: DreaminaModelItem[]
): string {
  if (model && model.length > 0) return model;
  const list = models || cache?.data || fromScraped(loadScraped() || { image_models: [], video_models: [] });
  const first = list.find((m) => m.model_type === type);
  if (first) return first.model_req_key;
  return type === "image" ? "high_aes_general_v40l" : "dreamina_seedance_40_pro";
}