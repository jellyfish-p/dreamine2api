import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

function runLoggerScript(script) {
  const result = spawnSync(process.execPath, ["--input-type=module", "-"], {
    cwd: projectRoot,
    input: script,
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1" },
  });

  assert.equal(
    result.status,
    0,
    `child process failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );

  return result.stdout.trim();
}

function importLoggerScript(prefix, body) {
  return `
import { createJiti } from "jiti";
import path from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = ${JSON.stringify(projectRoot)};
${prefix}

const srcDir = path.join(projectRoot, "src");
const jiti = createJiti(pathToFileURL(path.join(projectRoot, "package.json")).href, {
  alias: {
    "@": srcDir,
    "@/*": path.join(srcDir, "*"),
  },
  tsconfigPaths: true,
  interopDefault: true,
});
const logger = await jiti.import(path.join(projectRoot, "src/lib/logger.ts"), { default: true });

${body}
`;
}

test("logger.log does not print literal undefined", () => {
  const stdout = runLoggerScript(
    importLoggerScript(
      'process.env.VERCEL = "1";',
      `
const captured = [];
for (const level of ["log", "info", "warn", "error", "debug"]) {
  console[level] = (...args) => {
    captured.push({ level, args: args.map(String) });
  };
}

logger.log("plain log");
logger.info("info log");
logger.error("error log");
logger.fatal("fatal log");

process.stdout.write(JSON.stringify(captured));
process.exit(0);
`,
    ),
  );

  const captured = JSON.parse(stdout);
  assert.equal(captured.length, 4);
  assert.deepEqual(
    captured.map((entry) => entry.level),
    ["log", "info", "error", "error"],
  );
  assert.equal(
    captured.some((entry) => entry.args.some((arg) => arg === "undefined")),
    false,
  );
  assert.equal(
    captured.some((entry) => entry.args.some((arg) => arg.includes("plain log"))),
    true,
  );
});

test("logger writes error and fatal entries on separate lines", () => {
  const stdout = runLoggerScript(
    importLoggerScript(
      `
import fs from "node:fs";
import os from "node:os";

delete process.env.VERCEL;
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "dreamine-logger-"));
process.chdir(tmpDir);
fs.writeFileSync(path.join(tmpDir, "package.json"), JSON.stringify({ name: "logger-test" }));
`,
      `
logger.error("boom");
logger.fatal("fatal-boom");
logger.footer();

const logsDir = path.join(process.cwd(), "logs");
const logFile = fs.readdirSync(logsDir).find((file) => file.endsWith(".log"));
const content = fs.readFileSync(path.join(logsDir, logFile), "utf8");
process.chdir(projectRoot);
fs.rmSync(tmpDir, { recursive: true, force: true });

process.stdout.write(JSON.stringify({ content }));
process.exit(0);
`,
    ),
  );

  const { content } = JSON.parse(stdout);
  const logLines = content
    .split(/\r?\n/)
    .filter((line) => /\[(error|fatal)\]/.test(line));

  assert.equal(logLines.length, 2, content);
  assert.match(logLines[0], /\[error\].*boom/);
  assert.match(logLines[1], /\[fatal\].*fatal-boom/);
});
