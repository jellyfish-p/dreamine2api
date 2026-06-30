import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

function serviceFunction(source, name) {
  const start = source.indexOf(`export async function ${name}(`);
  assert.ok(start >= 0, `${name} should be exported`);

  const nextExport = source.indexOf("\nexport ", start + 1);
  return nextExport >= 0 ? source.slice(start, nextExport) : source.slice(start);
}

function assertBefore(source, before, after, message) {
  const beforeIndex = source.indexOf(before);
  const afterIndex = source.indexOf(after);

  assert.ok(beforeIndex >= 0, `missing expected source: ${before}`);
  assert.ok(afterIndex >= 0, `missing expected source: ${after}`);
  assert.ok(beforeIndex < afterIndex, message);
}

test("image service passes normalized generation and edit cost contexts into session selection", () => {
  const source = read("server/services/images.ts");

  assert.ok(
    source.includes('import type { CreditCostContext } from "~~/server/services/pool/credit-cost"'),
    "image service should import CreditCostContext",
  );
  assert.match(
    source,
    /function imageCostContext\(\s*request:\s*ReturnType<typeof normalizeImageBody>,\s*size:\s*\{\s*width:\s*number;\s*height:\s*number\s*\},\s*operation:\s*"generate"\s*\|\s*"edit",?\s*\):\s*CreditCostContext/,
    "image service should define a typed image cost context helper",
  );
  assert.ok(source.includes('kind: "image"'), "image cost context should identify image requests");
  assert.ok(source.includes("operation,"), "image cost context should include the operation");
  assert.ok(source.includes("outputCount: operation === \"generate\" ? 4 : 1"), "image generation cost context should match Dreamina's four-image output count");

  const generation = serviceFunction(source, "createImageGeneration");
  assert.ok(
    generation.includes('const costContext = imageCostContext(request, size, "generate");'),
    "image generation should build a generate cost context",
  );
  assert.ok(
    generation.includes("const session = requireActiveSession(authorization, costContext);"),
    "image generation should pass cost context into session selection",
  );
  assertBefore(
    generation,
    "const request = normalizeImageBody(body);",
    "const session = requireActiveSession(authorization, costContext);",
    "image generation should normalize the request before selecting a session",
  );
  assertBefore(
    generation,
    "const size = resolveImageSize(request.ratio);",
    "const session = requireActiveSession(authorization, costContext);",
    "image generation should resolve validated dimensions before selecting a session",
  );

  const edit = serviceFunction(source, "createImageEdit");
  assert.ok(
    edit.includes('const costContext = imageCostContext(request, size, "edit");'),
    "image edit should build an edit cost context",
  );
  assert.ok(
    edit.includes("const session = requireActiveSession(authorization, costContext);"),
    "image edit should pass cost context into session selection",
  );
  assertBefore(
    edit,
    "const request = normalizeImageBody(body);",
    "const session = requireActiveSession(authorization, costContext);",
    "image edit should normalize the request before selecting a session",
  );
  assertBefore(
    edit,
    "const size = resolveImageSize(request.ratio);",
    "const session = requireActiveSession(authorization, costContext);",
    "image edit should resolve validated dimensions before selecting a session",
  );
});

test("video service passes normalized video cost context into session selection", () => {
  const source = read("server/services/videos.ts");

  assert.ok(
    source.includes('import type { CreditCostContext } from "~~/server/services/pool/credit-cost"'),
    "video service should import CreditCostContext",
  );
  assert.match(
    source,
    /function videoCostContext\(\s*request:\s*ReturnType<typeof normalizeVideoBody>\s*\):\s*CreditCostContext/,
    "video service should define a typed video cost context helper",
  );
  assert.ok(source.includes('kind: "video"'), "video cost context should identify video requests");
  assert.ok(
    source.includes("filePaths: request.filePaths"),
    "video cost context should include normalized file paths",
  );

  const generation = serviceFunction(source, "createVideoGeneration");
  assert.ok(
    generation.includes("const costContext = videoCostContext(request);"),
    "video generation should build a video cost context",
  );
  assert.ok(
    generation.includes("const session = requireActiveSession(authorization, costContext);"),
    "video generation should pass cost context into session selection",
  );
  assertBefore(
    generation,
    "const request = normalizeVideoBody(body);",
    "const session = requireActiveSession(authorization, costContext);",
    "video generation should normalize the request before selecting a session",
  );
});

test("dreamina video client builds commerce benefit payloads from the cost resolver", () => {
  const source = read("server/clients/dreamina/videos.ts");

  assert.ok(
    source.includes('resolveVideoBenefitTypes'),
    "video client should import the shared video benefit resolver",
  );
  assert.ok(
    source.includes("const videoBenefitTypes = resolveVideoBenefitTypes"),
    "video client should resolve benefit types for the adapted request",
  );
  assert.ok(
    source.includes("m_video_commerce_info_list"),
    "video client should send commerce benefit info list",
  );
  assert.ok(
    source.includes("videoBenefitTypes.map"),
    "video client should build commerce benefit info list from all resolved benefit types",
  );
  assert.ok(
    !source.includes('benefit_type: "basic_video_operation_vgfm_v_three"'),
    "video client should not hardcode a single VGFM benefit for every video model",
  );
});
