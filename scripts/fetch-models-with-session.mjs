/**
 * Usage (do not commit session):
 *   set DREAMINA_SESSION=your_sessionid
 *   node scripts/fetch-models-with-session.mjs
 */
import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
// Dynamic import compiled ESM - use inline fetch via dreamina API pattern
import axios from "axios";
import crypto from "crypto";

const session = process.env.DREAMINA_SESSION;
if (!session) {
  console.error("Set DREAMINA_SESSION env var");
  process.exit(1);
}

const API_BASE = "https://dreamina-api.us.capcut.com";
const AID = "513641";
const PLATFORM = "7";
const VERSION = "8.4.0";
const DEVICE_ID = "7000000000000000001";
const ALLOWED_IMAGE_MODEL_REQ_KEYS = new Set([
  "dreamina_lib_img_20260423",
  "high_aes_general_v50",
  "high_aes_general_v43",
  "high_aes_general_v42",
  "high_aes_general_v40l",
]);
const ALLOWED_VIDEO_MODEL_REQ_KEYS = new Set([
  "dreamina_seedance_40_mini",
  "dreamina_seedance_40",
  "dreamina_seedance_40_pro",
  "dreamina_ic_generate_video_model_vgfm_3.5_pro",
  "dreamina_ic_generate_video_model_vgfm_3.0_pro",
  "dreamina_ic_generate_video_model_vgfm_3.0_fast",
]);

function sign(uri) {
  const t = Math.floor(Date.now() / 1000);
  const s = crypto.createHash("md5").update(`9e2c|${uri.slice(-7)}|${PLATFORM}|${VERSION}|${t}||11ac`).digest("hex");
  return { t, s };
}

function cookie(sid) {
  const ts = Math.floor(Date.now() / 1000);
  return [
    "store-idc=useast5",
    "store-country-code=us",
    "sid_tt=" + sid,
    "sessionid=" + sid,
    `sid_guard=${sid}%7C${ts}%7C5184000%7CWed`,
  ].join("; ");
}

async function mwebPost(uri, data, extraParams = {}) {
  const { t, s } = sign(uri);
  const url = API_BASE + uri;
  const res = await axios.post(url, data, {
    params: {
      aid: AID,
      device_platform: "web",
      region: "US",
      da_version: "3.3.7",
      web_version: "7.5.0",
      ...extraParams,
    },
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie(session),
      "Device-Time": String(t),
      Sign: s,
      "Sign-Ver": "1",
      Did: DEVICE_ID,
      Origin: "https://dreamina.capcut.com",
      Referer: "https://dreamina.capcut.com/",
      Appid: AID,
    },
    timeout: 45000,
    validateStatus: () => true,
  });
  const body = res.data;
  if (body?.ret !== "0" && body?.ret !== 0) {
    throw new Error(body?.errmsg || JSON.stringify(body).slice(0, 200));
  }
  return body.data;
}

function slim(list, type) {
  const allowed = type === "image" ? ALLOWED_IMAGE_MODEL_REQ_KEYS : ALLOWED_VIDEO_MODEL_REQ_KEYS;
  return (list || []).filter((m) => allowed.has(m.model_req_key)).map((m) => ({
    model_req_key: m.model_req_key,
    model_name: m.model_name || m.model_name_starling_key,
    model_tip: m.model_tip || m.model_tip_starling_key,
    type,
    options: Array.isArray(m.options)
      ? m.options.map((option) => option?.key).filter((key) => typeof key === "string")
      : undefined,
  }));
}

const image = await mwebPost("/mweb/v1/get_common_config", {}, { needCache: true, needRefresh: true });
const video = await mwebPost("/mweb/v1/video_generate/get_common_config", {
  scene: "generate_video",
  params: {},
});

const out = {
  fetched_at: new Date().toISOString(),
  source: "dreamina-api.us.capcut.com (authenticated)",
  image_models: slim(image?.model_list, "image"),
  video_models: slim(video?.model_list, "video"),
};

const outPath = path.resolve(process.cwd(), "data/dreamina-models-api.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log("Wrote", outPath);
console.log("image:", out.image_models.length, "video:", out.video_models.length);
console.log(JSON.stringify(out, null, 2));
