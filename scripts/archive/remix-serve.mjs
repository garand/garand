// Serves an old Remix build on modern Node. remix-serve from 2023 polyfills
// fetch in a way that crashes on Node 26, so this runs the build's request
// handler with Node's built-in Request/Response instead.
// Usage (from the Remix project dir): PORT=1234 node remix-serve.mjs ./build/index.js
import { createServer } from "node:http";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const cwd = process.cwd();
const require = createRequire(path.join(cwd, "package.json"));
const { createRequestHandler } = require("@remix-run/server-runtime");
const mod = await import(
  pathToFileURL(path.resolve(cwd, process.argv[2] ?? "build/index.js")).href
);
const build = mod.default?.routes ? mod.default : mod;
const handle = createRequestHandler(build, "production");
const publicDir = await fs.realpath(path.join(cwd, "public"));
const types = {
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ico": "image/x-icon",
};

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400).end("bad request");
    return;
  }
  const real = await fs.realpath(path.join(publicDir, pathname)).catch(() => null);
  const rel = real ? path.relative(publicDir, real) : "..";
  const file = rel.startsWith("..") || path.isAbsolute(rel) ? null : real;
  if (file && url.pathname !== "/") {
    const stat = await fs.stat(file).catch(() => null);
    if (stat?.isFile()) {
      res.writeHead(200, {
        "content-type": types[path.extname(file).toLowerCase()] ?? "application/octet-stream",
      });
      res.end(await fs.readFile(file));
      return;
    }
  }
  try {
    const response = await handle(new Request(url, { headers: req.headers }));
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error(error);
    res.writeHead(500).end(String(error));
  }
}).listen(Number(process.env.PORT), "127.0.0.1");
