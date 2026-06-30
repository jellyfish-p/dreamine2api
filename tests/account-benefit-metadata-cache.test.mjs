import assert from "node:assert/strict";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
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

test("account schema includes cached benefit metadata columns and migrations", () => {
  const schema = read("server/repositories/sqlite/schema.ts");

  assert.ok(schema.includes("last_benefit_metadata TEXT"), "pool_accounts should store benefit metadata JSON");
  assert.ok(schema.includes("last_benefit_metadata_at INTEGER"), "pool_accounts should store benefit metadata timestamp");
  assert.ok(
    schema.includes('{ column: "last_benefit_metadata", ddl: "TEXT" }'),
    "migration should add last_benefit_metadata to existing databases",
  );
  assert.ok(
    schema.includes('{ column: "last_benefit_metadata_at", ddl: "INTEGER" }'),
    "migration should add last_benefit_metadata_at to existing databases",
  );
  assert.ok(
    schema.includes("last_benefit_metadata: string | null"),
    "PoolAccountRow should type cached benefit metadata",
  );
  assert.ok(
    schema.includes("last_benefit_metadata_at: number | null"),
    "PoolAccountRow should type benefit metadata timestamp",
  );
});

test("account refresh persists benefit metadata and surfaces snapshot errors", () => {
  const accounts = read("server/services/pool/accounts.ts");

  assert.ok(
    accounts.includes("getCommerceBenefitMetadata"),
    "accounts service should call the Commerce benefit metadata endpoint",
  );
  assert.ok(
    accounts.includes("export async function refreshAccountBenefitMetadata(id: number)"),
    "accounts service should export refreshAccountBenefitMetadata",
  );
  assert.ok(
    accounts.includes("last_benefit_metadata = ?"),
    "refreshAccountBenefitMetadata should persist cached metadata JSON",
  );
  assert.ok(
    accounts.includes("last_benefit_metadata_at = ?"),
    "refreshAccountBenefitMetadata should persist metadata fetch timestamp",
  );
  assert.ok(
    accounts.includes("benefit_metadata_error"),
    "refreshAccountSnapshot should report benefit metadata refresh failures",
  );
});

test("startup config warms the benefit price index cache", () => {
  const config = read("server/plugins/00-config.ts");

  assert.ok(
    config.includes("getStartupBenefitPriceIndex"),
    "startup config should import the benefit metadata cache warmer",
  );
  assert.ok(
    config.includes("getStartupBenefitPriceIndex();"),
    "startup config should warm the cache after database initialization",
  );
});

test("startup benefit metadata cache loads fallback price index", () => {
  const result = runWithJiti(`
const { getStartupBenefitPriceIndex } = await jiti.import(
  path.join(projectRoot, "server/services/pool/benefit-metadata-cache.ts"),
);
const index = getStartupBenefitPriceIndex();
process.stdout.write(JSON.stringify({
  gpt: index.image_basic_gpt_image_v2?.[0],
  video: index.seedance_20_fast_720p_output?.[0],
}));
process.exit(0);
`);

  assert.equal(result.gpt.creditUnitPrice, 3);
  assert.equal(result.video.creditUnitPrice, 35);
});

test("startup fallback metadata parsing is guarded as non-fatal", () => {
  const source = read("server/services/pool/benefit-metadata-cache.ts");
  const start = source.indexOf("export function getStartupBenefitPriceIndex()");
  assert.ok(start >= 0, "cache should export getStartupBenefitPriceIndex");
  const functionBody = source.slice(start, source.indexOf("\nexport function", start + 1));

  assert.ok(
    source.includes('dreamina-benefit-metadata-fallback.raw'),
    "fallback metadata should be bundled as raw text",
  );
  assert.ok(
    !source.includes('import fallbackBenefitMetadata from "~~/data/dreamina-benefit-metadata-fallback.json"'),
    "fallback metadata should not be statically parsed before the guarded path",
  );

  assert.ok(
    functionBody.includes("try"),
    "startup fallback parsing should be guarded",
  );
  assert.ok(
    functionBody.includes("catch"),
    "startup fallback parsing failures should not abort startup",
  );
  assert.ok(
    functionBody.includes("return {}"),
    "startup fallback parsing failures should preserve random scheduler fallback",
  );
});

test("malformed raw startup fallback metadata returns an empty price index", () => {
  const result = runWithJiti(`
const { parseFallbackBenefitMetadataRaw } = await jiti.import(
  path.join(projectRoot, "server/services/pool/benefit-metadata-cache.ts"),
);
const index = parseFallbackBenefitMetadataRaw("{not-json");
process.stdout.write(JSON.stringify({
  parserType: typeof parseFallbackBenefitMetadataRaw,
  keys: Object.keys(index),
}));
process.exit(0);
`);

  assert.equal(result.parserType, "function");
  assert.deepEqual(result.keys, []);
});

test("startup benefit metadata cache does not depend on runtime cwd data folder", () => {
  const result = runWithJiti(`
const { mkdtempSync, rmSync, symlinkSync } = await import("node:fs");
const { tmpdir } = await import("node:os");
const emptyCwd = mkdtempSync(path.join(tmpdir(), "benefit-metadata-cwd-"));
try {
  symlinkSync(
    path.join(projectRoot, "node_modules"),
    path.join(emptyCwd, "node_modules"),
    process.platform === "win32" ? "junction" : "dir",
  );
  process.chdir(emptyCwd);
  const { getStartupBenefitPriceIndex } = await jiti.import(
    path.join(projectRoot, "server/services/pool/benefit-metadata-cache.ts"),
  );
  const index = getStartupBenefitPriceIndex();
  process.stdout.write(JSON.stringify({
    gpt: index.image_basic_gpt_image_v2?.[0],
    video: index.seedance_20_fast_720p_output?.[0],
  }));
} finally {
  process.chdir(projectRoot);
  rmSync(emptyCwd, { recursive: true, force: true });
}
process.exit(0);
`);

  assert.equal(result.gpt.creditUnitPrice, 3);
  assert.equal(result.video.creditUnitPrice, 35);
});

test("benefit metadata cache exports parser for committed fallback raw JSON", () => {
  const result = runWithJiti(`
const cacheModule = await jiti.import(
  path.join(projectRoot, "server/services/pool/benefit-metadata-cache.ts"),
);
const { readFileSync } = await import("node:fs");
const raw = readFileSync(
  path.join(projectRoot, "data/dreamina-benefit-metadata-fallback.json"),
  "utf8",
);
const parserType = typeof cacheModule.parseBenefitMetadataToIndex;
const index =
  parserType === "function" ? cacheModule.parseBenefitMetadataToIndex(raw) : null;
process.stdout.write(JSON.stringify({
  parserType,
  gpt: index?.image_basic_gpt_image_v2?.[0],
}));
process.exit(0);
`);

  assert.equal(result.parserType, "function");
  assert.equal(result.gpt.creditUnitPrice, 3);
});

test("stale account benefit metadata falls back to startup price index", () => {
  const result = runWithJiti(`
const { getBenefitPriceIndexForAccount } = await jiti.import(
  path.join(projectRoot, "server/services/pool/benefit-metadata-cache.ts"),
);
const rawAccountMetadata = JSON.stringify({
  ret: "0",
  response: JSON.stringify({
    metadata_list: [{
      resource_type: "aigc",
      resource_id: "generate_img",
      benefits_pay_strategy: [{
        benefit_type: "image_basic_gpt_image_v2",
        credit_strategy: {
          credit_pricing_info: {
            unit: "page",
            credit_unit_price: 99,
            original_credit_unit_price: 99,
            min_charge_count: 1,
          },
        },
        role_strategy: { roles: ["all"] },
      }],
    }],
  }),
});
const freshIndex = getBenefitPriceIndexForAccount({
  last_benefit_metadata: rawAccountMetadata,
  last_benefit_metadata_at: Math.floor(Date.now() / 1000),
});
const staleIndex = getBenefitPriceIndexForAccount({
  last_benefit_metadata: rawAccountMetadata,
  last_benefit_metadata_at: 1,
});
process.stdout.write(JSON.stringify({
  freshPrice: freshIndex.image_basic_gpt_image_v2?.[0]?.creditUnitPrice,
  stalePrice: staleIndex.image_basic_gpt_image_v2?.[0]?.creditUnitPrice,
}));
process.exit(0);
`);

  assert.equal(result.freshPrice, 99);
  assert.equal(result.stalePrice, 3);
});
