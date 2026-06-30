import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

test("manual account import triggers non-fatal account snapshot refresh", () => {
  const route = read("server/api/admin/accounts.post.ts");

  assert.ok(
    route.includes("refreshAccountSnapshot"),
    "manual import route should call refreshAccountSnapshot after addAccount",
  );
  assert.ok(
    /const\s+id\s*=\s*addAccount\(/.test(route),
    "manual import should keep the inserted account id",
  );
  assert.ok(
    /await\s+refreshAccountSnapshot\(id\)/.test(route),
    "manual import should refresh credit and account type for the inserted account",
  );
});

test("email login import triggers non-fatal account snapshot refresh for added and updated accounts", () => {
  const route = read("server/api/admin/accounts/login.post.ts");

  assert.ok(
    route.includes("refreshAccountSnapshot"),
    "email login route should use refreshAccountSnapshot",
  );
  assert.ok(
    /await\s+refreshAccountSnapshot\(existing\.id\)/.test(route),
    "email login update path should refresh the existing account",
  );
  assert.ok(
    /const\s+id\s*=\s*addAccount\(/.test(route),
    "email login add path should keep the inserted account id",
  );
  assert.ok(
    /await\s+refreshAccountSnapshot\(id\)/.test(route),
    "email login add path should refresh the new account",
  );
});

test("account snapshot refresh treats credit and account type failures independently", () => {
  const accounts = read("server/services/pool/accounts.ts");
  const match = accounts.match(
    /export async function refreshAccountSnapshot\(id: number\) \{([\s\S]+?)\n\}/,
  );

  assert.ok(match, "refreshAccountSnapshot should exist");
  const body = match[1];
  assert.ok(body.includes("refreshAccountCredit(id)"), "snapshot refresh should refresh credit");
  assert.ok(body.includes("fetchAccountInfo(id)"), "snapshot refresh should fetch account info");
  assert.ok(body.includes("credit_error"), "snapshot refresh should return non-fatal credit_error");
  assert.ok(body.includes("info_error"), "snapshot refresh should return non-fatal info_error");
});
