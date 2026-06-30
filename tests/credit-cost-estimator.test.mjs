import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

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

test("estimates image generation costs by model and resolution", () => {
  const result = runWithJiti(`
const { estimateCreditCost } = await jiti.import(
  path.join(projectRoot, "server/services/pool/credit-cost.ts"),
);
const price = (benefitType, creditUnitPrice) => ({
  resourceType: "aigc",
  resourceId: "generate_img",
  benefitType,
  unit: "page",
  creditUnitPrice,
  originalCreditUnitPrice: creditUnitPrice,
  minChargeCount: 1,
  roles: [],
  name: benefitType,
});
const index = {
  image_basic_v5_2k: [price("image_basic_v5_2k", 15)],
  image_basic_v5_4k: [price("image_basic_v5_4k", 20)],
  image_basic_gpt_image_v2: [price("image_basic_gpt_image_v2", 3)],
};
process.stdout.write(JSON.stringify([
  estimateCreditCost({ kind: "image", operation: "generate", model: "seedream-5.0-lite", width: 2048, height: 2048 }, index),
  estimateCreditCost({ kind: "image", operation: "generate", model: "high_aes_general_v50", width: 4096, height: 4096 }, index),
  estimateCreditCost({ kind: "image", operation: "generate", model: "gpt-image-2", width: 2048, height: 2048 }, index),
]));
process.exit(0);
`);

  assert.deepEqual(result.map(({ credits, benefitType }) => ({ credits, benefitType })), [
    { credits: 15, benefitType: "image_basic_v5_2k" },
    { credits: 20, benefitType: "image_basic_v5_4k" },
    { credits: 3, benefitType: "image_basic_gpt_image_v2" },
  ]);
});

test("multiplies image page costs by requested output count", () => {
  const result = runWithJiti(`
const { estimateCreditCost } = await jiti.import(
  path.join(projectRoot, "server/services/pool/credit-cost.ts"),
);
const price = (benefitType, creditUnitPrice) => ({
  resourceType: "aigc",
  resourceId: "generate_img",
  benefitType,
  unit: "page",
  creditUnitPrice,
  originalCreditUnitPrice: creditUnitPrice,
  minChargeCount: 1,
  roles: [],
  name: benefitType,
});
const index = {
  image_basic_v5_2k: [price("image_basic_v5_2k", 15)],
};
const estimate = estimateCreditCost(
  { kind: "image", operation: "generate", model: "seedream-5.0-lite", width: 2048, height: 2048, outputCount: 4 },
  index,
);
process.stdout.write(JSON.stringify({ estimate }));
process.exit(0);
`);

  assert.deepEqual(
    {
      credits: result.estimate?.credits,
      quantity: result.estimate?.quantity,
      benefitType: result.estimate?.benefitType,
    },
    { credits: 60, quantity: 4, benefitType: "image_basic_v5_2k" },
  );
});

test("estimates image edit costs from image_blend without catalog model resolution", () => {
  const result = runWithJiti(`
const { estimateCreditCost } = await jiti.import(
  path.join(projectRoot, "server/services/pool/credit-cost.ts"),
);
const price = (benefitType, creditUnitPrice) => ({
  resourceType: "aigc",
  resourceId: "generate_img",
  benefitType,
  unit: "page",
  creditUnitPrice,
  originalCreditUnitPrice: creditUnitPrice,
  minChargeCount: 1,
  roles: [],
  name: benefitType,
});
const index = {
  image_blend: [price("image_blend", 5)],
};
const estimate = estimateCreditCost(
  { kind: "image", operation: "edit", model: "unknown-model", width: 2048, height: 2048 },
  index,
);
process.stdout.write(JSON.stringify({ estimate }));
process.exit(0);
`);

  assert.deepEqual(
    { credits: result.estimate?.credits, benefitType: result.estimate?.benefitType },
    { credits: 5, benefitType: "image_blend" },
  );
});

test("estimates video costs from second strategies and adapted duration", () => {
  const result = runWithJiti(`
const { estimateCreditCost } = await jiti.import(
  path.join(projectRoot, "server/services/pool/credit-cost.ts"),
);
const price = (benefitType, creditUnitPrice) => ({
  resourceType: "aigc",
  resourceId: "generate_video",
  benefitType,
  unit: "second",
  creditUnitPrice,
  originalCreditUnitPrice: creditUnitPrice,
  minChargeCount: 1,
  roles: [],
  name: benefitType,
});
const index = {
  seedance_20_fast_720p_output: [price("seedance_20_fast_720p_output", 35)],
  seedance_20_pro_4k_output: [price("seedance_20_pro_4k_output", 224)],
};
process.stdout.write(JSON.stringify([
  estimateCreditCost({ kind: "video", model: "seedance-2.0-fast", width: 1024, height: 1024, resolution: "720p", durationSec: 5, filePaths: [] }, index),
  estimateCreditCost({ kind: "video", model: "dreamina_seedance_40_pro", width: 1024, height: 1024, resolution: "4k", durationSec: 4, filePaths: [] }, index),
]));
process.exit(0);
`);

  assert.deepEqual(result.map(({ credits, benefitType }) => ({ credits, benefitType })), [
    { credits: 175, benefitType: "seedance_20_fast_720p_output" },
    { credits: 896, benefitType: "seedance_20_pro_4k_output" },
  ]);
});

test("estimates seedance fast video costs from adapted resolution", () => {
  const result = runWithJiti(`
const { estimateCreditCost } = await jiti.import(
  path.join(projectRoot, "server/services/pool/credit-cost.ts"),
);
const price = (benefitType, creditUnitPrice) => ({
  resourceType: "aigc",
  resourceId: "generate_video",
  benefitType,
  unit: "second",
  creditUnitPrice,
  originalCreditUnitPrice: creditUnitPrice,
  minChargeCount: 1,
  roles: [],
  name: benefitType,
});
const index = {
  seedance_20_fast_720p_output: [price("seedance_20_fast_720p_output", 35)],
  seedance_20_fast_1080p_output: [price("seedance_20_fast_1080p_output", 78)],
};
const estimate = estimateCreditCost(
  { kind: "video", model: "seedance-2.0-fast", width: 1024, height: 1024, resolution: "1080p", durationSec: 5, filePaths: [] },
  index,
);
process.stdout.write(JSON.stringify({ estimate }));
process.exit(0);
`);

  assert.deepEqual(
    { credits: result.estimate?.credits, benefitType: result.estimate?.benefitType },
    { credits: 175, benefitType: "seedance_20_fast_720p_output" },
  );
});

test("estimates vgfm 3.5 pro 1080p video costs from base and add-on benefits", () => {
  const result = runWithJiti(`
const { estimateCreditCost } = await jiti.import(
  path.join(projectRoot, "server/services/pool/credit-cost.ts"),
);
const price = (benefitType, creditUnitPrice) => ({
  resourceType: "aigc",
  resourceId: "generate_video",
  benefitType,
  unit: "second",
  creditUnitPrice,
  originalCreditUnitPrice: creditUnitPrice,
  minChargeCount: 1,
  roles: [],
  name: benefitType,
});
const index = {
  basic_video_operation_vgfm_v_three: [price("basic_video_operation_vgfm_v_three", 12)],
  basic_video_operation_vgfm_v_three_1080_add: [price("basic_video_operation_vgfm_v_three_1080_add", 7)],
};
const estimate = estimateCreditCost(
  { kind: "video", model: "seedance-1.5-pro", width: 1024, height: 1024, resolution: "1080p", durationSec: 5, filePaths: [] },
  index,
);
process.stdout.write(JSON.stringify({ estimate }));
process.exit(0);
`);

  assert.equal(result.estimate?.credits, 95);
  assert.ok(result.estimate?.benefitType.includes("basic_video_operation_vgfm_v_three"));
  assert.ok(result.estimate?.benefitType.includes("basic_video_operation_vgfm_v_three_1080_add"));
});

test("exports the same video benefit resolver used for cost and request payloads", () => {
  const result = runWithJiti(`
const { estimateCreditCost, resolveVideoBenefitTypes } = await jiti.import(
  path.join(projectRoot, "server/services/pool/credit-cost.ts"),
);
const price = (benefitType, creditUnitPrice) => ({
  resourceType: "aigc",
  resourceId: "generate_video",
  benefitType,
  unit: "second",
  creditUnitPrice,
  originalCreditUnitPrice: creditUnitPrice,
  minChargeCount: 1,
  roles: [],
  name: benefitType,
});
const context = { kind: "video", model: "seedance-2.0-fast", width: 1024, height: 1024, resolution: "720p", durationSec: 5, filePaths: [] };
const benefitTypes = resolveVideoBenefitTypes(context);
const index = {
  [benefitTypes[0]]: [price(benefitTypes[0], 35)],
};
const estimate = estimateCreditCost(context, index);
process.stdout.write(JSON.stringify({ benefitTypes, estimate }));
process.exit(0);
`);

  assert.deepEqual(result.benefitTypes, ["seedance_20_fast_720p_output"]);
  assert.equal(result.estimate?.benefitType, result.benefitTypes.join("+"));
});

test("falls back to 720p video benefit mapping when requested resolution is unmapped", () => {
  const result = runWithJiti(`
const { estimateCreditCost } = await jiti.import(
  path.join(projectRoot, "server/services/pool/credit-cost.ts"),
);
const price = (benefitType, creditUnitPrice) => ({
  resourceType: "aigc",
  resourceId: "generate_video",
  benefitType,
  unit: "second",
  creditUnitPrice,
  originalCreditUnitPrice: creditUnitPrice,
  minChargeCount: 1,
  roles: [],
  name: benefitType,
});
const index = {
  seedance_20_mini_720p_output: [price("seedance_20_mini_720p_output", 31)],
};
const estimate = estimateCreditCost(
  { kind: "video", model: "dreamina_seedance_40_mini", width: 1024, height: 1024, resolution: "480p", durationSec: 4, filePaths: [] },
  index,
);
process.stdout.write(JSON.stringify({ estimate }));
process.exit(0);
`);

  assert.deepEqual(
    { credits: result.estimate?.credits, benefitType: result.estimate?.benefitType },
    { credits: 124, benefitType: "seedance_20_mini_720p_output" },
  );
});

test("unknown benefit mapping returns null", () => {
  const result = runWithJiti(`
const { estimateCreditCost } = await jiti.import(
  path.join(projectRoot, "server/services/pool/credit-cost.ts"),
);
const estimate = estimateCreditCost(
  { kind: "image", operation: "generate", model: "unknown-model", width: 2048, height: 2048 },
  {},
);
process.stdout.write(JSON.stringify({ estimate }));
process.exit(0);
`);

  assert.equal(result.estimate, null);
});
