import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

function runWithJiti(source) {
  const script = `
import { createJiti } from "jiti";
import path from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = ${JSON.stringify(projectRoot)};
const jiti = createJiti(pathToFileURL(path.join(projectRoot, "package.json")).href, {
  alias: {
    "~~": projectRoot,
    "~~/*": path.join(projectRoot, "*"),
  },
  tsconfigPaths: true,
  interopDefault: true,
});
${source}
`;

  const result = spawnSync(process.execPath, ["--input-type=module", "-"], {
    cwd: projectRoot,
    input: script,
    encoding: "utf8",
  });

  assert.equal(
    result.status,
    0,
    `child process failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );

  return JSON.parse(result.stdout);
}

test("video body normalization accepts OpenAI and Grok-compatible fields", () => {
  const result = runWithJiti(`
const { normalizeVideoBody } = await jiti.import(
  path.join(projectRoot, "server/services/media-format.ts"),
);

const openai = normalizeVideoBody({
  model: "seedance-2.0-mini",
  prompt: "a flying cat",
  size: "1280x720",
  duration: "4s",
  file_paths: ["https://example.com/first.png"],
  n: 1,
});

const grok = normalizeVideoBody({
  model: "seedance-2.0",
  prompt: "a running dog",
  aspect_ratio: "9:16",
  resolution: "2160p",
  duration_seconds: 8,
  image_url: "https://example.com/start.png",
  endFrameRef: "https://example.com/end.png",
  deferred: true,
});

process.stdout.write(JSON.stringify({ openai, grok }));
process.exit(0);
`);

  assert.deepEqual(
    {
      model: result.openai.model,
      width: result.openai.width,
      height: result.openai.height,
      resolution: result.openai.resolution,
      durationSec: result.openai.durationSec,
      filePaths: result.openai.filePaths,
      asyncMode: result.openai.asyncMode,
    },
    {
      model: "dreamina_seedance_40_mini",
      width: 1280,
      height: 720,
      resolution: "720p",
      durationSec: 4,
      filePaths: ["https://example.com/first.png"],
      asyncMode: false,
    },
  );

  assert.deepEqual(
    {
      model: result.grok.model,
      width: result.grok.width,
      height: result.grok.height,
      resolution: result.grok.resolution,
      durationSec: result.grok.durationSec,
      filePaths: result.grok.filePaths,
      asyncMode: result.grok.asyncMode,
    },
    {
      model: "dreamina_seedance_40_pro",
      width: 1440,
      height: 2560,
      resolution: "4k",
      durationSec: 8,
      filePaths: ["https://example.com/start.png", "https://example.com/end.png"],
      asyncMode: true,
    },
  );
});

test("video draft request matches the captured Dreamina generate pipeline", () => {
  const result = runWithJiti(`
const {
  buildDreaminaVideoGenerationRequest,
} = await jiti.import(path.join(projectRoot, "server/clients/dreamina/videos.ts"));
const {
  adaptVideoGenerationInput,
} = await jiti.import(path.join(projectRoot, "server/services/pool/video-model-config.ts"));

const adaptedInput = adaptVideoGenerationInput("dreamina_seedance_40_mini", {
  width: 1280,
  height: 720,
  resolution: "720p",
  durationSec: 4,
  filePaths: [],
});

const built = buildDreaminaVideoGenerationRequest({
  model: "dreamina_seedance_40_mini",
  prompt: "a flying cat",
  adaptedInput,
  firstFrameImage: undefined,
  endFrameImage: undefined,
  submitId: "4df8a760-8f07-43b8-a9be-f457c771e04b",
  submitGroupId: "dab6a413-58ca-43db-bab2-ec7b04b68c14",
  draftId: "f875bbc1-1baa-631c-7104-3d452cf6be30",
  componentId: "bfc6b6d3-9b80-d563-6a89-e43c9987627f",
  nowMs: 1782879996509,
  seed: 2896093832,
  generateId: "gen-93397058-b110-47db-9dfb-564db3ba0108",
});

const draft = JSON.parse(built.data.draft_content);
const metrics = JSON.parse(built.data.metrics_extra);
const sceneOptions = JSON.parse(metrics.sceneOptions);
const input = draft.component_list[0].abilities.gen_video.text_to_video_params.video_gen_inputs[0];
const textParams = draft.component_list[0].abilities.gen_video.text_to_video_params;

process.stdout.write(JSON.stringify({
  params: built.params,
  submitId: built.submitId,
  extend: built.data.extend,
  metrics,
  sceneOptions,
  draft: {
    version: draft.version,
    minFeatures: draft.min_features,
    processType: draft.component_list[0].process_type,
    aspectRatio: textParams.video_aspect_ratio,
    modelReqKey: textParams.model_req_key,
    seed: textParams.seed,
    input,
  },
}));
process.exit(0);
`);

  assert.equal(result.submitId, "4df8a760-8f07-43b8-a9be-f457c771e04b");
  assert.equal(result.params.web_version, "7.5.0");
  assert.equal(result.params.da_version, "3.3.20");
  assert.equal(result.params.commerce_with_input_video, 1);
  assert.equal(result.params.generate_id, "gen-93397058-b110-47db-9dfb-564db3ba0108");
  assert.match(result.params.babi_param, /makesame-text_to_video/);

  assert.deepEqual(result.extend.m_video_commerce_info, {
    amount: 4,
    benefit_type: "seedance_20_mini_720p_output",
    resource_id: "generate_video",
    resource_id_type: "str",
    resource_sub_type: "aigc",
  });
  assert.equal(result.extend.workspace_id, 0);

  assert.equal(result.metrics.originSubmitId, result.submitId);
  assert.equal(result.metrics.position, "page_bottom_box");
  assert.equal(result.metrics.functionMode, "omni_reference");
  assert.deepEqual(result.sceneOptions[0], {
    type: "video",
    scene: "BasicVideoGenerateButton",
    resolution: "720p",
    modelReqKey: "dreamina_seedance_40_mini",
    videoDuration: 4,
    batchNumber: 1,
    inputVideoDuration: 0,
    useSeedanceFast5sFreeTrial: false,
    reportParams: {
      enterSource: "generate",
      vipSource: "generate",
      extraVipFunctionKey: "dreamina_seedance_40_mini-720p",
      useVipFunctionDetailsReporterHoc: true,
    },
    materialTypes: [],
  });

  assert.equal(result.draft.version, "3.3.20");
  assert.deepEqual(result.draft.minFeatures, []);
  assert.equal(result.draft.processType, 1);
  assert.equal(result.draft.aspectRatio, "16:9");
  assert.equal(result.draft.modelReqKey, "dreamina_seedance_40_mini");
  assert.equal(result.draft.seed, 2896093832);
  assert.deepEqual(result.draft.input, {
    type: "",
    id: result.draft.input.id,
    min_version: "3.0.5",
    prompt: "a flying cat",
    video_mode: 2,
    fps: 24,
    duration_ms: 4000,
    resolution: "720p",
    idip_meta_list: [],
  });
});

test("video polling parses submit-id keyed history and extracts final video urls", () => {
  const result = runWithJiti(`
const {
  extractDreaminaVideoUrl,
  getDreaminaVideoHistoryRecord,
  isDreaminaVideoProcessing,
} = await jiti.import(path.join(projectRoot, "server/clients/dreamina/videos.ts"));

const submitId = "4df8a760-8f07-43b8-a9be-f457c771e04b";
const historyId = "22335402454532";
const record = {
  status: 50,
  history_record_id: historyId,
  submit_id: submitId,
  item_list: [
    {
      video: {
        transcoded_video: {
          origin: {
            video_url: "https://v16-cc.capcut.com/final.mp4",
          },
        },
      },
    },
  ],
};

const keyed = getDreaminaVideoHistoryRecord({ [submitId]: record }, submitId, historyId);
const legacy = getDreaminaVideoHistoryRecord({ history_list: [record] }, submitId, historyId);

process.stdout.write(JSON.stringify({
  keyedStatus: keyed?.status,
  legacyStatus: legacy?.status,
  processing20: isDreaminaVideoProcessing({ status: 20 }),
  processing42: isDreaminaVideoProcessing({ status: 42 }),
  complete50: isDreaminaVideoProcessing(record),
  url: extractDreaminaVideoUrl(record),
}));
process.exit(0);
`);

  assert.equal(result.keyedStatus, 50);
  assert.equal(result.legacyStatus, 50);
  assert.equal(result.processing20, true);
  assert.equal(result.processing42, true);
  assert.equal(result.complete50, false);
  assert.equal(result.url, "https://v16-cc.capcut.com/final.mp4");
});

test("video client polls get_history_by_ids with submit_ids", () => {
  const source = read("server/clients/dreamina/videos.ts");

  assert.ok(source.includes("submit_ids: [pollingSubmitId]"));
  assert.ok(!source.includes("history_ids: [historyId]"));
});
