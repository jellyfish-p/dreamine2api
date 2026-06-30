import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

test("account info extraction supports current vip level fields from commerce user_info", () => {
  const source = fs.readFileSync(
    path.join(projectRoot, "server/services/pool/accounts.ts"),
    "utf8",
  );

  assert.ok(
    source.includes("sub.cur_vip_level"),
    "extractVipLevel should read cur_vip_level from the captured user_info response",
  );
  assert.ok(
    source.includes("sub.vip_levels?.[0]?.level"),
    "extractVipLevel should fall back to vip_levels[0].level",
  );
  assert.ok(
    source.includes("sub.cur_level_end_time"),
    "extractVipExpire should read cur_level_end_time from the captured user_info response",
  );
});
