import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

test("upload headers do not use undefined as a filename", () => {
  for (const file of [
    "src/api/controllers/images.ts",
    "src/api/controllers/videos.ts",
  ]) {
    const source = fs.readFileSync(path.join(projectRoot, file), "utf8");
    assert.equal(
      source.includes('filename="undefined"'),
      false,
      `${file} still contains filename="undefined"`,
    );
  }
});
