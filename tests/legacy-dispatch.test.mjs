import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("legacy JSON responses are sent without crashing Node's ServerResponse", () => {
  const child = spawnSync(
    process.execPath,
    ["--input-type=module", "-"],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      input: `
        import { createJiti } from "jiti";
        import assert from "node:assert/strict";
        import http from "node:http";
        import path from "node:path";
        import { pathToFileURL } from "node:url";
        import * as h3 from "h3";

        Object.assign(globalThis, h3);
        process.once("uncaughtException", (err) => {
          console.error("UNCAUGHT", err.message);
          process.exit(7);
        });

        const src = path.resolve(process.cwd(), "src");
        const jiti = createJiti(pathToFileURL(path.resolve(process.cwd(), "package.json")).href, {
          alias: {
            "@": src,
            "@/*": src + "/*",
            "@legacy": src,
            "@legacy/*": src + "/*",
          },
          tsconfigPaths: true,
          interopDefault: true,
        });

        const { dispatchLegacyApi } = await jiti.import("./server/utils/legacy-dispatch.ts");
        const app = h3.createApp();
        app.use(h3.eventHandler(async (event) => {
          const handled = await dispatchLegacyApi(event);
          if (!handled) return { missed: true };
        }));

        const server = http.createServer(h3.toNodeListener(app));
        await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

        try {
          const { port } = server.address();
          const response = await fetch("http://127.0.0.1:" + port + "/v1/models");
          const body = await response.text();
          assert.equal(response.status, 200);
          assert.match(response.headers.get("content-type") || "", /application\\/json/);
          assert.equal(JSON.parse(body).object, "list");
        } finally {
          await new Promise((resolve) => server.close(resolve));
        }
        process.exit(0);
      `,
    },
  );

  assert.equal(
    child.status,
    0,
    [
      "child process should complete without an uncaught response write error",
      child.stdout,
      child.stderr,
    ].join("\n"),
  );
});
