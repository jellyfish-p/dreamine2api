import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const CATALOG = [
  ["gpt-image-2", "dreamina_lib_img_20260423", "image", "GPT Image 2"],
  ["seedream-5.0-lite", "high_aes_general_v50", "image", "Seedream 5.0 Lite"],
  ["seedream-4.7", "high_aes_general_v43", "image", "Seedream 4.7"],
  ["seedream-4.6", "high_aes_general_v42", "image", "Seedream 4.6"],
  ["seedream-4.5", "high_aes_general_v40l", "image", "Seedream 4.5"],
  ["seedream-4.1", "high_aes_general_v41", "image", "Seedream 4.1"],
  ["seedream-4.0", "high_aes_general_v40", "image", "Seedream 4.0"],
  ["nano-banana", "external_model_gemini_flash_image_v25", "image", "Nano Banana"],
  ["seedream-3.1", "high_aes_general_v30l_art:general_v3.0_18b", "image", "Seedream 3.1"],
  ["seedream-3.0", "high_aes_general_v30l:general_v3.0_18b", "image", "Seedream 3.0"],
  ["seedance-2.0-mini", "dreamina_seedance_40_mini", "video", "Seedance 2.0 Mini"],
  ["seedance-2.0-fast", "dreamina_seedance_40", "video", "Seedance 2.0 Fast"],
  ["seedance-2.0", "dreamina_seedance_40_pro", "video", "Seedance 2.0"],
  ["seedance-1.5-pro", "dreamina_ic_generate_video_model_vgfm_3.5_pro", "video", "Seedance 1.5 Pro"],
  ["seedance-1.0-fast", "dreamina_ic_generate_video_model_vgfm_3.0_fast", "video", "Seedance 1.0 Fast"],
  ["seedance-1.0", "dreamina_ic_generate_video_model_vgfm_3.0", "video", "Seedance 1.0"],
  ["seedance-1.0-pro", "dreamina_ic_generate_video_model_vgfm_3.0_pro", "video", "Seedance 1.0 Pro"],
  ["sora2", "dreamina_sora2_generate_video", "video", "Sora 2"],
  ["veo-3.1", "dreamina_veo3.1_generate_video", "video", "Veo 3.1"],
  ["veo-3", "dreamina_veo3_generate_video", "video", "Veo 3"],
];

function loadMeta() {
  const meta = new Map();
  for (const f of ["dreamina-models-scraped.json", "dreamina-models-api.json"]) {
    const p = path.join(projectRoot, "data", f);
    if (!fs.existsSync(p)) continue;
    const j = JSON.parse(fs.readFileSync(p, "utf8"));
    for (const m of [...(j.image_models || []), ...(j.video_models || [])]) {
      meta.set(m.model_req_key, {
        model_name: m.model_name,
        model_tip: m.model_tip,
        feats: m.feats,
        options: m.options,
        resolution_map: m.resolution_map,
      });
    }
  }
  return meta;
}

const meta = loadMeta();
const models = CATALOG.map(([public_id, model_req_key, model_type, display_name]) => {
  const m = meta.get(model_req_key) || {};
  return {
    public_id,
    model_req_key,
    model_type,
    display_name,
    model_name: m.model_name || display_name,
    model_tip: m.model_tip,
    feats: m.feats,
    options: m.options,
    resolution_map: m.resolution_map,
    upstream_seen: meta.has(model_req_key),
  };
});

const apiPath = path.join(projectRoot, "data", "dreamina-models-api.json");
let accountSnapshot = null;
if (fs.existsSync(apiPath)) {
  const api = JSON.parse(fs.readFileSync(apiPath, "utf8"));
  accountSnapshot = {
    fetched_at: api.fetched_at,
    image: (api.image_models || []).map((x) => x.model_req_key),
    video: (api.video_models || []).map((x) => x.model_req_key),
  };
}

const out = {
  built_at: new Date().toISOString(),
  note: "public_id for /v1/models and request model; maps to model_req_key",
  account_snapshot: accountSnapshot,
  models,
};

const outPath = path.join(projectRoot, "data", "dreamina-models-catalog.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log("Wrote", outPath);
console.log("upstream_seen:", models.filter((x) => x.upstream_seen).length, "/", models.length);