# Dynamic Account Credit Scheduler Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Select pool accounts using model-specific estimated credit cost, with per-account dynamic metadata, startup fallback metadata, and random-selection fallback.

**Architecture:** Add a Commerce benefit metadata client/parser, a startup fallback metadata cache, a pure cost estimator, and a scheduler wrapper around existing pool account selection. Image and video services will normalize requests first, build a cost context, then call `requireActiveSession(authorization, costContext)`.

**Tech Stack:** Nuxt 4/Nitro server, TypeScript, SQLite via `better-sqlite3`, axios, Node test runner, existing Jiti-based runtime tests.

---

## File Structure

- Create `data/dreamina-benefit-metadata-fallback.json`: committed copy of the captured `benefit_metadata` response.
- Create `server/clients/dreamina/benefit-metadata.ts`: Commerce request builder, response parser, normalized price index builder, and best-effort network fetch.
- Create `server/services/pool/benefit-metadata-cache.ts`: startup fallback cache loader and per-account stored metadata parsing.
- Create `server/services/pool/credit-cost.ts`: pure request cost context types, model-to-benefit mapping, and credit estimate function.
- Create `server/services/pool/scheduler.ts`: eligible-account filtering and random fallback selection.
- Modify `server/repositories/sqlite/schema.ts`: add account metadata cache columns.
- Modify `server/services/pool/accounts.ts`: expose enabled-account listing and refresh/store per-account benefit metadata.
- Modify `server/services/pool/auth.ts`: accept optional cost context for pool API key requests.
- Modify `server/services/pool/session-context.ts`: pass optional cost context through active-session resolution.
- Modify `server/services/images.ts`: normalize request before session selection and pass image cost context.
- Modify `server/services/videos.ts`: normalize request before session selection and pass video cost context.
- Modify `server/plugins/00-config.ts`: warm the startup fallback cache during Nitro initialization.

## Task 1: Benefit Metadata Parser And Fallback File

**Files:**
- Create: `data/dreamina-benefit-metadata-fallback.json`
- Create: `server/clients/dreamina/benefit-metadata.ts`
- Test: `tests/benefit-metadata-parser.test.mjs`

- [ ] **Step 1: Write the failing parser/request test**

Create `tests/benefit-metadata-parser.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
node --test tests/benefit-metadata-parser.test.mjs
```

Expected: FAIL because `server/clients/dreamina/benefit-metadata.ts` and `data/dreamina-benefit-metadata-fallback.json` do not exist.

- [ ] **Step 3: Add the fallback data file**

Copy the attached captured response exactly:

```powershell
Copy-Item -LiteralPath 'C:\Users\36026\.codex\attachments\c57712ab-893f-43c0-9efa-53fee580a7b3\pasted-text.txt' -Destination 'data\dreamina-benefit-metadata-fallback.json'
```

- [ ] **Step 4: Implement the parser and request builder**

Create `server/clients/dreamina/benefit-metadata.ts`:

```ts
import axios from "axios";
import type { AxiosRequestConfig } from "axios";

import { APP_SDK_VERSION, DEFAULT_ASSISTANT_ID, PLATFORM_CODE, VERSION_CODE, WEB_VERSION } from "~~/server/clients/dreamina/consts/common";
import { acquireToken, generateCookie, type RequestProxyOptions } from "~~/server/clients/dreamina/core";
import { withProxyConfig } from "~~/server/clients/proxy/agents";
import { resolveCreditProxy } from "~~/server/services/pool/settings";
import logger from "~~/server/utils/logger";
import util from "~~/server/utils/util";

const COMMERCE_BENEFIT_METADATA_BASE_URL = "https://commerce-api-sg.capcut.com";
const COMMERCE_BENEFIT_METADATA_URI = "/commerce/v3/resource/benefit_metadata";
const BENEFIT_METADATA_DA_VERSION = "3.3.20";
const DEFAULT_COMMERCE_DEVICE_ID = `765${util.generateRandomString({ length: 16, charset: "numeric" })}`;

export type BenefitPriceEntry = {
  resourceType: string;
  resourceId: string;
  benefitType: string;
  benefitId?: number;
  unit: string;
  creditUnitPrice: number;
  originalCreditUnitPrice: number;
  minChargeCount: number;
  roles: string[];
  name: string;
};

export type BenefitPriceIndex = Record<string, BenefitPriceEntry[]>;

export type CommerceBenefitMetadataRequestOptions = {
  deviceTime?: number;
  deviceId?: string;
};

export type CommerceBenefitMetadataRequest = {
  method: "POST";
  url: string;
  headers: Record<string, string>;
  data: {
    query_list: Array<{
      resource_type: "aigc" | "normal_func";
      resource_id: "get_all";
      benefit_type_list: string[];
    }>;
  };
};

export async function buildCommerceBenefitMetadataRequest(
  refreshToken: string,
  options: CommerceBenefitMetadataRequestOptions = {},
): Promise<CommerceBenefitMetadataRequest> {
  const token = await acquireToken(refreshToken);
  const deviceTime = options.deviceTime ?? util.unixTimestamp();
  const deviceId = options.deviceId ?? DEFAULT_COMMERCE_DEVICE_ID;
  const sign = util.md5(
    `9e2c|${COMMERCE_BENEFIT_METADATA_URI.slice(-7)}|${PLATFORM_CODE}|${VERSION_CODE}|${deviceTime}||11ac`,
  );
  const url = new URL(`${COMMERCE_BENEFIT_METADATA_BASE_URL}${COMMERCE_BENEFIT_METADATA_URI}`);
  url.searchParams.set("aid", DEFAULT_ASSISTANT_ID);
  url.searchParams.set("web_version", WEB_VERSION);
  url.searchParams.set("da_version", BENEFIT_METADATA_DA_VERSION);
  url.searchParams.set("aigc_features", "app_lip_sync");

  return {
    method: "POST",
    url: url.toString(),
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "app-sdk-version": APP_SDK_VERSION,
      appid: DEFAULT_ASSISTANT_ID,
      appvr: VERSION_CODE,
      "content-type": "application/json",
      "device-time": String(deviceTime),
      did: deviceId,
      lan: "en",
      loc: "VN",
      pf: PLATFORM_CODE,
      referer: "https://dreamina.capcut.com/",
      "sec-ch-ua": '"Not;A=Brand";v="8", "Chromium";v="150", "Microsoft Edge";v="150"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      sign,
      "sign-ver": "1",
      "store-country-code": "vn",
      "store-country-code-src": "uid",
      tdid: "",
      cookie: generateCookie(token),
    },
    data: {
      query_list: [
        { resource_type: "aigc", resource_id: "get_all", benefit_type_list: [] },
        { resource_type: "normal_func", resource_id: "get_all", benefit_type_list: [] },
      ],
    },
  };
}

function getBenefitMetadataPayload(body: any): Record<string, any> {
  if (body?.data && typeof body.data === "object") return body.data;
  if (body?.metadata_list && Array.isArray(body.metadata_list)) return body;
  if (typeof body?.response === "string") {
    const parsed = util.ignoreJSONParse(body.response);
    if (parsed && typeof parsed === "object") return parsed as Record<string, any>;
  }
  return {};
}

export function normalizeBenefitMetadataResponse(body: any): BenefitPriceEntry[] {
  const ok =
    body?.ret === "0" ||
    body?.ret === 0 ||
    body?.code === "0" ||
    body?.code === 0 ||
    body?.err_no === 0 ||
    Array.isArray(body?.metadata_list);
  if (!ok) {
    throw new Error(`权益元数据查询失败: ${body?.errmsg || body?.message || body?.ret || body?.code || "未知错误"}`);
  }

  const payload = getBenefitMetadataPayload(body);
  const metadataList = Array.isArray(payload.metadata_list) ? payload.metadata_list : [];
  const entries: BenefitPriceEntry[] = [];

  for (const resource of metadataList) {
    const strategies = Array.isArray(resource?.benefits_pay_strategy) ? resource.benefits_pay_strategy : [];
    for (const strategy of strategies) {
      const pricing = strategy?.credit_strategy?.credit_pricing_info;
      const creditUnitPrice = Number(pricing?.credit_unit_price);
      if (!Number.isFinite(creditUnitPrice)) continue;

      entries.push({
        resourceType: String(resource.resource_type || ""),
        resourceId: String(resource.resource_id || ""),
        benefitType: String(strategy.benefit_type || ""),
        benefitId: Number.isFinite(Number(strategy.benefit_id)) ? Number(strategy.benefit_id) : undefined,
        unit: String(strategy.unit || "count"),
        creditUnitPrice,
        originalCreditUnitPrice: Number(pricing?.original_credit_unit_price ?? creditUnitPrice),
        minChargeCount: Number(pricing?.min_charge_cnt ?? 1),
        roles: (strategy.credit_strategy?.credit_limits || [])
          .map((limit: any) => String(limit?.role || ""))
          .filter(Boolean),
        name: String(strategy.name || ""),
      });
    }
  }

  return entries.filter((entry) => entry.benefitType);
}

export function buildBenefitPriceIndex(entries: BenefitPriceEntry[]): BenefitPriceIndex {
  return entries.reduce<BenefitPriceIndex>((index, entry) => {
    index[entry.benefitType] ||= [];
    index[entry.benefitType]!.push(entry);
    return index;
  }, {});
}

export async function getCommerceBenefitMetadata(
  refreshToken: string,
  proxyOpts: RequestProxyOptions = {},
) {
  const request = await buildCommerceBenefitMetadataRequest(refreshToken);
  const axiosConfig: AxiosRequestConfig = {
    ...request,
    timeout: 30000,
    validateStatus: () => true,
  };

  logger.info(`发送权益元数据请求: POST ${request.url}`);
  const response = await axios.request(withProxyConfig(axiosConfig, resolveCreditProxy(proxyOpts.proxyUrl)));
  if (response.status >= 400) throw new Error(`HTTP错误: ${response.status}`);
  normalizeBenefitMetadataResponse(response.data);
  return getBenefitMetadataPayload(response.data);
}
```

- [ ] **Step 5: Run parser test and verify GREEN**

Run:

```bash
node --test tests/benefit-metadata-parser.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add data/dreamina-benefit-metadata-fallback.json server/clients/dreamina/benefit-metadata.ts tests/benefit-metadata-parser.test.mjs
git commit -m "feat: parse commerce benefit metadata"
```

## Task 2: Startup Cache And Per-Account Metadata Persistence

**Files:**
- Modify: `server/repositories/sqlite/schema.ts`
- Modify: `server/services/pool/accounts.ts`
- Modify: `server/plugins/00-config.ts`
- Create: `server/services/pool/benefit-metadata-cache.ts`
- Test: `tests/account-benefit-metadata-cache.test.mjs`

- [ ] **Step 1: Write the failing cache/persistence test**

Create `tests/account-benefit-metadata-cache.test.mjs`:

```js
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

test("account schema includes benefit metadata cache columns", () => {
  const schema = read("server/repositories/sqlite/schema.ts");
  assert.ok(schema.includes("last_benefit_metadata TEXT"), "schema should store last metadata JSON");
  assert.ok(schema.includes("last_benefit_metadata_at INTEGER"), "schema should store metadata refresh time");
  assert.ok(schema.includes('{ column: "last_benefit_metadata", ddl: "TEXT" }'));
  assert.ok(schema.includes('{ column: "last_benefit_metadata_at", ddl: "INTEGER" }'));
});

test("accounts refresh stores per-account benefit metadata non-fatally in snapshots", () => {
  const accounts = read("server/services/pool/accounts.ts");
  assert.ok(accounts.includes("refreshAccountBenefitMetadata"), "accounts should export benefit metadata refresh");
  assert.ok(accounts.includes("getCommerceBenefitMetadata"), "refresh should call Commerce benefit metadata client");
  assert.ok(accounts.includes("last_benefit_metadata = ?"), "refresh should persist metadata JSON");
  assert.ok(accounts.includes("benefit_metadata_error"), "snapshot refresh should report metadata refresh errors");
});

test("startup plugin warms fallback benefit metadata cache", () => {
  const plugin = read("server/plugins/00-config.ts");
  assert.ok(plugin.includes("getStartupBenefitPriceIndex"), "Nitro init should warm startup fallback cache");
});

test("startup fallback cache loads committed metadata index", () => {
  const result = runWithJiti(`
const { getStartupBenefitPriceIndex } = await jiti.import(
  path.join(projectRoot, "server/services/pool/benefit-metadata-cache.ts"),
);
const index = getStartupBenefitPriceIndex();
process.stdout.write(JSON.stringify({
  gpt: index.image_basic_gpt_image_v2?.[0]?.creditUnitPrice,
  video: index.seedance_20_fast_720p_output?.[0]?.creditUnitPrice,
}));
process.exit(0);
`);

  assert.equal(result.gpt, 3);
  assert.equal(result.video, 35);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
node --test tests/account-benefit-metadata-cache.test.mjs
```

Expected: FAIL because schema fields, cache service, and refresh helper are absent.

- [ ] **Step 3: Add schema columns**

In `server/repositories/sqlite/schema.ts`, add these columns to `CREATE TABLE pool_accounts` after `last_purchase_credit INTEGER`:

```ts
  last_benefit_metadata TEXT,
  last_benefit_metadata_at INTEGER,
```

Add these migration entries after the existing credit fields:

```ts
  { column: "last_benefit_metadata", ddl: "TEXT" },
  { column: "last_benefit_metadata_at", ddl: "INTEGER" },
```

Add fields to `PoolAccountRow`:

```ts
  last_benefit_metadata: string | null;
  last_benefit_metadata_at: number | null;
```

- [ ] **Step 4: Add startup cache loader**

Create `server/services/pool/benefit-metadata-cache.ts`:

```ts
import fs from "node:fs";
import path from "node:path";

import {
  buildBenefitPriceIndex,
  normalizeBenefitMetadataResponse,
  type BenefitPriceIndex,
} from "~~/server/clients/dreamina/benefit-metadata";
import type { PoolAccountRow } from "~~/server/repositories/sqlite/schema";
import logger from "~~/server/utils/logger";
import util from "~~/server/utils/util";

const FALLBACK_METADATA_PATH = path.resolve(process.cwd(), "data/dreamina-benefit-metadata-fallback.json");

let startupBenefitPriceIndex: BenefitPriceIndex | null = null;

export function parseBenefitMetadataToIndex(raw: string | null | undefined): BenefitPriceIndex | null {
  if (!raw) return null;
  const parsed = util.ignoreJSONParse(raw);
  if (!parsed || typeof parsed !== "object") return null;
  try {
    return buildBenefitPriceIndex(normalizeBenefitMetadataResponse(parsed));
  } catch (e: any) {
    logger.warn(`解析权益元数据缓存失败: ${e?.message || String(e)}`);
    return null;
  }
}

export function getStartupBenefitPriceIndex(): BenefitPriceIndex {
  if (startupBenefitPriceIndex) return startupBenefitPriceIndex;
  const raw = fs.readFileSync(FALLBACK_METADATA_PATH, "utf8");
  const parsed = JSON.parse(raw);
  startupBenefitPriceIndex = buildBenefitPriceIndex(normalizeBenefitMetadataResponse(parsed));
  logger.info(`已加载权益元数据fallback缓存: ${Object.keys(startupBenefitPriceIndex).length} benefits`);
  return startupBenefitPriceIndex;
}

export function getBenefitPriceIndexForAccount(row?: PoolAccountRow | null): BenefitPriceIndex {
  const accountIndex = parseBenefitMetadataToIndex(row?.last_benefit_metadata);
  return accountIndex || getStartupBenefitPriceIndex();
}
```

- [ ] **Step 5: Warm cache at Nitro startup**

In `server/plugins/00-config.ts`, import the cache loader:

```ts
import { getStartupBenefitPriceIndex } from "../services/pool/benefit-metadata-cache";
```

Call it after `getDb();`:

```ts
  getStartupBenefitPriceIndex();
```

- [ ] **Step 6: Store per-account metadata in account refresh paths**

In `server/services/pool/accounts.ts`, add import:

```ts
import { getCommerceBenefitMetadata } from "~~/server/clients/dreamina/benefit-metadata";
```

Add helper after `refreshAccountCredit`:

```ts
export async function refreshAccountBenefitMetadata(id: number) {
  const row = getAccountById(id);
  if (!row) throw new Error("account not found");
  const creditProxy = resolveCreditProxy(row.proxy_url);
  const metadata = await getCommerceBenefitMetadata(row.session_id, { proxyUrl: creditProxy });
  const ts = now();
  getDb()
    .prepare(
      `UPDATE pool_accounts SET
        last_benefit_metadata = ?,
        last_benefit_metadata_at = ?,
        updated_at = ?
       WHERE id = ?`,
    )
    .run(JSON.stringify(metadata), ts, ts, id);
  return { id, metadata_at: ts, proxy: creditProxy || null };
}
```

Update `refreshAccountSnapshot` to run credit, account info, and benefit metadata independently:

```ts
  const [creditResult, infoResult, benefitMetadataResult] = await Promise.allSettled([
    refreshAccountCredit(id),
    fetchAccountInfo(id),
    refreshAccountBenefitMetadata(id),
  ]);
```

Add fields to the `snapshot` type and result:

```ts
    benefit_metadata?: Awaited<ReturnType<typeof refreshAccountBenefitMetadata>>;
    benefit_metadata_error: string | null;
  } = { id, credit_error: null, info_error: null, benefit_metadata_error: null };
```

Handle the result:

```ts
  if (benefitMetadataResult.status === "fulfilled") snapshot.benefit_metadata = benefitMetadataResult.value;
  else snapshot.benefit_metadata_error = benefitMetadataResult.reason?.message || String(benefitMetadataResult.reason);
```

- [ ] **Step 7: Run cache/persistence test and verify GREEN**

Run:

```bash
node --test tests/account-benefit-metadata-cache.test.mjs
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add server/repositories/sqlite/schema.ts server/services/pool/accounts.ts server/services/pool/benefit-metadata-cache.ts server/plugins/00-config.ts tests/account-benefit-metadata-cache.test.mjs
git commit -m "feat: cache account benefit metadata"
```

## Task 3: Pure Credit Cost Estimator

**Files:**
- Create: `server/services/pool/credit-cost.ts`
- Test: `tests/credit-cost-estimator.test.mjs`

- [ ] **Step 1: Write the failing estimator test**

Create `tests/credit-cost-estimator.test.mjs`:

```js
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
  assert.equal(result.status, 0, `child failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  return JSON.parse(result.stdout);
}

test("estimates image generation costs by model and resolution", () => {
  const result = runWithJiti(`
const { estimateCreditCost } = await jiti.import(path.join(projectRoot, "server/services/pool/credit-cost.ts"));
const index = {
  image_basic_v5_2k: [{ benefitType: "image_basic_v5_2k", unit: "page", creditUnitPrice: 15, minChargeCount: 1, roles: ["all"] }],
  image_basic_v5_4k: [{ benefitType: "image_basic_v5_4k", unit: "page", creditUnitPrice: 20, minChargeCount: 1, roles: ["standard"] }],
  image_basic_gpt_image_v2: [{ benefitType: "image_basic_gpt_image_v2", unit: "page", creditUnitPrice: 3, minChargeCount: 1, roles: ["all"] }],
};
process.stdout.write(JSON.stringify({
  seedream2k: estimateCreditCost({ kind: "image", operation: "generate", model: "seedream-5.0-lite", width: 2048, height: 2048 }, index),
  seedream4k: estimateCreditCost({ kind: "image", operation: "generate", model: "high_aes_general_v50", width: 4096, height: 4096 }, index),
  gpt: estimateCreditCost({ kind: "image", operation: "generate", model: "gpt-image-2", width: 2048, height: 2048 }, index),
}));
process.exit(0);
`);

  assert.equal(result.seedream2k.credits, 15);
  assert.equal(result.seedream2k.benefitType, "image_basic_v5_2k");
  assert.equal(result.seedream4k.credits, 20);
  assert.equal(result.seedream4k.benefitType, "image_basic_v5_4k");
  assert.equal(result.gpt.credits, 3);
});

test("estimates video costs from second-based strategies and adapted duration", () => {
  const result = runWithJiti(`
const { estimateCreditCost } = await jiti.import(path.join(projectRoot, "server/services/pool/credit-cost.ts"));
const index = {
  seedance_20_fast_720p_output: [{ benefitType: "seedance_20_fast_720p_output", unit: "second", creditUnitPrice: 35, minChargeCount: 1, roles: ["standard"] }],
  seedance_20_pro_4k_output: [{ benefitType: "seedance_20_pro_4k_output", unit: "second", creditUnitPrice: 224, minChargeCount: 1, roles: ["standard"] }],
};
process.stdout.write(JSON.stringify({
  fast: estimateCreditCost({ kind: "video", model: "seedance-2.0-fast", width: 1024, height: 1024, resolution: "720p", durationSec: 5, filePaths: [] }, index),
  pro4k: estimateCreditCost({ kind: "video", model: "dreamina_seedance_40_pro", width: 1024, height: 1024, resolution: "4k", durationSec: 4, filePaths: [] }, index),
}));
process.exit(0);
`);

  assert.equal(result.fast.credits, 175);
  assert.equal(result.fast.benefitType, "seedance_20_fast_720p_output");
  assert.equal(result.pro4k.credits, 896);
  assert.equal(result.pro4k.benefitType, "seedance_20_pro_4k_output");
});

test("returns null for unknown mappings instead of blocking scheduling", () => {
  const result = runWithJiti(`
const { estimateCreditCost } = await jiti.import(path.join(projectRoot, "server/services/pool/credit-cost.ts"));
process.stdout.write(JSON.stringify({
  unknown: estimateCreditCost({ kind: "image", operation: "generate", model: "unknown-model", width: 2048, height: 2048 }, {}),
}));
process.exit(0);
`);

  assert.equal(result.unknown, null);
});
```

- [ ] **Step 2: Run the estimator test and verify RED**

Run:

```bash
node --test tests/credit-cost-estimator.test.mjs
```

Expected: FAIL because `server/services/pool/credit-cost.ts` does not exist.

- [ ] **Step 3: Implement the pure estimator**

Create `server/services/pool/credit-cost.ts`:

```ts
import { resolveModelReqKey } from "~~/server/services/pool/model-catalog";
import { adaptVideoGenerationInput } from "~~/server/services/pool/video-model-config";
import type { BenefitPriceEntry, BenefitPriceIndex } from "~~/server/clients/dreamina/benefit-metadata";

export type ImageCreditCostContext = {
  kind: "image";
  operation: "generate" | "edit";
  model: string;
  width: number;
  height: number;
};

export type VideoCreditCostContext = {
  kind: "video";
  model: string;
  width: number;
  height: number;
  resolution: string;
  durationSec?: number;
  filePaths: string[];
};

export type CreditCostContext = ImageCreditCostContext | VideoCreditCostContext;

export type CreditCostEstimate = {
  credits: number;
  benefitType: string;
  unit: string;
  quantity: number;
  unitPrice: number;
};

const IMAGE_GENERATE_BENEFITS: Record<string, { "2k": string; "4k": string }> = {
  dreamina_lib_img_20260423: { "2k": "image_basic_gpt_image_v2", "4k": "image_basic_gpt_image_v2" },
  high_aes_general_v50: { "2k": "image_basic_v5_2k", "4k": "image_basic_v5_4k" },
  high_aes_general_v43: { "2k": "image_basic_v43_2k", "4k": "image_basic_v43_4k" },
  high_aes_general_v42: { "2k": "image_basic_v46_2k", "4k": "image_basic_v46_4k" },
  high_aes_general_v40l: { "2k": "image_basic_v4_pro_2k", "4k": "image_basic_v4_pro_4k" },
};

const VIDEO_BENEFITS: Record<string, Record<string, string>> = {
  dreamina_seedance_40_mini: {
    "720p": "seedance_20_mini_720p_output",
    "1080p": "seedance_20_mini_1080p_output",
    "4k": "seedance_20_mini_1080p_output",
  },
  dreamina_seedance_40: {
    "480p": "seedance_20_fast_480p_output",
    "720p": "seedance_20_fast_720p_output",
    "1080p": "seedance_20_fast_1080p_output",
    "4k": "seedance_20_fast_1080p_output",
  },
  dreamina_seedance_40_pro: {
    "480p": "seedance_20_pro_480p_output",
    "720p": "seedance_20_pro_720p_output",
    "1080p": "seedance_20_pro_1080p_output",
    "4k": "seedance_20_pro_4k_output",
  },
  dreamina_ic_generate_video_model_vgfm_3.5_pro: {
    "720p": "basic_video_operation_vgfm_v_three",
    "1080p": "basic_video_operation_vgfm_v_three_1080",
    "4k": "basic_video_operation_vgfm_v_three_1080",
  },
  dreamina_ic_generate_video_model_vgfm_3.0_pro: {
    "720p": "basic_video_operation_vgfm",
    "1080p": "basic_video_operation_vgfm",
    "4k": "basic_video_operation_vgfm",
  },
};

function modelReqKey(model: string): string {
  return resolveModelReqKey(model) || model;
}

function imageResolution(width: number, height: number): "2k" | "4k" {
  return Math.max(width, height) >= 3840 ? "4k" : "2k";
}

function normalizeResolution(resolution: string): string {
  const value = resolution.toLowerCase();
  if (value === "4k" || value === "2160p") return "4k";
  if (value === "1080p") return "1080p";
  if (value === "480p") return "480p";
  return "720p";
}

function benefitTypeForContext(context: CreditCostContext): string | null {
  const reqKey = modelReqKey(context.model);
  if (context.kind === "image") {
    if (context.operation === "edit") return "image_blend";
    return IMAGE_GENERATE_BENEFITS[reqKey]?.[imageResolution(context.width, context.height)] || null;
  }

  const resolution = normalizeResolution(context.resolution);
  return VIDEO_BENEFITS[reqKey]?.[resolution] || VIDEO_BENEFITS[reqKey]?.["720p"] || null;
}

function pickPrice(entries: BenefitPriceEntry[] | undefined, accountType?: string | null): BenefitPriceEntry | null {
  if (!entries?.length) return null;
  const normalizedType = (accountType || "").toLowerCase();
  const compatible = entries.filter((entry) => {
    if (entry.roles.length === 0 || entry.roles.includes("all")) return true;
    return !!normalizedType && entry.roles.some((role) => normalizedType.includes(role.toLowerCase()));
  });
  const candidates = compatible.length > 0 ? compatible : entries;
  return candidates.reduce((best, current) => (
    current.creditUnitPrice < best.creditUnitPrice ? current : best
  ), candidates[0]!);
}

function quantityForContext(context: CreditCostContext, entry: BenefitPriceEntry): number {
  if (entry.unit === "second" && context.kind === "video") {
    try {
      const adapted = adaptVideoGenerationInput(modelReqKey(context.model), {
        width: context.width,
        height: context.height,
        resolution: context.resolution,
        durationSec: context.durationSec,
        filePaths: context.filePaths,
      });
      return Math.max(1, Math.ceil(adapted.durationMs / 1000));
    } catch {
      return Math.max(1, Math.ceil(context.durationSec || 5));
    }
  }
  return 1;
}

export function estimateCreditCost(
  context: CreditCostContext | undefined,
  index: BenefitPriceIndex,
  accountType?: string | null,
): CreditCostEstimate | null {
  if (!context) return null;
  const benefitType = benefitTypeForContext(context);
  if (!benefitType) return null;
  const price = pickPrice(index[benefitType], accountType);
  if (!price) return null;
  const quantity = Math.max(quantityForContext(context, price), price.minChargeCount || 1);
  return {
    credits: price.creditUnitPrice * quantity,
    benefitType,
    unit: price.unit,
    quantity,
    unitPrice: price.creditUnitPrice,
  };
}
```

- [ ] **Step 4: Run estimator test and verify GREEN**

Run:

```bash
node --test tests/credit-cost-estimator.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add server/services/pool/credit-cost.ts tests/credit-cost-estimator.test.mjs
git commit -m "feat: estimate dreamina credit cost"
```

## Task 4: Pool Account Scheduler

**Files:**
- Modify: `server/services/pool/accounts.ts`
- Modify: `server/services/pool/auth.ts`
- Modify: `server/services/pool/session-context.ts`
- Create: `server/services/pool/scheduler.ts`
- Test: `tests/dynamic-account-scheduler.test.mjs`

- [ ] **Step 1: Write the failing scheduler test**

Create `tests/dynamic-account-scheduler.test.mjs`:

```js
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

function runWithJiti(source) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "dreamine-scheduler-"));
  const dbPath = path.join(tempDir, "test.db");
  const script = `
import { createJiti } from "jiti";
import path from "node:path";
import { pathToFileURL } from "node:url";
process.env.DREAMINE_DB_PATH = ${JSON.stringify(dbPath)};
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
  assert.equal(result.status, 0, `child failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  return JSON.parse(result.stdout);
}

test("scheduler selects an enabled account with enough cached credit when cost is known", () => {
  const result = runWithJiti(`
const { getDb } = await jiti.import(path.join(projectRoot, "server/repositories/sqlite/database.ts"));
const { addAccount } = await jiti.import(path.join(projectRoot, "server/services/pool/accounts.ts"));
const { pickAccountForCost } = await jiti.import(path.join(projectRoot, "server/services/pool/scheduler.ts"));
const db = getDb();
const lowId = addAccount("low-session", "low");
const highId = addAccount("high-session", "high");
db.prepare("UPDATE pool_accounts SET last_total_credit = ? WHERE id = ?").run(10, lowId);
db.prepare("UPDATE pool_accounts SET last_total_credit = ? WHERE id = ?").run(200, highId);
const picked = pickAccountForCost({
  kind: "image",
  operation: "generate",
  model: "seedream-5.0-lite",
  width: 2048,
  height: 2048,
});
process.stdout.write(JSON.stringify({ pickedId: picked?.id, highId }));
process.exit(0);
`);

  assert.equal(result.pickedId, result.highId);
});

test("scheduler falls back to random enabled selection when cost cannot be estimated", () => {
  const result = runWithJiti(`
const { getDb } = await jiti.import(path.join(projectRoot, "server/repositories/sqlite/database.ts"));
const { addAccount } = await jiti.import(path.join(projectRoot, "server/services/pool/accounts.ts"));
const { pickAccountForCost } = await jiti.import(path.join(projectRoot, "server/services/pool/scheduler.ts"));
const db = getDb();
const firstId = addAccount("first-session", "first");
const secondId = addAccount("second-session", "second");
db.prepare("UPDATE pool_accounts SET last_total_credit = ? WHERE id IN (?, ?)").run(0, firstId, secondId);
const picked = pickAccountForCost({
  kind: "image",
  operation: "generate",
  model: "unknown-model",
  width: 2048,
  height: 2048,
});
process.stdout.write(JSON.stringify({ pickedId: picked?.id, ids: [firstId, secondId] }));
process.exit(0);
`);

  assert.ok(result.ids.includes(result.pickedId));
});

test("pool auth passes cost context into scheduler for pool api key", () => {
  const authSource = fs.readFileSync(path.join(projectRoot, "server/services/pool/auth.ts"), "utf8");
  const sessionSource = fs.readFileSync(path.join(projectRoot, "server/services/pool/session-context.ts"), "utf8");
  assert.ok(authSource.includes("CreditCostContext"), "auth should accept typed cost context");
  assert.ok(authSource.includes("pickAccountForCost(costContext)"), "auth should use scheduler for pool key");
  assert.ok(sessionSource.includes("costContext?: CreditCostContext"), "session context should accept optional cost context");
  assert.ok(sessionSource.includes("pickOneSession(authorization, costContext)"));
});
```

- [ ] **Step 2: Run scheduler test and verify RED**

Run:

```bash
node --test tests/dynamic-account-scheduler.test.mjs
```

Expected: FAIL because scheduler and cost-context plumbing are absent.

- [ ] **Step 3: Expose enabled account listing**

In `server/services/pool/accounts.ts`, add:

```ts
export function listEnabledAccounts(): PoolAccountRow[] {
  return getDb()
    .prepare("SELECT * FROM pool_accounts WHERE enabled = 1 ORDER BY id ASC")
    .all() as PoolAccountRow[];
}
```

Change `pickEnabledAccount` to reuse it:

```ts
export function pickEnabledAccount(): PoolAccountRow | undefined {
  const rows = listEnabledAccounts();
  if (rows.length === 0) return undefined;
  return _.sample(rows);
}
```

- [ ] **Step 4: Implement scheduler**

Create `server/services/pool/scheduler.ts`:

```ts
import _ from "lodash";

import type { PoolAccountRow } from "~~/server/repositories/sqlite/schema";
import { listEnabledAccounts } from "~~/server/services/pool/accounts";
import { getBenefitPriceIndexForAccount } from "~~/server/services/pool/benefit-metadata-cache";
import { estimateCreditCost, type CreditCostContext } from "~~/server/services/pool/credit-cost";
import logger from "~~/server/utils/logger";

function randomAccount(rows: PoolAccountRow[]): PoolAccountRow | undefined {
  if (rows.length === 0) return undefined;
  return _.sample(rows);
}

export function pickAccountForCost(costContext?: CreditCostContext): PoolAccountRow | undefined {
  const rows = listEnabledAccounts();
  if (rows.length === 0) return undefined;
  if (!costContext) return randomAccount(rows);

  const eligible: PoolAccountRow[] = [];
  for (const row of rows) {
    if (row.last_total_credit == null) continue;
    try {
      const index = getBenefitPriceIndexForAccount(row);
      const estimate = estimateCreditCost(costContext, index, row.account_type);
      if (!estimate) return randomAccount(rows);
      if (row.last_total_credit >= estimate.credits) eligible.push(row);
    } catch (e: any) {
      logger.warn(`账号 ${row.id} 动态价格估算失败，回退随机选号: ${e?.message || String(e)}`);
      return randomAccount(rows);
    }
  }

  if (eligible.length === 0) return randomAccount(rows);
  return randomAccount(eligible);
}
```

- [ ] **Step 5: Pass cost context through auth/session resolution**

In `server/services/pool/auth.ts`, replace the pool import:

```ts
import { resolveFromPoolAccount } from "~~/server/services/pool/accounts";
import { pickAccountForCost } from "~~/server/services/pool/scheduler";
import type { CreditCostContext } from "~~/server/services/pool/credit-cost";
```

Change signatures and pool branch:

```ts
export function resolveSessions(authorization?: string, costContext?: CreditCostContext): ResolvedSession[] {
  if (!authorization) return [];

  if (isPoolApiKey(authorization)) {
    const acc = pickAccountForCost(costContext);
    if (!acc) return [];
    return [resolveFromPoolAccount(acc)];
  }

  const tokens = tokenSplit(authorization);
  return tokens.map((sessionId) => ({
    sessionId,
    fromPool: false,
  }));
}

export function pickOneSession(
  authorization?: string,
  costContext?: CreditCostContext,
): ResolvedSession | undefined {
  return _.sample(resolveSessions(authorization, costContext));
}
```

In `server/services/pool/session-context.ts`, import type:

```ts
import type { CreditCostContext } from "~~/server/services/pool/credit-cost";
```

Change `requireActiveSession`:

```ts
export function requireActiveSession(
  authorization?: string,
  costContext?: CreditCostContext,
): ActiveSession {
  const picked = pickOneSession(authorization, costContext);
```

- [ ] **Step 6: Run scheduler test and verify GREEN**

Run:

```bash
node --test tests/dynamic-account-scheduler.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add server/services/pool/accounts.ts server/services/pool/auth.ts server/services/pool/session-context.ts server/services/pool/scheduler.ts tests/dynamic-account-scheduler.test.mjs
git commit -m "feat: schedule pool accounts by estimated credit"
```

## Task 5: Image And Video Service Integration

**Files:**
- Modify: `server/services/images.ts`
- Modify: `server/services/videos.ts`
- Test: `tests/session-cost-context.test.mjs`
- Existing Test: `tests/post-success-credit-refresh.test.mjs`

- [ ] **Step 1: Write the failing service integration test**

Create `tests/session-cost-context.test.mjs`:

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

test("image service builds cost context before requiring a pool session", () => {
  const source = read("server/services/images.ts");
  assert.ok(source.includes("type CreditCostContext"), "image service should import cost context type");
  assert.ok(source.includes("operation: \"generate\""), "image generation should mark generate operation");
  assert.ok(source.includes("operation: \"edit\""), "image edit should mark edit operation");
  assert.ok(source.includes("requireActiveSession(authorization, costContext)"), "image service should pass context into session resolution");

  const normalizeIndex = source.indexOf("const request = normalizeImageBody(body);");
  const sessionIndex = source.indexOf("requireActiveSession(authorization, costContext)");
  assert.ok(normalizeIndex >= 0, "image service should normalize request");
  assert.ok(sessionIndex > normalizeIndex, "image service should normalize before selecting account");
});

test("video service builds cost context before requiring a pool session", () => {
  const source = read("server/services/videos.ts");
  assert.ok(source.includes("type CreditCostContext"), "video service should import cost context type");
  assert.ok(source.includes("kind: \"video\""), "video service should create video cost context");
  assert.ok(source.includes("filePaths: request.filePaths"), "video cost context should include input files");
  assert.ok(source.includes("requireActiveSession(authorization, costContext)"), "video service should pass context into session resolution");

  const normalizeIndex = source.indexOf("const request = normalizeVideoBody(body);");
  const sessionIndex = source.indexOf("requireActiveSession(authorization, costContext)");
  assert.ok(normalizeIndex >= 0, "video service should normalize request");
  assert.ok(sessionIndex > normalizeIndex, "video service should normalize before selecting account");
});
```

- [ ] **Step 2: Run service integration test and verify RED**

Run:

```bash
node --test tests/session-cost-context.test.mjs
```

Expected: FAIL because services select sessions before building cost context.

- [ ] **Step 3: Update image service**

In `server/services/images.ts`, add type import:

```ts
import type { CreditCostContext } from "~~/server/services/pool/credit-cost";
```

Add helper after `resolveImageSize`:

```ts
function imageCostContext(
  request: ReturnType<typeof normalizeImageBody>,
  size: { width: number; height: number },
  operation: "generate" | "edit",
): CreditCostContext {
  return {
    kind: "image",
    operation,
    model: request.model || DEFAULT_MODEL,
    width: size.width,
    height: size.height,
  };
}
```

In `createImageGeneration`, move session selection after normalization and size resolution:

```ts
  const request = normalizeImageBody(body);
  if (request.imageUrls.length > 0) {
    throw createError({
      statusCode: 400,
      message: "image generation does not accept input images; use image edit or composition",
    });
  }

  const size = resolveImageSize(request.ratio);
  const costContext = imageCostContext(request, size, "generate");
  const session = requireActiveSession(authorization, costContext);
```

In `createImageEdit`, use:

```ts
  const request = normalizeImageBody(body);
  if (request.imageUrls.length === 0) {
    throw createError({ statusCode: 400, message: "at least one input image is required" });
  }
  if (request.imageUrls.length > 10) {
    throw createError({ statusCode: 400, message: "at most 10 input images are supported" });
  }

  const size = resolveImageSize(request.ratio);
  const costContext = imageCostContext(request, size, "edit");
  const session = requireActiveSession(authorization, costContext);
```

- [ ] **Step 4: Update video service**

In `server/services/videos.ts`, add type import:

```ts
import type { CreditCostContext } from "~~/server/services/pool/credit-cost";
```

Add helper before `runVideoGeneration`:

```ts
function videoCostContext(request: ReturnType<typeof normalizeVideoBody>): CreditCostContext {
  return {
    kind: "video",
    model: request.model || DEFAULT_MODEL,
    width: request.width,
    height: request.height,
    resolution: request.resolution,
    durationSec: request.durationSec,
    filePaths: request.filePaths,
  };
}
```

In `createVideoGeneration`, move session selection after normalization:

```ts
  const request = normalizeVideoBody(body);
  const costContext = videoCostContext(request);
  const session = requireActiveSession(authorization, costContext);
```

- [ ] **Step 5: Run service integration and existing refresh tests**

Run:

```bash
node --test tests/session-cost-context.test.mjs tests/post-success-credit-refresh.test.mjs
```

Expected: PASS. The existing refresh test should still see `await refreshActiveSessionCredit(session)` after successful generation.

- [ ] **Step 6: Commit**

```bash
git add server/services/images.ts server/services/videos.ts tests/session-cost-context.test.mjs
git commit -m "feat: pass credit cost context into pool sessions"
```

## Task 6: Full Verification

**Files:**
- All changed files.

- [ ] **Step 1: Run targeted tests**

Run:

```bash
node --test tests/benefit-metadata-parser.test.mjs tests/account-benefit-metadata-cache.test.mjs tests/credit-cost-estimator.test.mjs tests/dynamic-account-scheduler.test.mjs tests/session-cost-context.test.mjs tests/post-success-credit-refresh.test.mjs
```

Expected: PASS.

- [ ] **Step 2: Run full test suite**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 3: Run type checker**

Run:

```bash
npm run type-check
```

Expected: PASS.

- [ ] **Step 4: Inspect git status**

Run:

```bash
git status --short
```

Expected: clean after the task commits, or only intentional uncommitted files explicitly reported to the user.
