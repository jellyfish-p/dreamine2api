/**
 * 固定公开模型 ID（OpenAI / xAI / Seedream 风格）→ Dreamina model_req_key
 */

export type CatalogEntry = {
  public_id: string;
  model_req_key: string;
  model_type: "image" | "video";
  model_name?: string;
  model_tip?: string;
};

export const MODEL_CATALOG: CatalogEntry[] = [
  { public_id: "gpt-image-2", model_req_key: "dreamina_lib_img_20260423", model_type: "image", model_name: "GPT Image 2" },
  { public_id: "seedream-5.0-lite", model_req_key: "high_aes_general_v50", model_type: "image", model_name: "Seedream 5.0 Lite" },
  { public_id: "seedream-4.7", model_req_key: "high_aes_general_v43", model_type: "image", model_name: "Seedream 4.7" },
  { public_id: "seedream-4.6", model_req_key: "high_aes_general_v42", model_type: "image", model_name: "Seedream 4.6" },
  { public_id: "seedream-4.5", model_req_key: "high_aes_general_v40l", model_type: "image", model_name: "Seedream 4.5" },
  { public_id: "seedream-4.1", model_req_key: "high_aes_general_v41", model_type: "image", model_name: "Seedream 4.1" },
  { public_id: "seedream-4.0", model_req_key: "high_aes_general_v40", model_type: "image", model_name: "Seedream 4.0" },
  { public_id: "nano-banana", model_req_key: "external_model_gemini_flash_image_v25", model_type: "image", model_name: "Nano Banana" },
  { public_id: "seedream-3.1", model_req_key: "high_aes_general_v30l_art:general_v3.0_18b", model_type: "image", model_name: "Seedream 3.1" },
  { public_id: "seedream-3.0", model_req_key: "high_aes_general_v30l:general_v3.0_18b", model_type: "image", model_name: "Seedream 3.0" },
  { public_id: "seedance-2.0-mini", model_req_key: "dreamina_seedance_40_mini", model_type: "video", model_name: "Seedance 2.0 Mini" },
  { public_id: "seedance-2.0-fast", model_req_key: "dreamina_seedance_40", model_type: "video", model_name: "Seedance 2.0 Fast" },
  { public_id: "seedance-2.0", model_req_key: "dreamina_seedance_40_pro", model_type: "video", model_name: "Seedance 2.0" },
  { public_id: "seedance-1.5-pro", model_req_key: "dreamina_ic_generate_video_model_vgfm_3.5_pro", model_type: "video", model_name: "Seedance 1.5 Pro" },
  { public_id: "seedance-1.0-fast", model_req_key: "dreamina_ic_generate_video_model_vgfm_3.0_fast", model_type: "video", model_name: "Seedance 1.0 Fast" },
  { public_id: "seedance-1.0", model_req_key: "dreamina_ic_generate_video_model_vgfm_3.0", model_type: "video", model_name: "Seedance 1.0" },
  { public_id: "seedance-1.0-pro", model_req_key: "dreamina_ic_generate_video_model_vgfm_3.0_pro", model_type: "video", model_name: "Seedance 1.0 Pro" },
  { public_id: "sora2", model_req_key: "dreamina_sora2_generate_video", model_type: "video", model_name: "Sora 2" },
  { public_id: "veo-3.1", model_req_key: "dreamina_veo3.1_generate_video", model_type: "video", model_name: "Veo 3.1" },
  { public_id: "veo-3", model_req_key: "dreamina_veo3_generate_video", model_type: "video", model_name: "Veo 3" },
];

const byPublic = new Map(MODEL_CATALOG.map((e) => [e.public_id, e]));
const byReqKey = new Map(MODEL_CATALOG.map((e) => [e.model_req_key, e]));

export function resolveModelReqKey(model?: string): string | undefined {
  if (!model) return undefined;
  const t = model.trim();
  if (!t) return undefined;
  if (byPublic.has(t)) return byPublic.get(t)!.model_req_key;
  if (byReqKey.has(t)) return t;
  return t;
}

export function listCatalogEntries(): CatalogEntry[] {
  return [...MODEL_CATALOG];
}