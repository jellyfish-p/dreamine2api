import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

test("session context exposes non-fatal account credit refresh helper", () => {
  const source = read("server/services/pool/session-context.ts");

  assert.ok(
    source.includes("refreshAccountCredit"),
    "session context should use refreshAccountCredit for pool accounts",
  );
  assert.ok(
    source.includes("export async function refreshActiveSessionCredit"),
    "session context should export refreshActiveSessionCredit",
  );
  assert.ok(
    source.includes("if (!session.fromPool || !session.accountId) return"),
    "direct bearer sessions should not attempt account cache refresh",
  );
  assert.ok(
    source.includes("logger.warn"),
    "credit refresh failures should be logged without failing successful calls",
  );
});

test("successful image generation and edit refresh selected pool account credit", () => {
  const source = read("server/services/images.ts");

  assert.ok(
    source.includes("refreshActiveSessionCredit"),
    "image service should import the post-success refresh helper",
  );

  const generationIndex = source.indexOf("const urls = await generateImages(");
  const editIndex = source.indexOf("const urls = await generateImageComposition(");
  const refreshIndexes = [...source.matchAll(/await refreshActiveSessionCredit\(session\)/g)].map(
    (match) => match.index ?? -1,
  );

  assert.ok(generationIndex >= 0, "image generation should call generateImages");
  assert.ok(editIndex >= 0, "image edit should call generateImageComposition");
  assert.ok(
    refreshIndexes.some((index) => index > generationIndex && index < source.indexOf("return formatImageResult", generationIndex)),
    "image generation should refresh credit after generateImages succeeds and before returning",
  );
  assert.ok(
    refreshIndexes.some((index) => index > editIndex && index < source.indexOf("return formatImageResult", editIndex)),
    "image edit should refresh credit after generateImageComposition succeeds and before returning",
  );
});

test("successful sync and async video generation refresh selected pool account credit", () => {
  const source = read("server/services/videos.ts");

  assert.ok(
    source.includes("refreshActiveSessionCredit"),
    "video service should import the post-success refresh helper",
  );
  assert.ok(
    source.includes(".then(async (url) =>"),
    "async video job should refresh credit inside the successful background completion path",
  );
  assert.ok(
    source.includes("await refreshActiveSessionCredit(session);"),
    "sync video generation should refresh credit after runVideoGeneration succeeds",
  );

  const runIndex = source.indexOf("const videoUrl = await runVideoGeneration(session, request);");
  const refreshIndex = source.indexOf("await refreshActiveSessionCredit(session);", runIndex);
  assert.ok(runIndex >= 0, "sync video path should await runVideoGeneration");
  assert.ok(refreshIndex > runIndex, "sync video path should refresh after video generation succeeds");
});
