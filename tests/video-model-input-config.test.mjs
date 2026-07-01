import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const projectRoot = path.resolve(import.meta.dirname, "..");

function read(relPath) {
  return fs.readFileSync(path.join(projectRoot, relPath), "utf8");
}

function readJson(relPath) {
  return JSON.parse(read(relPath));
}

const staleVideoModelIds = ["seedance-1.0-pro", "sora2", "veo-3.1", "veo-3"];
const staleVideoReqKeys = [
  "dreamina_ic_generate_video_model_vgfm_3.0",
  "dreamina_sora2_generate_video",
  "dreamina_veo3.1_generate_video",
  "dreamina_veo3_generate_video",
];
const staleImageModelIds = ["seedream-4.1", "seedream-4.0", "nano-banana", "seedream-3.1", "seedream-3.0"];
const staleImageReqKeys = [
  "high_aes_general_v41",
  "high_aes_general_v40",
  "external_model_gemini_flash_image_v25",
  "high_aes_general_v30l_art:general_v3.0_18b",
  "high_aes_general_v30l:general_v3.0_18b",
];

test("public video model catalog removes stale models absent from Dreamina config", () => {
  const catalogSource = read("server/services/pool/model-catalog.ts");
  const publicModels = readJson("data/dreamina-public-models.json");
  const generatedCatalog = readJson("data/dreamina-models-catalog.json");

  const publicVideoIds = publicModels.video.map((model) => model.id);
  const generatedVideoIds = generatedCatalog.models
    .filter((model) => model.model_type === "video")
    .map((model) => model.public_id);

  assert.deepEqual(publicVideoIds, [
    "seedance-2.0-mini",
    "seedance-2.0-fast",
    "seedance-2.0",
    "seedance-1.5-pro",
    "seedance-1.0-fast",
    "seedance-1.0",
  ]);

  for (const staleId of staleVideoModelIds) {
    assert.ok(!publicVideoIds.includes(staleId), `${staleId} should not be public`);
    assert.ok(!generatedVideoIds.includes(staleId), `${staleId} should not be generated`);
    assert.ok(!catalogSource.includes(`public_id: "${staleId}"`), `${staleId} should not resolve`);
  }

  for (const staleReqKey of staleVideoReqKeys) {
    assert.ok(!publicModels.video.some((model) => model.model_req_key === staleReqKey), `${staleReqKey} should not be public`);
    assert.ok(!generatedCatalog.models.some((model) => model.model_req_key === staleReqKey), `${staleReqKey} should not be generated`);
    assert.ok(!catalogSource.includes(`model_req_key: "${staleReqKey}"`), `${staleReqKey} should not resolve`);
  }
});

test("public image model catalog only exposes supported Seedream and GPT Image models", () => {
  const catalogSource = read("server/services/pool/model-catalog.ts");
  const commonSource = read("server/clients/dreamina/consts/common.ts");
  const publicModels = readJson("data/dreamina-public-models.json");
  const scrapedModels = readJson("data/dreamina-models-scraped.json");
  const apiModels = readJson("data/dreamina-models-api.json");
  const generatedCatalog = readJson("data/dreamina-models-catalog.json");

  const publicImageIds = publicModels.image.map((model) => model.id);
  const generatedImageIds = generatedCatalog.models
    .filter((model) => model.model_type === "image")
    .map((model) => model.public_id);

  assert.deepEqual(publicImageIds, [
    "gpt-image-2",
    "seedream-5.0-lite",
    "seedream-4.7",
    "seedream-4.6",
    "seedream-4.5",
  ]);

  for (const staleId of staleImageModelIds) {
    assert.ok(!publicImageIds.includes(staleId), `${staleId} should not be public`);
    assert.ok(!generatedImageIds.includes(staleId), `${staleId} should not be generated`);
    assert.ok(!catalogSource.includes(`public_id: "${staleId}"`), `${staleId} should not resolve`);
  }

  for (const staleReqKey of staleImageReqKeys) {
    assert.ok(!publicModels.image.some((model) => model.model_req_key === staleReqKey), `${staleReqKey} should not be public`);
    assert.ok(!scrapedModels.image_models.some((model) => model.model_req_key === staleReqKey), `${staleReqKey} should not be scraped`);
    assert.ok(!apiModels.image_models.some((model) => model.model_req_key === staleReqKey), `${staleReqKey} should not be in API snapshot`);
    assert.ok(!generatedCatalog.models.some((model) => model.model_req_key === staleReqKey), `${staleReqKey} should not be generated`);
    assert.ok(!catalogSource.includes(`model_req_key: "${staleReqKey}"`), `${staleReqKey} should not resolve`);
    assert.ok(!commonSource.includes(`"${staleReqKey}"`), `${staleReqKey} should not be in legacy image aliases`);
  }
});

test("video client does not route end-frame jobs through nonexistent Seedance 1.0 key", () => {
  const source = read("server/clients/dreamina/videos.ts");

  assert.ok(
    !source.includes('"root_model": end_frame_image ? "dreamina_ic_generate_video_model_vgfm_3.0" : model'),
    "end-frame jobs should not force the stale dreamina_ic_generate_video_model_vgfm_3.0 key",
  );
  assert.match(source, /root_model:\s*model/, "root_model should use the resolved supported model");
});

test("video input adapter includes capabilities from provided Dreamina config", () => {
  const source = read("server/services/pool/video-model-config.ts");

  assert.ok(source.includes("dreamina_seedance_40_pro"), "Seedance 2.0 should be configured");
  assert.ok(source.includes('"4k"'), "Seedance 2.0 should retain 4k as a supported resolution");
  assert.ok(source.includes("dreamina_ic_generate_video_model_vgfm_3.0_pro"), "Seedance 1.0 should be configured");
  assert.ok(source.includes("dreamina_ic_generate_video_model_vgfm_3.0_fast"), "Seedance 1.0 Fast should be configured");
  assert.ok(source.includes('"multi_frame"'), "Seedance 1.0 Fast should retain multi_frame input capability");
});
