/**
 * Screenshots the home page of every archived version for the /archive grid.
 *
 *   pnpm build && PORT=8091 pnpm start   # in another terminal
 *   node scripts/archive/thumbnails.ts http://localhost:8091
 *
 * Needs a Chromium binary (CHROME_PATH, or Playwright's headless shell cache)
 * and macOS `sips` to resize. Writes public/archive-sites/_thumbs/<slug>.jpg.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
// @ts-ignore: Node runs this file directly, so the import keeps its .ts extension.
import { ERAS, eraFrameUrl } from "../../src/archive/eras.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = path.join(ROOT, "public/archive-sites/_thumbs");
const base = process.argv[2];
if (!base) throw new Error("Usage: node scripts/archive/thumbnails.ts <running site URL>");

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const cache = path.join(os.homedir(), "Library/Caches/ms-playwright");
  for (const dir of existsSync(cache) ? readdirSync(cache).sort().reverse() : []) {
    if (!dir.startsWith("chromium_headless_shell")) continue;
    for (const sub of readdirSync(path.join(cache, dir))) {
      const bin = path.join(cache, dir, sub, "chrome-headless-shell");
      if (existsSync(bin)) return bin;
    }
  }
  throw new Error("No Chromium found. Set CHROME_PATH.");
}

const chrome = findChrome();
await fs.mkdir(OUT, { recursive: true });
const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "archive-thumbs-"));

for (const era of ERAS) {
  const png = path.join(tmp, `${era.slug}.png`);
  const jpg = path.join(OUT, `${era.slug}.jpg`);
  execFileSync(
    chrome,
    [
      "--headless",
      "--hide-scrollbars",
      "--disable-gpu",
      "--force-prefers-color-scheme=light",
      "--window-size=1280,800",
      "--virtual-time-budget=5000",
      `--screenshot=${png}`,
      new URL(eraFrameUrl(era, "/"), base).href,
    ],
    { stdio: "ignore" },
  );
  execFileSync(
    "sips",
    ["-Z", "800", "-s", "format", "jpeg", "-s", "formatOptions", "72", png, "--out", jpg],
    {
      stdio: "ignore",
    },
  );
  console.log(`✓ ${era.slug}`);
}

await fs.rm(tmp, { recursive: true, force: true });
