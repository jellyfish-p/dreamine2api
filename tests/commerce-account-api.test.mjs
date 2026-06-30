import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

function md5(input) {
  return createHash("md5").update(input).digest("hex");
}

function loadBuiltRequest() {
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
const { buildCommerceAccountRequest } = await jiti.import(
  path.join(projectRoot, "server/clients/dreamina/account.ts"),
);
const request = await buildCommerceAccountRequest("session-token", {
  deviceTime: 1782819872,
  deviceId: "7650423310582023687",
  uifid: "test-uifid",
});
process.stdout.write(JSON.stringify(request));
process.exit(0);
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

test("commerce account API request matches captured CapCut user_info protocol", async () => {
  const request = loadBuiltRequest();

  assert.equal(
    request.url,
    "https://commerce-api-sg.capcut.com/commerce/v1/subscription/user_info?uifid=test-uifid&timestamp=1782819872",
  );
  assert.equal(request.method, "POST");
  assert.deepEqual(request.data, { aid: 513641, scene: "vip", need_sign_info: true });

  assert.equal(request.headers["appid"], "513641");
  assert.equal(request.headers["appvr"], "8.4.0");
  assert.equal(request.headers["pf"], "7");
  assert.equal(request.headers["store-country-code"], "vn");
  assert.equal(request.headers["store-country-code-src"], "uid");
  assert.equal(request.headers["did"], "7650423310582023687");
  assert.equal(request.headers["device-time"], "1782819872");
  assert.equal(request.headers["sign-ver"], "1");
  assert.equal(request.headers["x-secsdk-sign-config"], "1_5000");
  assert.equal(request.headers["app-sdk-version"], undefined);
  assert.equal(request.headers["web_id"], undefined);
  assert.equal(request.headers["lan"], undefined);
  assert.equal(request.headers["loc"], undefined);
  assert.equal(
    request.headers["sign"],
    md5("9e2c|er_info|7|8.4.0|1782819872||11ac"),
  );
  assert.equal(request.headers["sign"], "e6e1f3774e0f9263f2f42b0e40ae2221");
});
