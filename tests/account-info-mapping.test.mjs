import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

function runMappingScript(body) {
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
const { deriveAccountType } = await jiti.import(
  path.join(projectRoot, "server/services/pool/account-info.ts"),
);
${body}
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
  return result.stdout.trim();
}

test("free commerce subscription response maps to a readable account type", () => {
  const output = runMappingScript(`
const accountType = deriveAccountType({
  account: {},
  commerce: {
    flag: false,
    start_time: 0,
    end_time: 0,
    uid: "7657007191095051265",
    subscribe_type: "un-auto",
    product_id: "",
    workspace_subscribe_info: { flag: false, vip_real_end: 0, ongoing_plans: [] },
  },
  storeCountry: null,
  previousType: null,
});
process.stdout.write(accountType);
`);

  assert.equal(output, "free");
});

test("active commerce subscription response maps to vip account type", () => {
  const output = runMappingScript(`
const accountType = deriveAccountType({
  account: {},
  commerce: {
    flag: true,
    start_time: 1782700000,
    end_time: 1785300000,
    uid: "7657007191095051265",
    subscribe_type: "auto",
    product_id: "dreamina_vip",
  },
  storeCountry: null,
  previousType: null,
});
process.stdout.write(accountType);
`);

  assert.equal(output, "vip");
});
