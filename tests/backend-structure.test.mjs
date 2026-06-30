import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

function exists(relativePath) {
  return fs.existsSync(path.join(projectRoot, relativePath));
}

function walk(dir) {
  const absolute = path.join(projectRoot, dir);
  if (!fs.existsSync(absolute)) return [];
  return fs.readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(relative);
    return [relative.replaceAll(path.sep, "/")];
  });
}

test("backend uses Nuxt/Nitro layers instead of legacy Koa dispatch", () => {
  for (const dir of [
    "server/config",
    "server/services",
    "server/repositories",
    "server/clients/dreamina",
    "server/utils/http",
  ]) {
    assert.equal(exists(dir), true, `${dir} should exist`);
  }

  for (const file of [
    "src/index.ts",
    "src/lib/server.ts",
    "src/lib/request/Request.ts",
    "src/lib/response/Response.ts",
    "server/middleware/legacy-api.ts",
    "server/utils/legacy-dispatch.ts",
    "src/api/routes/chat.ts",
    "src/api/controllers/chat.ts",
  ]) {
    assert.equal(exists(file), false, `${file} should be removed`);
  }
});

test("server code no longer imports legacy aliases or chat compatibility modules", () => {
  const files = [...walk("server"), ...walk("src")].filter((file) => /\.(ts|vue|js|mjs)$/.test(file));
  const offenders = [];

  for (const file of files) {
    const source = fs.readFileSync(path.join(projectRoot, file), "utf8");
    if (source.includes("@legacy") || source.includes("/chat") || source.includes("chat.ts")) {
      offenders.push(file);
    }
  }

  assert.deepEqual(offenders, []);
});
