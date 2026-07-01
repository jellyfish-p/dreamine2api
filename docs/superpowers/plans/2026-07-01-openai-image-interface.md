# OpenAI Image Interface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make image generation, edits, and compositions behave as synchronous OpenAI-compatible APIs while hiding Dreamina history polling and partial failures from clients.

**Architecture:** Keep route handlers thin and keep OpenAI response formatting in `server/services/images.ts`. Add Dreamina-specific result counting, URL extraction, and no-result error handling inside `server/clients/dreamina/images.ts`, then delete the public history route.

**Tech Stack:** Nuxt/Nitro server routes, TypeScript, existing Dreamina client, Node `node:test`, `jiti` for importing TypeScript modules in tests.

---

## File Structure

- Modify `server/clients/dreamina/images.ts`: add focused helpers for Dreamina image record parsing, use failed item counts during polling, and throw stable errors when no usable image URLs are returned.
- Modify `server/services/images.ts`: remove the customer-facing `getImageHistory` service export and its Dreamina history import.
- Delete `server/routes/v1/images/history.post.ts`: remove public history endpoint.
- Create `tests/dreamina-image-openai-interface.test.mjs`: verify route removal, mixed-result completion helpers, partial-success URL extraction, zero-success error behavior, and service response-format preservation.

### Task 1: Add Failing OpenAI Image Interface Tests

**Files:**
- Create: `tests/dreamina-image-openai-interface.test.mjs`

- [ ] **Step 1: Write the failing test file**

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
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

test("public image routes expose OpenAI-compatible endpoints without history", () => {
  assert.equal(fs.existsSync(path.join(projectRoot, "server/routes/v1/images/generations.post.ts")), true);
  assert.equal(fs.existsSync(path.join(projectRoot, "server/routes/v1/images/edits.post.ts")), true);
  assert.equal(fs.existsSync(path.join(projectRoot, "server/routes/v1/images/compositions.post.ts")), true);
  assert.equal(fs.existsSync(path.join(projectRoot, "server/routes/v1/images/history.post.ts")), false);

  const serviceSource = read("server/services/images.ts");
  assert.equal(serviceSource.includes("getImageHistory"), false);
  assert.equal(serviceSource.includes("getHistoryBySubmitIds"), false);
});

test("dreamina mixed image records count failed items toward completion", () => {
  const result = runWithJiti(`
const {
  getDreaminaImageCompletion,
  getDreaminaImageUrls,
  getDreaminaFailedImageResults,
} = await jiti.import(path.join(projectRoot, "server/clients/dreamina/images.ts"));

const record = {
  status: 20,
  finished_image_count: 4,
  pre_gen_item_ids: ["a", "b", "c", "d"],
  item_list: [
    { common_attr: { id: "ok-1" }, image: { large_images: [{ image_url: "https://example.com/1.png", width: 1024, height: 1536, format: "png" }] } },
    { common_attr: { id: "ok-2", cover_url: "https://example.com/2-cover.png" }, image: { large_images: [{ image_url: "https://example.com/2.png", width: 1024, height: 1536, format: "png" }] } },
    { common_attr: { id: "ok-3", cover_url: "https://example.com/3-cover.png" } },
  ],
  failed_item_list: [
    { common_attr: { id: "fail-1" }, gen_result_data: { result_code: 1, result_msg: "SystemBusy" } },
  ],
};

process.stdout.write(JSON.stringify({
  completion: getDreaminaImageCompletion(record, 4),
  urls: getDreaminaImageUrls(record.item_list),
  failed: getDreaminaFailedImageResults(record.failed_item_list),
}));
process.exit(0);
`);

  assert.deepEqual(result.completion, {
    expectedCount: 4,
    successCount: 3,
    failedCount: 1,
    completedCount: 4,
    complete: true,
  });
  assert.deepEqual(result.urls, [
    "https://example.com/1.png",
    "https://example.com/2.png",
    "https://example.com/3-cover.png",
  ]);
  assert.deepEqual(result.failed, [
    { id: "fail-1", code: 1, message: "SystemBusy" },
  ]);
});

test("zero successful dreamina images raise a stable generation error", () => {
  const result = runWithJiti(`
const {
  ensureDreaminaImageUrls,
  getDreaminaImageCompletion,
} = await jiti.import(path.join(projectRoot, "server/clients/dreamina/images.ts"));

const record = {
  status: 20,
  pre_gen_item_ids: ["a"],
  item_list: [],
  failed_item_list: [
    { common_attr: { id: "fail-1" }, gen_result_data: { result_code: 1, result_msg: "SystemBusy" } },
  ],
};

try {
  ensureDreaminaImageUrls([], record, "图像生成");
  process.stdout.write(JSON.stringify({ threw: false }));
} catch (error) {
  process.stdout.write(JSON.stringify({
    threw: true,
    errcode: error.errcode,
    message: error.message,
    completion: getDreaminaImageCompletion(record, 4),
  }));
}
process.exit(0);
`);

  assert.equal(result.threw, true);
  assert.equal(result.errcode, -2007);
  assert.match(result.message, /SystemBusy/);
  assert.equal(result.completion.complete, true);
});

test("image service keeps response_format handling inside OpenAI response formatting", () => {
  const source = read("server/services/images.ts");

  assert.ok(source.includes('responseFormat === "b64_json"'));
  assert.ok(source.includes("util.fetchFileBASE64"));
  assert.ok(source.includes("return formatImageResult(urls, request.responseFormat);"));
});
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `node --test tests/dreamina-image-openai-interface.test.mjs`

Expected: FAIL because `server/routes/v1/images/history.post.ts` still exists and the Dreamina helper exports do not exist yet.

- [ ] **Step 3: Commit the failing tests**

```bash
git add tests/dreamina-image-openai-interface.test.mjs
git commit -m "test: cover openai image interface behavior"
```

### Task 2: Add Dreamina Image Result Helpers

**Files:**
- Modify: `server/clients/dreamina/images.ts`

- [ ] **Step 1: Add helper exports near the existing model helpers**

```ts
type DreaminaImageRecord = Record<string, any>;

export type DreaminaImageCompletion = {
  expectedCount: number;
  successCount: number;
  failedCount: number;
  completedCount: number;
  complete: boolean;
};

export type DreaminaFailedImageResult = {
  id: string;
  code: number | string;
  message: string;
};

export function getDreaminaImageUrls(itemList: any[] = []): string[] {
  return itemList
    .map((item) =>
      item?.image?.large_images?.[0]?.image_url ||
      item?.common_attr?.cover_url ||
      item?.image_url ||
      item?.url ||
      null
    )
    .filter((url): url is string => typeof url === "string" && url.length > 0);
}

export function getDreaminaFailedImageResults(failedItemList: any[] = []): DreaminaFailedImageResult[] {
  return failedItemList.map((item) => ({
    id: item?.common_attr?.id || item?.common_attr?.effect_id || "",
    code: item?.gen_result_data?.result_code ?? item?.common_attr?.status ?? "",
    message: item?.gen_result_data?.result_msg || item?.fail_msg || item?.fail_code || "unknown",
  }));
}

function positiveNumber(value: unknown): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : 0;
}

export function getDreaminaImageCompletion(
  record: DreaminaImageRecord,
  fallbackExpectedCount = 4,
): DreaminaImageCompletion {
  const successCount = Array.isArray(record?.item_list) ? record.item_list.length : 0;
  const failedCount = Array.isArray(record?.failed_item_list) ? record.failed_item_list.length : 0;
  const preGenCount = Array.isArray(record?.pre_gen_item_ids) ? record.pre_gen_item_ids.length : 0;
  const expectedCount = preGenCount || positiveNumber(record?.total_image_count) || fallbackExpectedCount;
  const listedCompletedCount = successCount + failedCount;
  const completedCount = Math.max(listedCompletedCount, positiveNumber(record?.finished_image_count));
  const hasTerminalStatus = record?.status === 10 || record?.status === 50;
  const hasFinishTime = positiveNumber(record?.task?.finish_time || record?.finish_time) > 0;

  return {
    expectedCount,
    successCount,
    failedCount,
    completedCount,
    complete:
      hasTerminalStatus ||
      completedCount >= expectedCount ||
      (hasFinishTime && completedCount > 0),
  };
}

export function ensureDreaminaImageUrls(
  imageUrls: string[],
  record: DreaminaImageRecord,
  context: string,
): string[] {
  if (imageUrls.length > 0) return imageUrls;
  if (record?.fail_code === "2038") throw new APIException(EX.API_CONTENT_FILTERED);

  const failed = getDreaminaFailedImageResults(record?.failed_item_list);
  const reason = failed
    .map((item) => [item.id, item.message].filter(Boolean).join(": "))
    .filter(Boolean)
    .join("; ");

  throw new APIException(
    EX.API_IMAGE_GENERATION_FAILED,
    `${context}失败: ${reason || record?.fail_msg || record?.fail_code || "未返回可用图片"}`,
  );
}

function logDreaminaFailedImages(context: string, failedItemList: any[] = []) {
  const failed = getDreaminaFailedImageResults(failedItemList);
  if (failed.length === 0) return;
  logger.warn(`${context}部分图片生成失败: ${JSON.stringify(failed)}`);
}
```

- [ ] **Step 2: Run the focused test and confirm helper tests now pass but route test still fails**

Run: `node --test tests/dreamina-image-openai-interface.test.mjs`

Expected: FAIL only on the public history route/service assertions.

### Task 3: Use Helpers in Synchronous Polling

**Files:**
- Modify: `server/clients/dreamina/images.ts`

- [ ] **Step 1: Update `generateImages` polling**

Use the initial submit response to set the expected count:

```ts
const expectedImageCount = getDreaminaImageCompletion(aigc_data, 4).expectedCount;
const poller = new SmartPoller({
  maxPollCount,
  expectedItemCount: expectedImageCount,
  type: 'image'
});
```

Inside the poll function, count successful plus failed items:

```ts
const completion = getDreaminaImageCompletion(taskInfo, expectedImageCount);
const statusForPolling =
  currentStatus === 30 && completion.completedCount >= completion.expectedCount
    ? 20
    : currentStatus;

return {
  status: {
    status: statusForPolling,
    failCode: currentFailCode,
    itemCount: completion.completedCount,
    finishTime,
    historyId
  } as PollingStatus,
  data: taskInfo
};
```

After polling, use the helpers:

```ts
const item_list = finalTaskInfo.item_list || [];
logDreaminaFailedImages("图像生成", finalTaskInfo.failed_item_list || []);
const imageUrls = ensureDreaminaImageUrls(
  getDreaminaImageUrls(item_list),
  finalTaskInfo,
  "图像生成",
);
```

- [ ] **Step 2: Update `generateImageComposition` manual polling**

Track `finalTaskInfo` and break when `getDreaminaImageCompletion(record, 1).complete` is true:

```ts
let status = 20, failCode: string | undefined, item_list: any[] = [], finalTaskInfo: any = null;
```

Inside the loop:

```ts
const taskInfo = result[historyId];
finalTaskInfo = taskInfo;
status = taskInfo.status;
failCode = taskInfo.fail_code;
item_list = taskInfo.item_list || [];

const completion = getDreaminaImageCompletion(taskInfo, 1);
if (status === 30 && completion.successCount === 0) break;
if (completion.complete) break;
```

After polling:

```ts
const finalRecord = finalTaskInfo || { status, fail_code: failCode, item_list };
logDreaminaFailedImages("图生图", finalRecord.failed_item_list || []);
const resultImageUrls = ensureDreaminaImageUrls(
  getDreaminaImageUrls(finalRecord.item_list || []),
  finalRecord,
  "图生图",
);
```

- [ ] **Step 3: Run focused tests**

Run: `node --test tests/dreamina-image-openai-interface.test.mjs`

Expected: FAIL only on public history route/service assertions until Task 4 removes them.

### Task 4: Remove the Public History Endpoint

**Files:**
- Delete: `server/routes/v1/images/history.post.ts`
- Modify: `server/services/images.ts`
- Modify: `server/clients/dreamina/images.ts`

- [ ] **Step 1: Delete the route file**

Remove `server/routes/v1/images/history.post.ts`.

- [ ] **Step 2: Remove service history import and function**

In `server/services/images.ts`, remove `getHistoryBySubmitIds` from the Dreamina import and delete:

```ts
export async function getImageHistory(body: Record<string, unknown>, authorization: string) {
  const session = requireActiveSession(authorization);
  const submitIds = body.submit_ids;
  if (!Array.isArray(submitIds) || submitIds.length === 0) {
    throw createError({ statusCode: 400, message: "submit_ids must be a non-empty array" });
  }
  if (submitIds.length > 20) {
    throw createError({ statusCode: 400, message: "at most 20 submit_ids are supported" });
  }
  return {
    created: util.unixTimestamp(),
    data: await getHistoryBySubmitIds(submitIds.map(String), session.sessionId),
  };
}
```

- [ ] **Step 3: Remove unused public history helpers from the Dreamina client default export**

If `getHistoryBySubmitIds` and `waitForImageGeneration` are no longer referenced by `rg`, remove those exported functions and remove them from the default export object.

- [ ] **Step 4: Run focused tests**

Run: `node --test tests/dreamina-image-openai-interface.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit route removal and polling implementation**

```bash
git add server/clients/dreamina/images.ts server/services/images.ts server/routes/v1/images/history.post.ts
git commit -m "fix: hide image history polling behind openai interface"
```

### Task 5: Full Verification

**Files:**
- No source changes unless verification finds a failure.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 2: Run type checking**

Run: `npm run type-check`

Expected: type checking exits successfully.

- [ ] **Step 3: Inspect final diff**

Run: `git status --short`

Expected: only pre-existing unrelated files remain unstaged, or no changes if implementation commits were made.

## Self-Review

Spec coverage:

- Public OpenAI-compatible image endpoints stay: Task 1 route test and Task 4 route removal keep generations, edits, and compositions.
- Public history endpoint is removed: Task 1 and Task 4.
- Dreamina polling is internal and counts failed items: Task 2 and Task 3.
- Partial success returns only successful images: Task 1 helper test and Task 3 use `getDreaminaImageUrls`.
- Zero successful images raises stable error: Task 1 and Task 2.
- `b64_json` formatting remains service-owned: Task 1 response-format test.

Placeholder scan: no placeholder tasks or undefined follow-up steps remain.

Type consistency: helper names used in tests and implementation steps match: `getDreaminaImageCompletion`, `getDreaminaImageUrls`, `getDreaminaFailedImageResults`, and `ensureDreaminaImageUrls`.
