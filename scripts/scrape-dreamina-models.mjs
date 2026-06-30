import fs from "fs";

const files = [
  "C:/Users/36026/AppData/Local/Temp/kilo/dreamina-home.html",
  "C:/Users/36026/AppData/Local/Temp/kilo/dreamina-image.html",
  "C:/Users/36026/AppData/Local/Temp/kilo/dreamina-video.html",
];

function extractScriptJson(html, id) {
  const marker = `id="${id}"`;
  const start = html.indexOf(marker);
  if (start < 0) return null;
  const gt = html.indexOf(">", start);
  const end = html.indexOf("</script>", gt);
  if (gt < 0 || end < 0) return null;
  const raw = html.slice(gt + 1, end).trim();
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function collectModels(html) {
  const imageWrap = extractScriptJson(html, "__GTW_GENERATE_MODEL_CONFIG____IMAGE__");
  const videoWrap = extractScriptJson(html, "__GTW_GENERATE_MODEL_CONFIG____VIDEO__");
  const imageList = imageWrap?.__image_generate_model_config__?.data?.model_list ?? [];
  const videoList = videoWrap?.__video_generate_model_config__?.data?.model_list ?? [];
  return { imageList, videoList };
}

const imageByKey = new Map();
const videoByKey = new Map();

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, "utf8");
  const { imageList, videoList } = collectModels(html);
  for (const m of imageList) {
    if (m.model_req_key) imageByKey.set(m.model_req_key, m);
  }
  for (const m of videoList) {
    if (m.model_req_key) videoByKey.set(m.model_req_key, m);
  }
}

const out = {
  scraped_at: new Date().toISOString(),
  source: "https://dreamina.capcut.com/ai-tool/home SSR __GTW_GENERATE_MODEL_CONFIG__",
  image_models: [...imageByKey.values()].map((m) => ({
    model_req_key: m.model_req_key,
    model_name: m.model_name || m.model_name_starling_key || "",
    model_tip: m.model_tip || m.model_tip_starling_key || "",
    feats: m.feats,
    resolution_map: m.resolution_map ? Object.keys(m.resolution_map) : undefined,
  })),
  video_models: [...videoByKey.values()].map((m) => ({
    model_req_key: m.model_req_key,
    model_name: m.model_name || m.model_name_starling_key || "",
    model_tip: m.model_tip || m.model_tip_starling_key || "",
    options: (m.options || []).map((o) => o.key),
  })),
};

const outPath = new URL("../data/dreamina-models-scraped.json", import.meta.url);
fs.mkdirSync(new URL("../data/", import.meta.url), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));