import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(absolutePath);
    return absolutePath.endsWith(".ts") ? [absolutePath] : [];
  });
}

test("server ESM code imports lodash through its CommonJS-safe default export", () => {
  const offenders = walk(path.join(projectRoot, "server"))
    .map((absolutePath) => {
      const source = fs.readFileSync(absolutePath, "utf8");
      return {
        relativePath: path.relative(projectRoot, absolutePath),
        matches: source.match(/import\s*\{[^}]+\}\s*from\s*["']lodash["']/g) || [],
      };
    })
    .filter(({ matches }) => matches.length > 0);

  assert.deepEqual(offenders, []);
});
