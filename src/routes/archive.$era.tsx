import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { cva } from "cva";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  LuArrowLeft,
  LuArrowRight,
  LuChevronLeft,
  LuChevronRight,
  LuExternalLink,
  LuGitCommitHorizontal,
  LuInfo,
  LuMonitor,
  LuRotateCw,
  LuSmartphone,
} from "react-icons/lu";
import { ARCHIVE_BASE, ERAS, type Era, eraFrameUrl, eraPathFromFrame } from "../archive/eras";
import pagesBySlug from "../archive/pages.gen.json";

type Search = { path?: string };

export const Route = createFileRoute("/archive/$era")({
  beforeLoad: ({ params }) => {
    if (!ERAS.some((e) => e.slug === params.era)) throw notFound();
  },
  validateSearch: (search: Record<string, unknown>): Search => ({
    // Same-site paths only: "//host" or "/\\host" would load another origin in the frame.
    path:
      typeof search.path === "string" && /^\/(?![/\\])/.test(search.path) ? search.path : undefined,
  }),
  head: ({ params }) => {
    const era = ERAS.find((e) => e.slug === params.era);
    const title = era ? `${era.name} (${era.start.slice(0, 4)}) · Archive` : "Archive";
    return {
      meta: [
        { title: `${title} · Anthony Garand` },
        {
          name: "description",
          content:
            "Every version of Anthony Garand’s personal site since 2011, rebuilt from git history.",
        },
      ],
    };
  },
  component: ArchivePage,
});

type Page = { path: string; title: string };
const PAGES = pagesBySlug as Record<string, Page[]>;
const REPO_URL = "https://github.com/garand/garand";
const DESKTOP_WIDTH = 1280;
const PHONE_WIDTH = 390;

const TIMELINE_START = Date.parse("2011-07-01");
const TIMELINE_END = Date.parse("2026-12-31");
const YEARS = Array.from({ length: 2026 - 2011 + 1 }, (_, i) => 2011 + i);

/** The era at an index, wrapping around at either end. */
function eraAt(index: number): Era {
  return ERAS[((index % ERAS.length) + ERAS.length) % ERAS.length]!;
}

function liveRange(index: number) {
  const era = eraAt(index);
  const next = ERAS[index + 1];
  // The current version runs to the end of the timeline rather than Date.now(),
  // which would differ between the server render and hydration.
  return { from: Date.parse(era.start), to: next ? Date.parse(next.start) : TIMELINE_END };
}

const monthYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const fullDate = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatRange(index: number) {
  const { from, to } = liveRange(index);
  const end = index === ERAS.length - 1 ? "now" : monthYear.format(to);
  return `${monthYear.format(from)} – ${end}`;
}

function pageLabel(page: Page) {
  const title = page.title
    .replace(/\s*[|–—-]\s*Anthony Garand\s*$/i, "")
    .replace(/^\s*[|–—-]\s*/, "")
    .trim();
  if (page.path === "/") return "Home";
  if (title && title !== "Anthony Garand") return title;
  const last = page.path.split("/").filter(Boolean).pop() ?? page.path;
  return last.replace(/[-_]+/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

function pageDepth(path: string) {
  return Math.max(0, path.split("/").filter(Boolean).length - 1);
}

type Viewport = "desktop" | "phone";

function ArchivePage() {
  const search = Route.useSearch();
  const params = Route.useParams();
  const navigate = useNavigate({ from: "/archive/$era" });

  const selectedIndex = Math.max(
    0,
    ERAS.findIndex((e) => e.slug === params.era),
  );
  const era = eraAt(selectedIndex);
  const pages = PAGES[era.slug] ?? [{ path: "/", title: "" }];

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [initialSrc] = useState(() => eraFrameUrl(era, search.path ?? "/"));
  const [loading, setLoading] = useState(true);
  const [framePath, setFramePath] = useState(search.path ?? "/");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [showInfo, setShowInfo] = useState(false);
  const loadedEra = useRef(era.slug);

  // Default to the phone viewport on small screens.
  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) setViewport("phone");
  }, []);

  const loadInFrame = useCallback((url: string, mode: "replace" | "push") => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    setLoading(true);
    // Era switches use replace() so the frame's Back button stays within a version.
    if (mode === "replace") win.location.replace(url);
    else win.location.assign(url);
  }, []);

  // Opened inside another viewer (e.g. via the live site's own archive link):
  // take over the top window instead of nesting.
  useEffect(() => {
    if (window.top && window.top !== window.self) {
      window.top.location.href = window.location.href;
    }
  }, []);

  // Keep the frame in step when the URL changes from outside the frame, e.g.
  // the browser's Back button or a link to another ?era=.
  useEffect(() => {
    if (era.slug === loadedEra.current) return;
    loadedEra.current = era.slug;
    setFramePath(search.path ?? "/");
    loadInFrame(eraFrameUrl(era, search.path ?? "/"), "replace");
  }, [era, search.path, loadInFrame]);

  const selectEra = useCallback(
    (index: number) => {
      const next = eraAt(index);
      if (next.slug === loadedEra.current) return;
      loadedEra.current = next.slug;
      setFramePath("/");
      void navigate({ to: "/archive/$era", params: { era: next.slug }, search: {}, replace: true });
      loadInFrame(eraFrameUrl(next, "/"), "replace");
    },
    [loadInFrame, navigate],
  );

  const openPage = useCallback(
    (path: string) => {
      loadInFrame(eraFrameUrl(era, path), "push");
    },
    [era, loadInFrame],
  );

  const onFrameLoad = useCallback(() => {
    setLoading(false);
    let pathname: string;
    try {
      pathname = iframeRef.current?.contentWindow?.location.pathname ?? "/";
    } catch {
      return;
    }
    // Work out the era from the URL itself, since the frame's back button can
    // walk into pages from a version that was showing earlier.
    const current =
      ERAS.find((e) => e.kind !== "live" && pathname.startsWith(`${ARCHIVE_BASE}/${e.slug}/`)) ??
      ERAS.find((e) => e.kind === "live")!;
    loadedEra.current = current.slug;
    const path = eraPathFromFrame(current, pathname);
    setFramePath(path);
    void navigate({
      to: "/archive/$era",
      params: { era: current.slug },
      search: { path: path === "/" ? undefined : path },
      replace: true,
    });
  }, [navigate]);

  // Some browsers fire load before React attaches the handler on first paint.
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (doc?.readyState === "complete" && doc.URL !== "about:blank") onFrameLoad();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        selectEra(ERAS.findIndex((e) => e.slug === loadedEra.current) - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        selectEra(ERAS.findIndex((e) => e.slug === loadedEra.current) + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectEra]);

  const frameHistory = (direction: "back" | "forward" | "reload") => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    if (direction === "reload") {
      setLoading(true);
      win.location.reload();
    } else {
      win.history[direction]();
    }
  };

  const frameUrl = eraFrameUrl(era, framePath);

  return (
    <div className="flex h-dvh flex-col bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="flex h-14 flex-none items-center justify-between gap-4 px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-sm">
          <Link
            to="/archive"
            aria-label="Back to all versions"
            className="group -ml-1 inline-flex size-7 flex-none items-center justify-center rounded-md text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <LuArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          </Link>
          <span className="truncate text-zinc-500 dark:text-zinc-400">
            <Link to="/" className="text-zinc-900 hover:underline dark:text-zinc-100">
              Anthony Garand
            </Link>
            <span className="mx-1.5 text-zinc-300 dark:text-zinc-700">/</span>
            <Link
              to="/archive"
              className="hover:text-zinc-900 hover:underline dark:hover:text-zinc-100"
            >
              Archive
            </Link>
          </span>
        </nav>
        <div className="flex items-center gap-1">
          <IconButton label="Previous version (←)" onClick={() => selectEra(selectedIndex - 1)}>
            <LuChevronLeft />
          </IconButton>
          <span className="w-14 text-center text-sm text-zinc-500 tabular-nums dark:text-zinc-400">
            {selectedIndex + 1} / {ERAS.length}
          </span>
          <IconButton label="Next version (→)" onClick={() => selectEra(selectedIndex + 1)}>
            <LuChevronRight />
          </IconButton>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 pb-4 sm:px-6 lg:flex-row lg:gap-6">
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_8px_30px_-12px_rgb(0_0_0/0.18)] dark:bg-zinc-900 dark:shadow-[0_0_0_1px_rgb(255_255_255/0.08)]">
          <div className="flex h-11 flex-none items-center gap-1 border-b border-zinc-200/80 px-2 dark:border-zinc-800">
            <div className="mr-2 ml-1 hidden gap-1.5 sm:flex" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <span className="size-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <span className="size-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            </div>
            <IconButton
              label="Back"
              size="sm"
              className="max-sm:hidden"
              onClick={() => frameHistory("back")}
            >
              <LuArrowLeft />
            </IconButton>
            <IconButton
              label="Forward"
              size="sm"
              className="max-sm:hidden"
              onClick={() => frameHistory("forward")}
            >
              <LuArrowRight />
            </IconButton>
            <IconButton label="Reload" size="sm" onClick={() => frameHistory("reload")}>
              <LuRotateCw className={loading ? "animate-spin" : undefined} />
            </IconButton>
            <div className="mx-1 flex h-7 min-w-0 flex-1 items-center rounded-md bg-zinc-100 px-3 text-[13px] dark:bg-zinc-800/80">
              <span className="truncate">
                <span className="text-zinc-900 dark:text-zinc-100">{era.domain}</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {framePath === "/" ? "" : framePath}
                </span>
              </span>
              <span className="ml-auto flex-none pl-3 text-xs text-zinc-400 tabular-nums dark:text-zinc-500">
                {new Date(era.start).getUTCFullYear()}
              </span>
            </div>
            <div className="flex flex-none items-center rounded-md bg-zinc-100 p-0.5 dark:bg-zinc-800/80">
              <ViewportButton
                label="Desktop"
                active={viewport === "desktop"}
                onClick={() => setViewport("desktop")}
              >
                <LuMonitor />
              </ViewportButton>
              <ViewportButton
                label="Phone"
                active={viewport === "phone"}
                onClick={() => setViewport("phone")}
              >
                <LuSmartphone />
              </ViewportButton>
            </div>
            <a
              href={frameUrl}
              target="_blank"
              rel="noreferrer"
              title="Open in a new tab"
              aria-label="Open in a new tab"
              className="inline-flex size-8 flex-none items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              <LuExternalLink className="size-4" />
            </a>
            <IconButton
              label="About this version"
              size="sm"
              className="lg:hidden"
              pressed={showInfo}
              onClick={() => setShowInfo((v) => !v)}
            >
              <LuInfo />
            </IconButton>
          </div>
          <FrameViewport viewport={viewport} loading={loading}>
            <iframe
              ref={iframeRef}
              src={initialSrc}
              onLoad={onFrameLoad}
              title={`${era.name} (${new Date(era.start).getUTCFullYear()})`}
              className="block size-full border-0 bg-white"
            />
          </FrameViewport>
        </main>

        <aside
          className={`${showInfo ? "flex" : "hidden"} max-h-[45dvh] min-h-0 flex-none flex-col overflow-y-auto rounded-xl bg-white p-5 shadow-[0_0_0_1px_rgb(0_0_0/0.06)] lg:flex lg:max-h-none lg:w-80 lg:bg-transparent lg:p-0 lg:shadow-none dark:bg-zinc-900 dark:shadow-[0_0_0_1px_rgb(255_255_255/0.08)] lg:dark:bg-transparent lg:dark:shadow-none`}
        >
          <EraDetails
            era={era}
            index={selectedIndex}
            pages={pages}
            framePath={framePath}
            onOpenPage={openPage}
          />
        </aside>
      </div>

      <Timeline selectedIndex={selectedIndex} onSelect={selectEra} />
    </div>
  );
}

function EraDetails({
  era,
  index,
  pages,
  framePath,
  onOpenPage,
}: {
  era: Era;
  index: number;
  pages: Page[];
  framePath: string;
  onOpenPage: (path: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6 lg:pt-1">
      <div>
        <p className="text-sm text-zinc-500 tabular-nums dark:text-zinc-400">
          {formatRange(index)}
        </p>
        <h1 className="mt-1 text-2xl leading-tight font-medium tracking-tight">{era.name}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
          {era.summary}
        </p>
      </div>

      <ul className="flex flex-wrap gap-1.5">
        {era.stack.map((item) => (
          <li
            key={item}
            className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
          >
            {item}
          </li>
        ))}
      </ul>

      {pages.length > 1 ? (
        <div>
          <h2 className="text-xs font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
            Pages
          </h2>
          <ul className="mt-2 -ml-2 flex flex-col">
            {pages.map((page) => {
              const active = page.path === framePath;
              return (
                <li key={page.path}>
                  <button
                    type="button"
                    onClick={() => onOpenPage(page.path)}
                    aria-current={active ? "page" : undefined}
                    style={{ paddingLeft: `${0.5 + pageDepth(page.path) * 0.875}rem` }}
                    className="w-full truncate rounded-md py-1 pr-2 text-left text-sm text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 aria-[current=page]:font-medium aria-[current=page]:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:aria-[current=page]:text-zinc-100"
                  >
                    {pageLabel(page)}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {era.notes?.length ? (
        <div>
          <h2 className="text-xs font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
            Notes
          </h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm leading-snug text-zinc-500 dark:text-zinc-400">
            {era.notes.map((note) => (
              <li key={note} className="flex gap-2">
                <span
                  aria-hidden="true"
                  className="mt-[0.45em] size-1 flex-none rounded-full bg-zinc-300 dark:bg-zinc-600"
                />
                {note}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <a
        href={`${REPO_URL}/tree/${era.commit}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        <LuGitCommitHorizontal className="size-4" />
        <span>
          <code className="font-mono text-[13px]">{era.commit}</code> on {era.branch} ·{" "}
          {fullDate.format(Date.parse(era.end))}
        </span>
      </a>
    </div>
  );
}

function Timeline({
  selectedIndex,
  onSelect,
}: {
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  const listRef = useRef<HTMLOListElement>(null);
  const span = TIMELINE_END - TIMELINE_START;
  const pct = (t: number) => ((t - TIMELINE_START) / span) * 100;

  useEffect(() => {
    const item = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [selectedIndex]);

  return (
    <nav
      aria-label="Versions"
      className="flex-none border-t border-zinc-200 bg-white/70 dark:border-zinc-800 dark:bg-zinc-900/60"
    >
      <div className="relative mx-4 mt-3 h-6 sm:mx-6" aria-hidden="true">
        <div className="absolute inset-x-0 top-2 h-1 rounded-full bg-zinc-100 dark:bg-zinc-800" />
        {ERAS.map((era, i) => {
          const { from, to } = liveRange(i);
          const selected = i === selectedIndex;
          return (
            <button
              key={era.slug}
              type="button"
              tabIndex={-1}
              onClick={() => onSelect(i)}
              title={`${era.name} · ${formatRange(i)}`}
              className={`absolute top-1.5 h-2 min-w-1.5 rounded-full transition-colors ${
                selected
                  ? "z-10 bg-zinc-900 dark:bg-zinc-100"
                  : "bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-600 dark:hover:bg-zinc-500"
              }`}
              style={{ left: `${pct(from)}%`, width: `calc(${pct(to) - pct(from)}% - 2px)` }}
            />
          );
        })}
        {YEARS.map((year) => (
          <span
            key={year}
            className={`absolute top-4 -translate-x-1/2 text-[10px] text-zinc-400 tabular-nums dark:text-zinc-500 ${
              year % 5 === 0 ? "" : "max-sm:hidden"
            }`}
            style={{ left: `${pct(Date.UTC(year, 0, 1))}%` }}
          >
            {year === 2011 ? "" : year}
          </span>
        ))}
      </div>
      <ol
        ref={listRef}
        className="flex snap-x gap-1 overflow-x-auto px-3 pt-2 pb-3 [scrollbar-width:none] sm:px-5 [&::-webkit-scrollbar]:hidden"
      >
        {ERAS.map((era, i) => {
          const selected = i === selectedIndex;
          return (
            <li key={era.slug} className="flex-1 snap-start">
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={selected ? "true" : undefined}
                className={timelineItem({ selected })}
              >
                <span className="text-xs text-zinc-500 tabular-nums dark:text-zinc-400">
                  {new Date(era.start).getUTCFullYear()}
                </span>
                <span className="truncate text-sm">{era.name}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

const timelineItem = cva(
  "flex w-full min-w-28 flex-col items-start rounded-lg px-3 py-2 text-left transition-colors",
  {
    variants: {
      selected: {
        true: "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 [&>span:first-child]:text-zinc-400 dark:[&>span:first-child]:text-zinc-500",
        false: "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
      },
    },
  },
);

/**
 * Desktop mode renders the page at a real desktop width and scales it down to
 * fit, so fixed-width 2011 layouts look the way they did on a laptop.
 */
function FrameViewport({
  viewport,
  loading,
  children,
}: {
  viewport: Viewport;
  loading: boolean;
  children: React.ReactNode;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style = useMemo(() => {
    if (!size.width) return { width: "100%", height: "100%" };
    if (viewport === "phone") {
      return { width: Math.min(PHONE_WIDTH, size.width), height: "100%" };
    }
    if (size.width >= DESKTOP_WIDTH) return { width: "100%", height: "100%" };
    const scale = size.width / DESKTOP_WIDTH;
    return {
      width: DESKTOP_WIDTH,
      height: size.height / scale,
      transform: `scale(${scale})`,
      transformOrigin: "top left",
    };
  }, [size, viewport]);

  return (
    <div
      ref={outerRef}
      className={`relative min-h-0 flex-1 overflow-hidden ${
        viewport === "phone" ? "flex justify-center bg-zinc-100 dark:bg-zinc-950" : ""
      }`}
    >
      <div
        style={style}
        className={`transition-opacity duration-200 ${loading ? "opacity-40" : "opacity-100"} ${
          viewport === "phone" && size.width > PHONE_WIDTH
            ? "shadow-[0_0_0_1px_rgb(0_0_0/0.06)] dark:shadow-[0_0_0_1px_rgb(255_255_255/0.08)]"
            : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}

const iconButton = cva(
  "inline-flex flex-none items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 aria-pressed:bg-zinc-200/70 aria-pressed:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:aria-pressed:bg-zinc-800 dark:aria-pressed:text-zinc-100 [&>svg]:size-4",
  {
    variants: {
      size: {
        md: "size-9",
        sm: "size-8",
      },
    },
    defaultVariants: { size: "md" },
  },
);

function IconButton({
  label,
  size,
  pressed,
  className,
  onClick,
  children,
}: {
  label: string;
  size?: "md" | "sm";
  pressed?: boolean;
  className?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={iconButton({ size, className })}
    >
      {children}
    </button>
  );
}

function ViewportButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className="inline-flex h-6 w-7 items-center justify-center rounded text-zinc-500 transition-colors hover:text-zinc-900 aria-pressed:bg-white aria-pressed:text-zinc-900 aria-pressed:shadow-sm dark:text-zinc-400 dark:hover:text-zinc-100 dark:aria-pressed:bg-zinc-700 dark:aria-pressed:text-zinc-100 [&>svg]:size-3.5"
    >
      {children}
    </button>
  );
}
