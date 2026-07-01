import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
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

test("public image routes expose OpenAI-compatible endpoints without history", () => {
  assert.equal(fs.existsSync(path.join(projectRoot, "server/routes/v1/images/generations.post.ts")), true);
  assert.equal(fs.existsSync(path.join(projectRoot, "server/routes/v1/images/edits.post.ts")), true);
  assert.equal(fs.existsSync(path.join(projectRoot, "server/routes/v1/images/compositions.post.ts")), true);
  assert.equal(fs.existsSync(path.join(projectRoot, "server/routes/v1/images/history.post.ts")), false);

  const serviceSource = read("server/services/images.ts");
  assert.equal(serviceSource.includes("getImageHistory"), false);
  assert.equal(serviceSource.includes("getHistoryBySubmitIds"), false);
});

test("dreamina mixed image records count failed items toward completion", () => {
  const result = runWithJiti(`
const {
  getDreaminaImageCompletion,
  getDreaminaImageUrls,
  getDreaminaFailedImageResults,
} = await jiti.import(path.join(projectRoot, "server/clients/dreamina/images.ts"));

const record = {
  status: 20,
  finished_image_count: 4,
  pre_gen_item_ids: ["a", "b", "c", "d"],
  item_list: [
    { common_attr: { id: "ok-1" }, image: { large_images: [{ image_url: "https://example.com/1.png", width: 1024, height: 1536, format: "png" }] } },
    { common_attr: { id: "ok-2", cover_url: "https://example.com/2-cover.png" }, image: { large_images: [{ image_url: "https://example.com/2.png", width: 1024, height: 1536, format: "png" }] } },
    { common_attr: { id: "ok-3", cover_url: "https://example.com/3-cover.png" } },
  ],
  failed_item_list: [
    { common_attr: { id: "fail-1" }, gen_result_data: { result_code: 1, result_msg: "SystemBusy" } },
  ],
};

process.stdout.write(JSON.stringify({
  completion: getDreaminaImageCompletion(record, 4),
  urls: getDreaminaImageUrls(record.item_list),
  failed: getDreaminaFailedImageResults(record.failed_item_list),
}));
process.exit(0);
`);

  assert.deepEqual(result.completion, {
    expectedCount: 4,
    successCount: 3,
    failedCount: 1,
    completedCount: 4,
    complete: true,
  });
  assert.deepEqual(result.urls, [
    "https://example.com/1.png",
    "https://example.com/2.png",
    "https://example.com/3-cover.png",
  ]);
  assert.deepEqual(result.failed, [
    { id: "fail-1", code: 1, message: "SystemBusy" },
  ]);
});

test("zero successful dreamina images raise a stable generation error", () => {
  const result = runWithJiti(`
const {
  ensureDreaminaImageUrls,
  getDreaminaImageCompletion,
} = await jiti.import(path.join(projectRoot, "server/clients/dreamina/images.ts"));

const record = {
  status: 20,
  pre_gen_item_ids: ["a"],
  item_list: [],
  failed_item_list: [
    { common_attr: { id: "fail-1" }, gen_result_data: { result_code: 1, result_msg: "SystemBusy" } },
  ],
};

try {
  ensureDreaminaImageUrls([], record, "图像生成");
  process.stdout.write(JSON.stringify({ threw: false }));
} catch (error) {
  process.stdout.write(JSON.stringify({
    threw: true,
    errcode: error.errcode,
    message: error.message,
    completion: getDreaminaImageCompletion(record, 4),
  }));
}
process.exit(0);
`);

  assert.equal(result.threw, true);
  assert.equal(result.errcode, -2007);
  assert.match(result.message, /SystemBusy/);
  assert.equal(result.completion.complete, true);
});

test("image service keeps response_format handling inside OpenAI response formatting", () => {
  const source = read("server/services/images.ts");

  assert.ok(source.includes('responseFormat === "b64_json"'));
  assert.ok(source.includes("util.fetchFileBASE64"));
  assert.ok(source.includes("return formatImageResult(urls, request.responseFormat);"));
});
