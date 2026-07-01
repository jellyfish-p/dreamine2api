import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'tmp', 'network-capture');

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:5200/';

const captured = [];

async function main() {
  mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({
    headless: false,
    devtools: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  page.on('request', (req) => {
    const entry = {
      type: 'request',
      id: captured.length,
      url: req.url(),
      method: req.method(),
      headers: req.headers(),
      postData: null,
      timestamp: new Date().toISOString(),
    };
    try {
      const postData = req.postData();
      if (postData) {
        try {
          entry.postData = JSON.parse(postData);
        } catch {
          entry.postData = postData;
        }
      }
    } catch {}
    captured.push(entry);
    console.log(`[REQ ${entry.id}] ${entry.method} ${entry.url}`);
  });

  page.on('response', async (res) => {
    const req = res.request();
    const entry = {
      type: 'response',
      id: captured.length,
      url: res.url(),
      status: res.status(),
      statusText: res.statusText(),
      headers: res.headers(),
      body: null,
      timestamp: new Date().toISOString(),
    };

    // try to get response body for JSON/text responses
    const contentType = res.headers()['content-type'] || '';
    try {
      if (contentType.includes('json') || contentType.includes('text') || contentType.includes('xml')) {
        const body = await res.text();
        if (body.length < 500_000) {
          try {
            entry.body = JSON.parse(body);
          } catch {
            entry.body = body.slice(0, 100_000);
          }
        } else {
          entry.body = `[truncated: ${body.length} bytes]`;
        }
      }
    } catch {}

    captured.push(entry);
    const icon = res.status() >= 400 ? '❌' : res.status() >= 300 ? '↪' : '✓';
    console.log(`[RES ${entry.id}] ${icon} ${res.status()} ${res.url()}`);
  });

  page.on('requestfailed', (req) => {
    const entry = {
      type: 'requestfailed',
      id: captured.length,
      url: req.url(),
      method: req.method(),
      failure: req.failure()?.errorText || 'unknown',
      timestamp: new Date().toISOString(),
    };
    captured.push(entry);
    console.log(`[FAIL ${entry.id}] ❌ ${req.method} ${req.url()} - ${entry.failure}`);
  });

  console.log(`\nOpening ${TARGET_URL} ...`);
  await page.goto(TARGET_URL).catch(() => {
    console.log(`Failed to navigate to ${TARGET_URL}, will open blank page.`);
  });

  console.log('\n========================================');
  console.log('Browser opened. Perform your operations.');
  console.log('CLOSE the browser window when done.');
  console.log('========================================\n');

  process.stdin.resume();

  await new Promise((resolve) => {
    browser.on('disconnected', resolve);
  });

  // Save captured data
  const outFile = join(outDir, `capture-${Date.now()}.json`);
  writeFileSync(outFile, JSON.stringify(captured, null, 2), 'utf-8');

  // Also save a filtered error-only file
  const errors = captured.filter(
    (e) =>
      e.type === 'requestfailed' ||
      (e.type === 'response' && e.status >= 400)
  );
  if (errors.length > 0) {
    const errFile = join(outDir, `errors-${Date.now()}.json`);
    writeFileSync(errFile, JSON.stringify(errors, null, 2), 'utf-8');
    console.log(`\n${errors.length} error entries saved to: ${errFile}`);
  }

  console.log(`\nTotal ${captured.length} entries saved to: ${outFile}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
