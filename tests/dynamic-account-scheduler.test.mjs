import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

function runWithJiti(source, env = {}) {
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
    env: { ...process.env, NO_COLOR: "1", VERCEL: "1", ...env },
  });

  assert.equal(
    result.status,
    0,
    `child process failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );

  return JSON.parse(result.stdout);
}

function runWithTempDb(source) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "dynamic-account-scheduler-"));
  try {
    return runWithJiti(source, {
      DREAMINE_DB_PATH: path.join(tmpDir, "dreamine2api.db"),
    });
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

test("scheduler selects an enabled account with enough cached credit when cost is known", () => {
  const result = runWithTempDb(`
const { addAccount } = await jiti.import(
  path.join(projectRoot, "server/services/pool/accounts.ts"),
);
const { getDb } = await jiti.import(
  path.join(projectRoot, "server/repositories/sqlite/database.ts"),
);
const { pickAccountForCost } = await jiti.import(
  path.join(projectRoot, "server/services/pool/scheduler.ts"),
);

const lowId = addAccount("low-session", "low-credit");
const highId = addAccount("high-session", "high-credit");
getDb()
  .prepare("UPDATE pool_accounts SET last_total_credit = ? WHERE id = ?")
  .run(10, lowId);
getDb()
  .prepare("UPDATE pool_accounts SET last_total_credit = ? WHERE id = ?")
  .run(200, highId);

const picked = pickAccountForCost({
  kind: "image",
  operation: "generate",
  model: "seedream-5.0-lite",
  width: 2048,
  height: 2048,
});

process.stdout.write(JSON.stringify({ lowId, highId, pickedId: picked?.id }));
process.exit(0);
`);

  assert.equal(result.pickedId, result.highId);
});

test("scheduler skips unknown cached credit when a known account can cover the cost", () => {
  const result = runWithTempDb(`
const { addAccount } = await jiti.import(
  path.join(projectRoot, "server/services/pool/accounts.ts"),
);
const { getDb } = await jiti.import(
  path.join(projectRoot, "server/repositories/sqlite/database.ts"),
);
const { pickAccountForCost } = await jiti.import(
  path.join(projectRoot, "server/services/pool/scheduler.ts"),
);

const unknownId = addAccount("unknown-session", "unknown-credit");
const highId = addAccount("high-session", "high-credit");
getDb()
  .prepare("UPDATE pool_accounts SET last_total_credit = ? WHERE id = ?")
  .run(null, unknownId);
getDb()
  .prepare("UPDATE pool_accounts SET last_total_credit = ? WHERE id = ?")
  .run(200, highId);

Math.random = () => 0;
const picked = pickAccountForCost({
  kind: "image",
  operation: "generate",
  model: "seedream-5.0-lite",
  width: 2048,
  height: 2048,
});

process.stdout.write(JSON.stringify({ unknownId, highId, pickedId: picked?.id }));
process.exit(0);
`);

  assert.notEqual(result.pickedId, result.unknownId);
  assert.equal(result.pickedId, result.highId);
});

test("scheduler falls back to random enabled selection when cost cannot be estimated", () => {
  const result = runWithTempDb(`
const { addAccount } = await jiti.import(
  path.join(projectRoot, "server/services/pool/accounts.ts"),
);
const { getDb } = await jiti.import(
  path.join(projectRoot, "server/repositories/sqlite/database.ts"),
);
const { pickAccountForCost } = await jiti.import(
  path.join(projectRoot, "server/services/pool/scheduler.ts"),
);

const firstId = addAccount("first-session", "first");
const secondId = addAccount("second-session", "second");
getDb()
  .prepare("UPDATE pool_accounts SET last_total_credit = ? WHERE id = ?")
  .run(0, firstId);
getDb()
  .prepare("UPDATE pool_accounts SET last_total_credit = ? WHERE id = ?")
  .run(0, secondId);

const picked = pickAccountForCost({
  kind: "image",
  operation: "generate",
  model: "unknown-image-model",
  width: 2048,
  height: 2048,
});

process.stdout.write(JSON.stringify({ firstId, secondId, pickedId: picked?.id }));
process.exit(0);
`);

  assert.ok([result.firstId, result.secondId].includes(result.pickedId));
});

test("auth and session context pass credit cost context into pool account scheduling", () => {
  const auth = read("server/services/pool/auth.ts");
  const sessionContext = read("server/services/pool/session-context.ts");

  assert.ok(
    auth.includes('import type { CreditCostContext } from "~~/server/services/pool/credit-cost"'),
    "auth.ts should import CreditCostContext",
  );
  assert.ok(
    auth.includes('import { pickAccountForCost } from "~~/server/services/pool/scheduler"'),
    "auth.ts should import pickAccountForCost",
  );
  assert.match(
    auth,
    /resolveSessions\s*\(\s*authorization\?\s*:\s*string,\s*costContext\?\s*:\s*CreditCostContext\s*\)/,
    "resolveSessions should accept an optional CreditCostContext",
  );
  assert.ok(
    auth.includes("const acc = pickAccountForCost(costContext)"),
    "pool API key branch should pick an account using the cost context",
  );
  assert.match(
    auth,
    /pickOneSession\s*\(\s*authorization\?\s*:\s*string,\s*costContext\?\s*:\s*CreditCostContext\s*\)/,
    "pickOneSession should accept an optional CreditCostContext",
  );
  assert.ok(
    auth.includes("resolveSessions(authorization, costContext)"),
    "pickOneSession should pass cost context through to resolveSessions",
  );

  assert.ok(
    sessionContext.includes('import type { CreditCostContext } from "~~/server/services/pool/credit-cost"'),
    "session-context.ts should import CreditCostContext",
  );
  assert.match(
    sessionContext,
    /requireActiveSession\s*\(\s*authorization\?\s*:\s*string,\s*costContext\?\s*:\s*CreditCostContext\s*\)/,
    "requireActiveSession should accept an optional CreditCostContext",
  );
  assert.ok(
    sessionContext.includes("pickOneSession(authorization, costContext)"),
    "requireActiveSession should pass cost context through to pickOneSession",
  );
});
