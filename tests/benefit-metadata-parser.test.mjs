import assert from "node:assert/strict";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

function md5(input) {
  return createHash("md5").update(input).digest("hex");
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

test("benefit metadata request matches captured Commerce protocol shape", () => {
  const request = runWithJiti(`
const { buildCommerceBenefitMetadataRequest } = await jiti.import(
  path.join(projectRoot, "server/clients/dreamina/benefit-metadata.ts"),
);
const request = await buildCommerceBenefitMetadataRequest("session-token", {
  deviceTime: 1782832165,
  deviceId: "7650423310582023687",
});
process.stdout.write(JSON.stringify(request));
process.exit(0);
`);

  const url = new URL(request.url);
  assert.equal(url.origin, "https://commerce-api-sg.capcut.com");
  assert.equal(url.pathname, "/commerce/v3/resource/benefit_metadata");
  assert.equal(url.searchParams.get("aid"), "513641");
  assert.equal(url.searchParams.get("web_version"), "7.5.0");
  assert.equal(url.searchParams.get("da_version"), "3.3.20");
  assert.equal(url.searchParams.get("aigc_features"), "app_lip_sync");
  assert.equal(request.method, "POST");
  assert.deepEqual(request.data, {
    query_list: [
      { resource_type: "aigc", resource_id: "get_all", benefit_type_list: [] },
      { resource_type: "normal_func", resource_id: "get_all", benefit_type_list: [] },
    ],
  });
  assert.equal(request.headers["appid"], "513641");
  assert.equal(request.headers["appvr"], "8.4.0");
  assert.equal(request.headers["device-time"], "1782832165");
  assert.equal(request.headers["did"], "7650423310582023687");
  assert.equal(request.headers["lan"], "en");
  assert.equal(request.headers["loc"], "VN");
  assert.equal(request.headers["store-country-code"], "vn");
  assert.equal(request.headers["sign"], md5("9e2c|etadata|7|8.4.0|1782832165||11ac"));
  assert.equal(request.headers["sign"], "87cc86363f3ccea6e01f532584a11bf9");
});

test("benefit metadata parser reads fallback response string and indexes prices", () => {
  assert.equal(
    fs.existsSync(path.join(projectRoot, "data/dreamina-benefit-metadata-fallback.json")),
    true,
    "fallback metadata file should be committed",
  );

  const result = runWithJiti(`
const fs = await import("node:fs");
const pathModule = await import("node:path");
const {
  buildBenefitPriceIndex,
  normalizeBenefitMetadataResponse,
} = await jiti.import(path.join(projectRoot, "server/clients/dreamina/benefit-metadata.ts"));

const raw = JSON.parse(fs.readFileSync(
  pathModule.join(projectRoot, "data/dreamina-benefit-metadata-fallback.json"),
  "utf8",
));
const entries = normalizeBenefitMetadataResponse(raw);
const index = buildBenefitPriceIndex(entries);
process.stdout.write(JSON.stringify({
  count: entries.length,
  gpt: index.image_basic_gpt_image_v2?.[0],
  video: index.seedance_20_fast_720p_output?.[0],
}));
process.exit(0);
`);

  assert.ok(result.count > 100, "fallback should include many benefit strategies");
  assert.equal(result.gpt.creditUnitPrice, 3);
  assert.equal(result.gpt.unit, "page");
  assert.equal(result.gpt.resourceId, "generate_img");
  assert.equal(result.video.creditUnitPrice, 35);
  assert.equal(result.video.unit, "second");
  assert.equal(result.video.resourceId, "generate_video");
});
