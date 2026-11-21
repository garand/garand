/**
 * Rebuilds every past version of the site from git history and saves a static,
 * self-contained copy of each one under public/archive-sites/<slug>/.
 *
 *   node scripts/archive/build.ts            # all eras
 *   node scripts/archive/build.ts 2012-v3    # just one
 *
 * Needs network access (npm installs for the React-era builds, Google Fonts for
 * the Typekit substitutes). Each era is:
 *   1. extracted from git into a temp dir,
 *   2. built (Jekyll eras are rendered with liquidjs, React eras with their own lockfile),
 *   3. served locally and crawled from "/",
 *   4. rewritten so every internal URL is relative and dead third-party scripts are gone.
 */
import { spawn, execFileSync } from "node:child_process";
import { createServer, type Server } from "node:http";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Liquid } from "liquidjs";
import { marked } from "marked";
// @ts-ignore: Node runs this file directly, so the import keeps its .ts extension.
import { ERAS, type Era } from "../../src/archive/eras.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT_ROOT = path.join(ROOT, "public/archive-sites");
const PAGES_FILE = path.join(ROOT, "src/archive/pages.gen.json");
const WORK_ROOT = await fs.mkdtemp(path.join(os.tmpdir(), "garand-archive-"));
const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

/** Hosts that meant "this same site" in old absolute links. */
const SELF_HOSTS = new Set([
  "anthonygarand.com",
  "www.anthonygarand.com",
  "garand.me",
  "www.garand.me",
  "garand.cc",
  "www.garand.cc",
]);

/** Scripts that are dead, track visitors, or only embed third-party widgets. */
const DROP_SCRIPT = [
  /typekit\.(net|com)/,
  /platform\.twitter\.com/,
  /html5shiv/,
  /gaug\.es/,
  /gosquared/,
  /google-analytics/,
  /visitors\.now/,
  /instafeed/,
];
const DROP_INLINE_SCRIPT = [/_gauges/, /_gaq/, /GoSquared|_gs\(/, /Typekit\.load/, /twttr/];
/** Third-party scripts worth keeping, saved locally. */
const LOCALIZE_SCRIPT = [/ajax\.googleapis\.com/, /code\.jquery\.com/];

type FontShim = { family: string; google: string };

type EraBuild = {
  /** Patch the extracted source tree before building */
  patch?: (dir: string) => Promise<void>;
  /** Build steps, run in the source dir */
  build?: string[][];
  /** Start a server; must honour PORT */
  serve?: string[];
  /** Directory to serve statically (relative to the source dir) */
  staticDir?: string;
  /** Extra paths to crawl besides what's linked from "/" */
  seeds?: string[];
  /** Drop every <script> (React builds can't hydrate under a new base path) */
  stripAllScripts?: boolean;
  /** Typekit fonts → closest Google Fonts, renamed to the original family */
  fonts?: FontShim[];
};

const PROXIMA: FontShim = {
  family: "proxima-nova",
  google: "Montserrat:ital,wght@0,200;0,300;0,400;0,600;0,700;1,300;1,400",
};

const BUILDS: Record<string, EraBuild> = {
  // Committed later as a subfolder, but written to be served from the root.
  "2011-calling-card": { staticDir: "vcard" },
  "2011-notebook": { staticDir: "_site", seeds: ["/posts/square-support/"] },
  "2011-version-two": { staticDir: "_site", seeds: ["/vcard/"] },
  "2011-new-version": {
    seeds: ["/vcard/", "/sephora/", "/avatar/"],
    fonts: [{ family: "purista-web", google: "Saira:wght@300;400;600;700" }],
  },
  "2012-v3": {
    seeds: ["/vcard/"],
    fonts: [
      { family: "purista-web", google: "Saira:wght@300;400;600;700" },
      { family: "ff-tisa-web-pro", google: "Merriweather:ital,wght@0,300;0,400;0,700;1,400" },
      { family: "museo-sans", google: "Nunito Sans:ital,wght@0,300;0,400;0,700;1,400" },
      { family: "inconsolata", google: "Inconsolata:wght@400;700" },
    ],
  },
  "2013-hey": {
    seeds: ["/thoughts/", "/vcard/", "/avatar/"],
    fonts: [PROXIMA, { family: "source-code-pro", google: "Source Code Pro:wght@400;700" }],
  },
  "2015-responsive": { seeds: ["/avatar/"], fonts: [PROXIMA] },
  "2018-dark-mode": {
    seeds: ["/avatar/"],
    fonts: [PROXIMA],
    async patch(dir) {
      // The avatar was hot-linked from Instagram's CDN; use the repo's copy.
      for (const rel of ["index.html", "assets/style/main.css"]) {
        const file = path.join(dir, rel);
        const text = await fs.readFile(file, "utf8");
        await fs.writeFile(
          file,
          text.replace(/https:\/\/instagram\.[^"')]+/g, "/assets/images/profile.jpg"),
        );
      }
      // That copy is a light photo; the lost one sat behind white text on black.
      const index = path.join(dir, "index.html");
      const html = await fs.readFile(index, "utf8");
      await fs.writeFile(
        index,
        html.replace("</head>", "<style>.profile{filter:brightness(.4)}</style></head>"),
      );
    },
  },
  "2023-remix": {
    async patch(dir) {
      await fixFontAwesomeLockfile(dir);
      // The streaming entry relies on Remix 1's fetch polyfill, which breaks on
      // modern Node. A plain renderToString is all a static snapshot needs.
      await fs.writeFile(path.join(dir, "app/entry.server.tsx"), SIMPLE_REMIX_ENTRY);
    },
    build: [
      ["npm", "ci", "--no-audit", "--no-fund", "--ignore-scripts"],
      ["npm", "rebuild", "esbuild"],
      ["npx", "postcss", "./style/index.css", "-o", "app/style/index.css"],
      ["npx", "remix", "build"],
    ],
    serve: ["node", path.join(ROOT, "scripts/archive/remix-serve.mjs"), "build/index.js"],
    stripAllScripts: true,
  },
  "2023-clean": {
    patch: fixFontAwesomeLockfile,
    build: [
      ["npm", "ci", "--no-audit", "--no-fund"],
      ["npx", "remix", "build"],
    ],
    serve: ["node", path.join(ROOT, "scripts/archive/remix-serve.mjs"), "build/index.js"],
    stripAllScripts: true,
  },
  "2025-tanstack": {
    build: [
      ["npm", "ci", "--no-audit", "--no-fund"],
      ["npx", "vite", "build"],
    ],
    serve: ["node", "server.ts"],
    stripAllScripts: true,
  },
};

const SIMPLE_REMIX_ENTRY = `import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";

export default function handleRequest(request: Request, status: number, headers: Headers, context: EntryContext) {
  const markup = renderToString(<RemixServer context={context} url={request.url} />);
  headers.set("Content-Type", "text/html; charset=utf-8");
  return new Response("<!DOCTYPE html>" + markup, { status, headers });
}
`;

// ---------------------------------------------------------------------------

async function main() {
  const only = process.argv.slice(2);
  const eras = ERAS.filter(
    (e) => e.kind !== "live" && (only.length === 0 || only.includes(e.slug)),
  );
  const pages: Record<string, { path: string; title: string }[]> = existsSync(PAGES_FILE)
    ? JSON.parse(await fs.readFile(PAGES_FILE, "utf8"))
    : {};

  for (const era of eras) {
    console.log(`\n▸ ${era.slug} (${era.commit})`);
    pages[era.slug] = await buildEra(era);
    // Written after every era so a later failure can't leave the list out of sync.
    const ordered = Object.fromEntries(
      ERAS.filter((e) => pages[e.slug]).map((e) => [e.slug, pages[e.slug]]),
    );
    await fs.writeFile(PAGES_FILE, JSON.stringify(ordered, null, 2) + "\n");
  }

  await fs.rm(WORK_ROOT, { recursive: true, force: true });
  console.log("\nDone.");
}

async function buildEra(era: Era) {
  const cfg = BUILDS[era.slug] ?? {};
  const src = path.join(WORK_ROOT, era.slug);
  await fs.mkdir(src, { recursive: true });
  execFileSync("sh", ["-c", `git archive ${era.commit} | tar -x -C "${src}"`], { cwd: ROOT });
  await cfg.patch?.(src);

  if (era.kind === "jekyll") await renderJekyll(src, path.join(src, "_site"));
  // No NODE_ENV=production here: npm ci would skip the devDependencies the builds need.
  for (const cmd of cfg.build ?? []) await run(cmd, src);

  let origin: string;
  let stop: () => Promise<void>;
  if (cfg.serve) {
    ({ origin, stop } = await startProcess(cfg.serve, src));
  } else {
    ({ origin, stop } = await serveStatic(path.join(src, cfg.staticDir ?? ".")));
  }

  try {
    // Build into a staging dir and only swap it in once it's complete, so a
    // failed run leaves the previous snapshot in place.
    const out = path.join(OUT_ROOT, era.slug);
    const staging = path.join(WORK_ROOT, `${era.slug}.out`);
    const site = await crawl(origin, ["/", ...(cfg.seeds ?? [])]);
    if (!site.has("/")) throw new Error(`${era.slug}: the home page didn't load`);
    const pages = await writeSite(site, staging, cfg);
    await fs.rm(out, { recursive: true, force: true });
    await fs.mkdir(OUT_ROOT, { recursive: true });
    await fs.cp(staging, out, { recursive: true });
    return pages;
  } finally {
    await stop();
  }
}

// --- Jekyll ----------------------------------------------------------------

type Doc = { data: Record<string, any>; body: string };

function frontMatter(text: string): Doc | null {
  const m = text.match(/^---\s*\n([\s\S]*?)\n?---\s*\n?/);
  if (!m) return null;
  return { data: parseYaml(m[1]!), body: text.slice(m[0].length) };
}

/** Just enough YAML for 2011-era _config.yml files and front matter. */
function parseYaml(text: string): Record<string, any> {
  const out: Record<string, any> = {};
  let listKey: string | null = null;
  let item: Record<string, any> | null = null;
  const scalar = (v: string) => {
    v = v.trim();
    if (/^\[.*\]$/.test(v))
      return v
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim());
    if (/^(true|false)$/.test(v)) return v === "true";
    return v.replace(/^(["'])(.*)\1$/, "$2");
  };
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const listItem = line.match(/^\s*-\s+(\w+):\s*(.*)$/);
    const listCont = line.match(/^\s{2,}(\w+):\s*(.*)$/);
    const top = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (listItem && listKey) {
      item = { [listItem[1]!]: scalar(listItem[2]!) };
      out[listKey].push(item);
    } else if (listCont && item) {
      item[listCont[1]!] = scalar(listCont[2]!);
    } else if (top) {
      const [, key = "", value = ""] = top;
      item = null;
      if (value.trim() === "") {
        listKey = key;
        out[key] = [];
      } else {
        listKey = null;
        out[key] = scalar(value);
      }
    }
  }
  return out;
}

async function renderJekyll(src: string, dest: string) {
  const config = existsSync(path.join(src, "_config.yml"))
    ? parseYaml(await fs.readFile(path.join(src, "_config.yml"), "utf8"))
    : {};
  const permalink: string = config.permalink ?? "/:year/:month/:day/:title";
  const liquid = new Liquid({ strictVariables: false, strictFilters: false });

  const layouts: Record<string, Doc> = {};
  for (const f of await listFiles(path.join(src, "_layouts"))) {
    const text = await fs.readFile(path.join(src, "_layouts", f), "utf8");
    layouts[path.basename(f, path.extname(f))] = frontMatter(text) ?? { data: {}, body: text };
  }

  const posts: Record<string, any>[] = [];
  for (const f of await listFiles(path.join(src, "_posts"))) {
    const m = f.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.(md|markdown|html)$/);
    if (!m) continue;
    const doc = frontMatter(await fs.readFile(path.join(src, "_posts", f), "utf8"));
    if (!doc) continue;
    const [, year = "", month = "", day = "", slug = "", ext = ""] = m;
    const url = permalink
      .replace(":year", year)
      .replace(":month", month)
      .replace(":day", day)
      .replace(":title", slug);
    posts.push({
      ...doc.data,
      url,
      slug,
      date: new Date(`${year}-${month}-${day}T12:00:00`),
      body: doc.body,
      ext,
    });
  }
  posts.sort((a, b) => b.date - a.date);

  const site = { ...config, posts, time: new Date() };
  const render = async (doc: Doc, isMarkdown: boolean, page: Record<string, any>) => {
    let content = await liquid.parseAndRender(doc.body, { site, page, content: "" });
    if (isMarkdown) content = await marked.parse(content);
    return content;
  };
  const wrap = async (
    content: string,
    layoutName: string | undefined,
    page: Record<string, any>,
  ) => {
    let name = layoutName;
    for (
      let layout = name ? layouts[name] : undefined;
      layout;
      layout = name ? layouts[name] : undefined
    ) {
      const merged = { ...layout.data, ...page };
      content = await liquid.parseAndRender(layout.body, { site, page: merged, content });
      name = layout.data.layout;
    }
    return content;
  };

  // Posts render first so pages can use post.content.
  for (const post of posts) {
    post.content = await render({ data: post, body: post.body }, post.ext !== "html", post);
  }
  for (const post of posts) {
    const html = await wrap(post.content, post.layout, post);
    await writeOut(dest, post.url, html);
  }

  for (const f of await listFiles(src, true)) {
    const rel = f;
    if (rel.split("/").some((part) => part.startsWith("_") || part.startsWith("."))) continue;
    const abs = path.join(src, rel);
    const ext = path.extname(rel);
    const text = [".html", ".md", ".markdown"].includes(ext)
      ? await fs.readFile(abs, "utf8")
      : null;
    const doc = text ? frontMatter(text) : null;
    if (!doc) {
      await fs.mkdir(path.dirname(path.join(dest, rel)), { recursive: true });
      await fs.copyFile(abs, path.join(dest, rel));
      continue;
    }
    const outRel = rel.replace(/\.(md|markdown)$/, ".html");
    const url = "/" + outRel.replace(/index\.html$/, "");
    const page = { ...doc.data, url };
    const content = await render(doc, ext !== ".html", page);
    await fs.mkdir(path.dirname(path.join(dest, outRel)), { recursive: true });
    await fs.writeFile(path.join(dest, outRel), await wrap(content, doc.data.layout, page));
  }
}

async function writeOut(dest: string, url: string, html: string) {
  const rel = url.endsWith(".html") ? url : path.posix.join(url, "index.html");
  const file = path.join(dest, rel);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html);
}

// --- Serving & crawling -------------------------------------------------------

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".vcf": "text/vcard",
  ".manifest": "text/cache-manifest",
};

/** The real path of `file` if it resolves inside `root`, else null. */
async function insideDir(root: string, file: string) {
  const real = await fs.realpath(file).catch(() => null);
  if (!real) return null;
  const rel = path.relative(root, real);
  return rel.startsWith("..") || path.isAbsolute(rel) ? null : real;
}

async function serveStatic(dir: string) {
  const root = await fs.realpath(dir);
  const server: Server = createServer(async (req, res) => {
    let pathname: string;
    try {
      pathname = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
    } catch {
      res.writeHead(400).end("bad request");
      return;
    }
    const candidates = [pathname, path.posix.join(pathname, "index.html"), pathname + ".html"];
    for (const c of candidates) {
      const file = await insideDir(root, path.join(root, c));
      if (!file) continue;
      const stat = await fs.stat(file).catch(() => null);
      if (stat?.isFile()) {
        if (c !== pathname && !pathname.endsWith("/") && c.endsWith("/index.html")) {
          res.writeHead(301, { location: pathname + "/" }).end();
          return;
        }
        res.writeHead(200, {
          "content-type": MIME[path.extname(file).toLowerCase()] ?? "application/octet-stream",
        });
        res.end(await fs.readFile(file));
        return;
      }
    }
    res.writeHead(404).end("not found");
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  const port = (server.address() as { port: number }).port;
  return {
    origin: `http://127.0.0.1:${port}`,
    stop: () => new Promise<void>((r) => server.close(() => r())),
  };
}

async function startProcess([bin, ...args]: string[], cwd: string) {
  const port = 40000 + Math.floor(Math.random() * 10000);
  const child = spawn(bin!, args, {
    cwd,
    env: { ...process.env, PORT: String(port), NODE_ENV: "production", HOST: "127.0.0.1" },
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });
  let log = "";
  child.stdout.on("data", (d) => (log += d));
  child.stderr.on("data", (d) => (log += d));
  const origin = `http://127.0.0.1:${port}`;
  const kill = () => {
    try {
      process.kill(-child.pid!, "SIGTERM");
    } catch {}
  };
  process.once("exit", kill);
  for (let i = 0; i < 120; i++) {
    if (child.exitCode !== null) throw new Error(`server exited:\n${log}`);
    const ok = await fetch(origin).then(
      (r) => r.status < 500,
      () => false,
    );
    if (ok) break;
    if (i === 119) {
      kill();
      throw new Error(`server never came up:\n${log}`);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return { origin, stop: async () => kill() };
}

type Resource = { url: string; status: number; type: string; body: Buffer };

async function crawl(origin: string, seeds: string[]) {
  const site = new Map<string, Resource>();
  const queue = [...seeds];
  const seen = new Set<string>();
  while (queue.length) {
    const p = queue.shift()!;
    if (seen.has(p)) continue;
    seen.add(p);
    const res = await fetch(origin + p, {
      redirect: "manual",
      signal: AbortSignal.timeout(15000),
    }).catch(() => null);
    if (!res) continue;
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      const target = loc ? internalPath(loc, origin + p, origin) : null;
      if (target) {
        site.set(p, { url: p, status: 301, type: "redirect", body: Buffer.from(target) });
        queue.push(target);
      }
      continue;
    }
    if (!res.ok) {
      console.log(`  ✗ ${res.status} ${p}`);
      continue;
    }
    const type = res.headers.get("content-type") ?? "";
    const body = Buffer.from(await res.arrayBuffer());
    site.set(p, { url: p, status: res.status, type, body });
    const text = body.toString("utf8");
    const refs = type.includes("html") ? htmlRefs(text) : type.includes("css") ? cssRefs(text) : [];
    for (const ref of refs) {
      const target = internalPath(ref, origin + p, origin);
      if (target && !seen.has(target)) queue.push(target);
    }
  }
  console.log(`  crawled ${site.size} files`);
  return site;
}

const ATTR_RE = /(\s(?:href|src|poster|action|data-src))\s*=\s*("([^"]*)"|'([^']*)')/gi;
const SRCSET_RE = /(\ssrcset)\s*=\s*("([^"]*)"|'([^']*)')/gi;
const CSS_URL_RE = /url\(\s*(['"]?)([^'")]+)\1\s*\)|@import\s+(['"])([^'"]+)\3/gi;

const META_REFRESH_RE =
  /(<meta\b[^>]*http-equiv=["']?refresh["']?[^>]*content=["']\s*\d+\s*;\s*url=)(['"]?)([^"'>]+)\2/gi;

function htmlRefs(html: string) {
  const refs: string[] = [];
  const noScripts = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (tag) =>
    tag.replace(/>[\s\S]*<\/script>$/i, "></script>"),
  );
  for (const m of noScripts.matchAll(ATTR_RE)) refs.push(m[3] ?? m[4] ?? "");
  for (const m of noScripts.matchAll(SRCSET_RE))
    for (const part of (m[3] ?? m[4] ?? "").split(","))
      refs.push(part.trim().split(/\s+/)[0] ?? "");
  for (const m of noScripts.matchAll(/style\s*=\s*"([^"]*)"/gi)) refs.push(...cssRefs(m[1] ?? ""));
  for (const m of noScripts.matchAll(META_REFRESH_RE)) refs.push(m[3] ?? "");
  for (const m of noScripts.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi))
    refs.push(...cssRefs(m[1] ?? ""));
  return refs;
}

function cssRefs(css: string) {
  return [...css.matchAll(CSS_URL_RE)].map((m) => m[2] ?? m[4] ?? "");
}

/** Resolve a reference to a crawlable path on the era's own server, or null. */
function internalPath(ref: string, base: string, origin: string): string | null {
  ref = ref.trim().replace(/&amp;/g, "&");
  if (!ref || /^(#|mailto:|tel:|javascript:|data:|about:|sms:)/i.test(ref)) return null;
  let u: URL;
  try {
    u = new URL(ref, base);
  } catch {
    return null;
  }
  const o = new URL(origin);
  const isSelf = u.host === o.host || (SELF_HOSTS.has(u.hostname) && /^https?:$/.test(u.protocol));
  if (!isSelf) return null;
  let p = u.pathname.replace(/\/{2,}/g, "/");
  try {
    p = encodeURI(decodeURI(p));
  } catch {}
  return p;
}

// --- Writing -----------------------------------------------------------------

function fileFor(urlPath: string, isHtml: boolean) {
  let p = decodeURI(urlPath);
  if (p.endsWith("/")) p += "index.html";
  else if (isHtml && !/\.html?$/i.test(p)) p += "/index.html";
  return p.replace(/^\//, "");
}

function relativeUrl(fromFile: string, toFile: string) {
  let rel = path.posix.relative(path.posix.dirname("/" + fromFile), "/" + toFile);
  if (!rel.startsWith(".")) rel = "./" + rel;
  return encodeURI(rel);
}

async function writeSite(site: Map<string, Resource>, out: string, cfg: EraBuild) {
  // Map every crawled URL to the file it'll be saved as.
  const files = new Map<string, string>();
  const resolve = (p: string, depth = 0): string | null => {
    const r = site.get(p);
    if (!r) return null;
    if (r.type === "redirect") return depth > 5 ? null : resolve(r.body.toString(), depth + 1);
    return fileFor(p, r.type.includes("html"));
  };
  for (const p of site.keys()) {
    const f = resolve(p);
    if (f) files.set(p, f);
  }

  const external = new ExternalAssets(out);
  const fontLink = cfg.fonts?.length ? await external.fontShims(cfg.fonts) : null;
  const pages: { path: string; title: string }[] = [];

  for (const [p, r] of site) {
    if (r.type === "redirect") continue;
    // Bundles only reached through modulepreload links are dead weight once scripts are stripped.
    if (cfg.stripAllScripts && r.type.includes("javascript")) continue;
    const file = files.get(p)!;
    const dest = path.join(out, file);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    const origin = "http://archive.invalid";
    const rewrite = (ref: string) => {
      // Already points at something we saved locally.
      if (/^(\.\.?\/)*_archive\//.test(ref)) return null;
      const target = internalPath(ref, origin + p, origin);
      if (target === null) return null;
      const hash = ref.includes("#") ? ref.slice(ref.indexOf("#")) : "";
      const targetFile = files.get(target) ?? MISSING;
      return relativeUrl(file, targetFile) + hash;
    };

    if (r.type.includes("html")) {
      let html = r.body.toString("utf8");
      html = await cleanScripts(html, !!cfg.stripAllScripts, external, file);
      html = await localizeStylesheets(html, external, file);
      html = rewriteHtml(html, rewrite);
      html = injectHead(html, fontLink ? relativeUrl(file, fontLink) : null);
      await fs.writeFile(dest, html);
      const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
      pages.push({ path: "/" + file.replace(/index\.html$/, ""), title: decodeEntities(title) });
    } else if (r.type.includes("css")) {
      let css = r.body.toString("utf8");
      const imports = [
        ...css.matchAll(
          /@import\s*(?:url\(\s*['"]?|['"])((?:https?:)?\/\/fonts\.googleapis\.com[^'")]+)['"]?\s*\)?/gi,
        ),
      ];
      for (const [stmt, href = ""] of imports) {
        const local = await external.googleCss(href);
        css = css.replace(stmt, local ? `@import url("${relativeUrl(file, local)}")` : "");
      }
      await fs.writeFile(dest, rewriteCss(css, rewrite));
    } else if (r.type.includes("javascript")) {
      await fs.writeFile(dest, scrubScript(r.body.toString("utf8")));
    } else {
      await fs.writeFile(dest, r.body);
    }
  }

  await fs.mkdir(path.join(out, path.dirname(MISSING)), { recursive: true });
  await fs.writeFile(path.join(out, MISSING), MISSING_HTML);
  pages.sort((a, b) => (a.path === "/" ? -1 : b.path === "/" ? 1 : a.path.localeCompare(b.path)));
  console.log(`  wrote ${files.size} files, ${pages.length} pages`);
  return pages;
}

const MISSING = "_archive/missing.html";
const MISSING_HTML = `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>Not archived</title>
<style>html{font:16px/1.5 ui-sans-serif,system-ui,sans-serif;color:#52525b;background:#fafafa}body{display:grid;place-items:center;min-height:90vh;margin:0;text-align:center}h1{font-size:18px;color:#18181b;margin:0 0 4px}@media(prefers-color-scheme:dark){html{background:#09090b;color:#a1a1aa}h1{color:#fafafa}}</style>
<div><h1>This page wasn’t in the repo</h1><p>It was linked from this version of the site, but its source never made it into git.</p><p><a href="javascript:history.back()">Go back</a></p></div>`;

function rewriteHtml(html: string, rewrite: (ref: string) => string | null) {
  html = html.replace(ATTR_RE, (all, attr, _q, dq, sq) => {
    const v = dq ?? sq;
    const next = rewrite(v.replace(/&amp;/g, "&"));
    return next === null ? all : `${attr}="${next}"`;
  });
  html = html.replace(SRCSET_RE, (all, attr, _q, dq, sq) => {
    const v: string = dq ?? sq;
    const next = v
      .split(",")
      .map((part) => {
        const [u = "", ...rest] = part.trim().split(/\s+/);
        return [rewrite(u) ?? u, ...rest].join(" ");
      })
      .join(", ");
    return `${attr}="${next}"`;
  });
  html = html.replace(
    /(style\s*=\s*")([^"]*)(")/gi,
    (_a, pre, css, post) => pre + rewriteCss(css, rewrite) + post,
  );
  html = html.replace(
    /(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi,
    (_a, pre, css, post) => pre + rewriteCss(css, rewrite) + post,
  );
  html = html.replace(META_REFRESH_RE, (all, pre, q, ref) => {
    const next = rewrite(ref);
    return next === null ? all : `${pre}${q}${next}${q}`;
  });
  // Links that leave the archive open in a new tab instead of inside the frame.
  html = html.replace(/<a\b([^>]*)>/gi, (tag, attrs: string) => {
    const href = attrs.match(/href\s*=\s*["']([^"']*)["']/i)?.[1] ?? "";
    if (!/^(https?:)?\/\//i.test(href)) return tag;
    const cleaned = attrs.replace(/\s(target|rel)\s*=\s*("[^"]*"|'[^']*'|\S+)/gi, "");
    return `<a${cleaned} target="_blank" rel="noopener noreferrer">`;
  });
  // http:// iframes and images are blocked on https pages.
  html = html.replace(/(\ssrc=["'])http:\/\//gi, "$1https://");
  return html;
}

function rewriteCss(css: string, rewrite: (ref: string) => string | null) {
  return css.replace(CSS_URL_RE, (all, q, u, iq, iu) => {
    if (u !== undefined) {
      const next = rewrite(u);
      return next === null ? all : `url(${q}${next}${q})`;
    }
    const next = rewrite(iu);
    return next === null ? all : `@import ${iq}${next}${iq}`;
  });
}

async function cleanScripts(
  html: string,
  stripAll: boolean,
  external: ExternalAssets,
  file: string,
) {
  html = html.replace(/<!--\[if[^\]]*\]>[\s\S]*?<!\[endif\]-->/gi, "");
  html = html.replace(/<iframe\b[^>]*platform\.twitter\.com[\s\S]*?<\/iframe>/gi, "");
  if (stripAll) {
    html = html.replace(/<link\b[^>]*rel=["']?modulepreload[^>]*>/gi, "");
    html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    return inlineSuspenseBoundaries(html);
  }
  const tags = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  for (const [tag, attrs = "", body = ""] of tags) {
    const src = attrs.match(/src\s*=\s*["']([^"']+)["']/i)?.[1];
    let replacement: string | null = tag;
    if (src && DROP_SCRIPT.some((re) => re.test(src))) replacement = "";
    else if (!src && DROP_INLINE_SCRIPT.some((re) => re.test(body))) replacement = "";
    else if (src && LOCALIZE_SCRIPT.some((re) => re.test(src))) {
      const local = await external.save(src, "vendor");
      replacement = local ? tag.replace(src, relativeUrl(file, local)) : "";
    }
    if (replacement !== tag) html = html.replace(tag, replacement ?? "");
  }
  return html;
}

/** Old site scripts: drop the analytics loader and blank out long-dead API tokens. */
function scrubScript(js: string) {
  return (
    js
      .replace(/var _gauges = _gauges \|\| \[\];\s*\(function\(\) \{[\s\S]*?\}\)\(\);/g, "")
      // The 2015 Instagram feed would still fire a JSONP request to a dead API.
      .replace(/\bfeed\.run\(\);/g, "")
      .replace(/((?:accessToken|sdk_key)\s*:\s*)(['"])[^'"]*\2/g, "$1$2$2")
  );
}

/**
 * React streams Suspense content as <div hidden id="S:n"> and swaps it in with
 * an inline script. With scripts gone, do the swap here.
 */
function inlineSuspenseBoundaries(html: string) {
  for (;;) {
    const start = html.match(/<div hidden(?:="")? id="S:(\d+)">/);
    if (!start || start.index === undefined) return html;
    const open = start.index + start[0].length;
    let depth = 1;
    const tag = /<\/?div\b[^>]*>/gi;
    tag.lastIndex = open;
    let end = -1;
    for (let m; (m = tag.exec(html));) {
      depth += m[0][1] === "/" ? -1 : 1;
      if (depth === 0) {
        end = m.index;
        break;
      }
    }
    if (end < 0) return html;
    const content = html.slice(open, end);
    html = html.slice(0, start.index) + html.slice(end + "</div>".length);
    const fallback = new RegExp(
      `<!--\\$\\?--><template id="B:${start[1]}"></template>[\\s\\S]*?<!--/\\$-->`,
    );
    html = fallback.test(html) ? html.replace(fallback, () => content) : html;
  }
}

async function localizeStylesheets(html: string, external: ExternalAssets, file: string) {
  const links = [
    ...html.matchAll(
      /<link\b[^>]*href=["']((?:https?:)?\/\/fonts\.googleapis\.com[^"']+)["'][^>]*>/gi,
    ),
  ];
  for (const [tag, href = ""] of links) {
    const local = await external.googleCss(href.replace(/&amp;/g, "&"));
    html = html.replace(tag, local ? tag.replace(href, relativeUrl(file, local)) : "");
  }
  // CSS files are handled the same way when they @import Google Fonts.
  return html;
}

function injectHead(html: string, fontCss: string | null) {
  const tags = [
    /<meta[^>]+charset/i.test(html) ? "" : `<meta charset="utf-8">`,
    `<meta name="robots" content="noindex">`,
    fontCss ? `<link rel="stylesheet" href="${fontCss}">` : "",
  ].join("");
  if (/<head\b[^>]*>/i.test(html)) return html.replace(/<head\b[^>]*>/i, (m) => m + tags);
  return tags + html;
}

function decodeEntities(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&rsquo;|&#8217;/g, "’")
    .replace(/&mdash;/g, "—")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/** Downloads third-party assets into the era's _archive/ folder. */
class ExternalAssets {
  private cache = new Map<string, string | null>();
  private out: string;
  constructor(out: string) {
    this.out = out;
  }

  async save(url: string, folder: string): Promise<string | null> {
    const abs = url.startsWith("//") ? "https:" + url : url.replace(/^http:/, "https:");
    if (this.cache.has(abs)) return this.cache.get(abs)!;
    const res = await fetch(abs, { headers: { "user-agent": BROWSER_UA } }).catch(() => null);
    let local: string | null = null;
    if (res?.ok) {
      const name = new URL(abs).pathname.split("/").filter(Boolean).slice(-3).join("-");
      local = `_archive/${folder}/${name}`;
      await fs.mkdir(path.join(this.out, "_archive", folder), { recursive: true });
      await fs.writeFile(path.join(this.out, local), Buffer.from(await res.arrayBuffer()));
    } else {
      console.log(`  ✗ could not fetch ${abs}`);
    }
    this.cache.set(abs, local);
    return local;
  }

  /** Save a Google Fonts stylesheet and its font files, optionally renaming families. */
  async googleCss(url: string, rename?: [string, string]): Promise<string | null> {
    const abs = url.startsWith("//") ? "https:" + url : url.replace(/^http:/, "https:");
    const key = abs + (rename?.join("→") ?? "");
    if (this.cache.has(key)) return this.cache.get(key)!;
    let res = await fetch(abs, { headers: { "user-agent": BROWSER_UA } }).catch(() => null);
    if (res?.status === 400) {
      // Today's API rejects "ital,wght@100..900"; it wants a tuple per style.
      const fixed = abs.replace(/ital,wght@(\d+\.\.\d+)/g, "ital,wght@0,$1;1,$1");
      res = await fetch(fixed, { headers: { "user-agent": BROWSER_UA } }).catch(() => null);
    }
    if (!res?.ok) {
      console.log(`  ✗ could not fetch ${abs}`);
      this.cache.set(key, null);
      return null;
    }
    let css = await res.text();
    if (rename) css = css.replaceAll(`font-family: '${rename[0]}'`, `font-family: '${rename[1]}'`);
    for (const [, fontUrl = ""] of css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)) {
      const local = await this.save(fontUrl, "fonts");
      if (local) css = css.replaceAll(fontUrl, path.posix.basename(local));
    }
    const name = `_archive/fonts/${(rename?.[1] ?? new URL(abs).searchParams.get("family") ?? "fonts").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.css`;
    await fs.mkdir(path.join(this.out, "_archive/fonts"), { recursive: true });
    await fs.writeFile(path.join(this.out, name), css);
    this.cache.set(key, name);
    return name;
  }

  async fontShims(shims: FontShim[]) {
    const parts: string[] = [
      "/* Typekit kits from this era are gone; these Google Fonts stand in for them. */",
    ];
    for (const shim of shims) {
      const family = shim.google.split(":")[0] ?? "";
      const url = `https://fonts.googleapis.com/css2?family=${shim.google.replace(/ /g, "+")}&display=swap`;
      const local = await this.googleCss(url, [family, shim.family]);
      if (local) parts.push(`@import url("${path.posix.basename(local)}");`);
    }
    const file = "_archive/fonts/shims.css";
    await fs.mkdir(path.join(this.out, "_archive/fonts"), { recursive: true });
    await fs.writeFile(path.join(this.out, file), parts.join("\n") + "\n");
    return file;
  }
}

// --- Helpers -----------------------------------------------------------------

async function listFiles(dir: string, recursive = false): Promise<string[]> {
  if (!existsSync(dir)) return [];
  const entries = await fs.readdir(dir, { recursive, withFileTypes: true });
  return entries
    .filter((e) => e.isFile())
    .map((e) => path.relative(dir, path.join(e.parentPath, e.name)))
    .sort();
}

function run(cmd: string[], cwd: string, env: Record<string, string> = {}) {
  console.log(`  $ ${cmd.join(" ")}`);
  return new Promise<void>((resolve, reject) => {
    const child = spawn(cmd[0]!, cmd.slice(1), {
      cwd,
      env: { ...process.env, ...env },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let log = "";
    child.stdout.on("data", (d) => (log += d));
    child.stderr.on("data", (d) => (log += d));
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd.join(" ")} failed:\n${log.slice(-4000)}`)),
    );
  });
}

/** 2023 lockfiles point Font Awesome at its private registry; use the public one. */
async function fixFontAwesomeLockfile(dir: string) {
  const file = path.join(dir, "package-lock.json");
  const lock = JSON.parse(await fs.readFile(file, "utf8"));
  for (const [key, pkg] of Object.entries<any>(lock.packages ?? {})) {
    if (!pkg.resolved?.includes("fontawesome.com")) continue;
    const name = key.replace(/^.*node_modules\//, "");
    pkg.resolved = `https://registry.npmjs.org/${name}/-/${name.split("/")[1]}-${pkg.version}.tgz`;
  }
  await fs.writeFile(file, JSON.stringify(lock, null, 2));
}

await main();
