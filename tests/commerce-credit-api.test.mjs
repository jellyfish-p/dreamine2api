import assert from "node:assert/strict";
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

test("commerce credit request matches captured CapCut benefits protocol", () => {
  const request = runWithJiti(`
const { buildCommerceCreditRequest } = await jiti.import(
  path.join(projectRoot, "server/clients/dreamina/account.ts"),
);
const request = await buildCommerceCreditRequest("session-token", {
  deviceTime: 1782818860,
  deviceId: "7650423310582023687",
});
process.stdout.write(JSON.stringify(request));
process.exit(0);
`);

  const url = new URL(request.url);
  assert.equal(url.origin, "https://commerce-api-sg.capcut.com");
  assert.equal(url.pathname, "/commerce/v1/benefits/user_credit");
  assert.equal(url.searchParams.get("timestamp"), "1782818860");
  assert.equal(request.method, "POST");
  assert.deepEqual(request.data, {});

  assert.equal(request.headers["appid"], "513641");
  assert.equal(request.headers["appvr"], "8.4.0");
  assert.equal(request.headers["content-type"], "application/json");
  assert.equal(request.headers["device-time"], "1782818860");
  assert.equal(request.headers["did"], "7650423310582023687");
  assert.equal(request.headers["lan"], "EN");
  assert.equal(request.headers["pf"], "7");
  assert.equal(request.headers["store-country-code"], "vn");
  assert.equal(request.headers["store-country-code-src"], "uid");
  assert.equal(request.headers["x-secsdk-sign-config"], "1_5000");
  assert.equal(request.headers["sign-ver"], "1");
  assert.equal(
    request.headers["sign"],
    md5("9e2c|_credit|7|8.4.0|1782818860||11ac"),
  );
  assert.equal(request.headers["sign"], "693d38da3d3631c53a41c3785d666741");
});

test("commerce credit parser reads credit breakdown from data or response string", () => {
  const parsed = runWithJiti(`
const { normalizeCommerceCreditResponse } = await jiti.import(
  path.join(projectRoot, "server/clients/dreamina/account.ts"),
);
const fromData = normalizeCommerceCreditResponse({
  ret: "0",
  data: {
    credit: {
      vip_credit: 900,
      gift_credit: 300,
      purchase_credit: 0,
    },
  },
});
const fromResponse = normalizeCommerceCreditResponse({
  ret: "0",
  response: JSON.stringify({
    credit: {
      vip_credit: 600,
      gift_credit: 200,
      purchase_credit: 100,
    },
  }),
});
process.stdout.write(JSON.stringify({ fromData, fromResponse }));
process.exit(0);
`);

  assert.deepEqual(parsed.fromData, {
    giftCredit: 300,
    purchaseCredit: 0,
    vipCredit: 900,
    totalCredit: 1200,
  });
  assert.deepEqual(parsed.fromResponse, {
    giftCredit: 200,
    purchaseCredit: 100,
    vipCredit: 600,
    totalCredit: 900,
  });
});
