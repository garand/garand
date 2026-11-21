import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Drawer } from "@base-ui/react/drawer";
import { Menu } from "@base-ui/react/menu";
import { cva } from "cva";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  LuArrowLeft,
  LuArrowRight,
  LuChevronLeft,
  LuChevronRight,
  LuChevronsUpDown,
  LuExternalLink,
  LuMonitor,
  LuRotateCw,
  LuSmartphone,
} from "react-icons/lu";
import { ARCHIVE_BASE, ERAS, type Era, eraFrameUrl, eraPathFromFrame } from "../archive/eras";

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

const DESKTOP_WIDTH = 1280;
const PHONE_WIDTH = 390;

const TIMELINE_START = Date.parse("2011-01-01");
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
function formatRange(index: number) {
  const { from, to } = liveRange(index);
  const end = index === ERAS.length - 1 ? "now" : monthYear.format(to);
  return `${monthYear.format(from)} – ${end}`;
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

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [initialSrc] = useState(() => eraFrameUrl(era, search.path ?? "/"));
  const [loading, setLoading] = useState(true);
  const [framePath, setFramePath] = useState(search.path ?? "/");
  const [viewport, setViewport] = useState<Viewport>("desktop");
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
    <div className="flex h-dvh flex-col bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-50">
      <header className="flex h-14 flex-none items-center justify-between gap-4 px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-sm">
          <Link
            to="/archive"
            aria-label="Back to all versions"
            className="group -ml-1 inline-flex size-7 flex-none items-center justify-center rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <LuArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          </Link>
          <span className="truncate text-gray-500 dark:text-gray-400">
            <Link to="/" className="text-gray-900 hover:underline max-sm:hidden dark:text-gray-100">
              Anthony Garand
            </Link>
            <span className="mx-1.5 text-gray-300 max-sm:hidden dark:text-gray-700">/</span>
            <Link
              to="/archive"
              className="hover:text-gray-900 hover:underline dark:hover:text-gray-100"
            >
              Archive
            </Link>
          </span>
        </nav>
        <div className="flex items-center gap-1">
          <IconButton label="Previous version (←)" onClick={() => selectEra(selectedIndex - 1)}>
            <LuChevronLeft />
          </IconButton>
          <span className="w-14 text-center text-sm text-gray-500 tabular-nums dark:text-gray-400">
            {selectedIndex + 1} / {ERAS.length}
          </span>
          <IconButton label="Next version (→)" onClick={() => selectEra(selectedIndex + 1)}>
            <LuChevronRight />
          </IconButton>
        </div>
      </header>

      <Timeline selectedIndex={selectedIndex} onSelect={selectEra} />

      <div className="flex min-h-0 flex-1 flex-col px-3 pb-3 sm:px-6 sm:pb-6">
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_8px_30px_-12px_rgb(0_0_0/0.18)] dark:bg-gray-900 dark:shadow-[0_0_0_1px_rgb(255_255_255/0.08)]">
          <div className="flex h-11 flex-none items-center gap-1 border-b border-gray-200/80 px-2 dark:border-gray-800">
            <div className="mr-2 ml-1 hidden gap-1.5 sm:flex" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
              <span className="size-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
              <span className="size-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
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
            <div className="mx-1 flex h-7 min-w-0 flex-1 items-center rounded-md bg-gray-100 px-3 text-[13px] dark:bg-gray-800/80">
              <span className="truncate">
                <span className="text-gray-900 dark:text-gray-100">{era.domain}</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {framePath === "/" ? "" : framePath}
                </span>
              </span>
              <span className="ml-auto flex-none pl-3 text-xs text-gray-400 tabular-nums dark:text-gray-500">
                {new Date(era.start).getUTCFullYear()}
              </span>
            </div>
            <div className="flex flex-none items-center rounded-md bg-gray-100 p-0.5 dark:bg-gray-800/80">
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
              className="inline-flex size-8 flex-none items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            >
              <LuExternalLink className="size-4" />
            </a>
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
      </div>
    </div>
  );
}

/**
 * The version picker and a to-scale track of how long each version was live.
 * The picker is a menu on larger screens and a bottom drawer on phones.
 */
function Timeline({
  selectedIndex,
  onSelect,
}: {
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  const era = eraAt(selectedIndex);
  const span = TIMELINE_END - TIMELINE_START;
  const pct = (t: number) => ((t - TIMELINE_START) / span) * 100;
  const triggerLabel = (
    <>
      <span className="text-gray-400 tabular-nums dark:text-gray-500">{era.start.slice(0, 4)}</span>
      <span className="truncate font-medium">{era.name}</span>
      <LuChevronsUpDown className="size-3.5 flex-none text-gray-400 dark:text-gray-500" />
    </>
  );

  return (
    <nav
      aria-label="Versions"
      className="flex flex-none items-center gap-3 px-3 pb-3 sm:gap-6 sm:px-6 sm:pb-4"
    >
      <Menu.Root>
        <Menu.Trigger className={`${pickerTrigger} w-48 max-sm:hidden [&>svg]:ml-auto`}>
          {triggerLabel}
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner side="bottom" align="start" sideOffset={6} className="z-50 outline-none">
            <Menu.Popup className="max-h-[min(70dvh,var(--available-height))] w-80 origin-(--transform-origin) overflow-y-auto rounded-xl bg-white p-1 shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_16px_40px_-12px_rgb(0_0_0/0.25)] outline-none transition-[scale,opacity] duration-150 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 dark:bg-gray-900 dark:shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_16px_40px_-12px_rgb(0_0_0/0.6)]">
              {ERAS.map((e, i) => (
                <Menu.Item
                  key={e.slug}
                  onClick={() => onSelect(i)}
                  aria-current={i === selectedIndex ? "true" : undefined}
                  className={eraRow}
                >
                  <EraRowContent era={e} index={i} />
                </Menu.Item>
              ))}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>

      <EraDrawer selectedIndex={selectedIndex} onSelect={onSelect}>
        {triggerLabel}
      </EraDrawer>

      <div className="relative h-9 min-w-0 flex-1" aria-hidden="true">
        {ERAS.map((e, i) => {
          const { from, to } = liveRange(i);
          const selected = i === selectedIndex;
          return (
            <button
              key={e.slug}
              type="button"
              tabIndex={-1}
              onClick={() => onSelect(i)}
              title={`${e.name} · ${formatRange(i)}`}
              className="group absolute top-0 flex h-5 items-center"
              style={{ left: `${pct(from)}%`, width: `calc(${pct(to) - pct(from)}% - 2px)` }}
            >
              <span
                className={`w-full min-w-1.5 rounded-full transition-all ${
                  selected
                    ? "h-2 bg-gray-900 dark:bg-gray-100"
                    : "h-1.5 bg-gray-300 group-hover:h-2 group-hover:bg-gray-400 dark:bg-gray-700 dark:group-hover:bg-gray-500"
                }`}
              />
            </button>
          );
        })}
        {YEARS.map((year) => (
          <span
            key={year}
            className={`pointer-events-none absolute top-5 flex -translate-x-1/2 flex-col items-center gap-0.5 text-[10px] leading-none text-gray-400 tabular-nums dark:text-gray-500 ${
              year % 5 === 0 ? "" : "max-md:hidden"
            }`}
            style={{ left: `${pct(Date.UTC(year, 0, 1))}%` }}
          >
            <span className="h-1 w-px bg-gray-300 dark:bg-gray-700" />
            {year === 2011 ? "" : year}
          </span>
        ))}
      </div>
    </nav>
  );
}

function EraDrawer({
  selectedIndex,
  onSelect,
  children,
}: {
  selectedIndex: number;
  onSelect: (index: number) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger className={`${pickerTrigger} max-w-[45%] sm:hidden`}>
        {children}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-[calc(0.3*(1-var(--drawer-swipe-progress)))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-starting-style:opacity-0 data-swiping:duration-0 supports-[-webkit-touch-callout:none]:absolute" />
        <Drawer.Viewport className="fixed inset-0 flex items-end justify-center">
          <Drawer.Popup className="-mb-12 max-h-[calc(80dvh+3rem)] w-full overflow-y-auto overscroll-contain rounded-t-2xl bg-white px-2 pt-3 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px)+3rem)] text-gray-900 outline-none [transform:translateY(var(--drawer-swipe-movement-y))] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:[transform:translateY(calc(100%-3rem+2px))] data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-starting-style:[transform:translateY(calc(100%-3rem+2px))] data-swiping:select-none dark:bg-gray-900 dark:text-gray-50">
            <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
            <Drawer.Content>
              <Drawer.Title className="px-3 py-2 text-sm font-medium">Versions</Drawer.Title>
              <ol>
                {ERAS.map((e, i) => (
                  <li key={e.slug}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(i);
                        setOpen(false);
                      }}
                      aria-current={i === selectedIndex ? "true" : undefined}
                      className={`${eraRow} w-full py-3`}
                    >
                      <EraRowContent era={e} index={i} />
                    </button>
                  </li>
                ))}
              </ol>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function EraRowContent({ era, index }: { era: Era; index: number }) {
  return (
    <>
      <span className="w-9 flex-none text-gray-400 tabular-nums dark:text-gray-500">
        {era.start.slice(0, 4)}
      </span>
      <span className="min-w-0 flex-1 truncate">{era.name}</span>
      <span className="flex-none text-xs text-gray-400 tabular-nums dark:text-gray-500">
        {formatRange(index)}
      </span>
    </>
  );
}

const pickerTrigger =
  "-ml-3 inline-flex h-9 min-w-0 flex-none items-center gap-2 rounded-md px-3 text-sm text-gray-900 transition-colors outline-none select-none hover:bg-gray-200/70 focus-visible:ring-2 focus-visible:ring-gray-400 data-popup-open:bg-gray-200/70 dark:text-gray-100 dark:hover:bg-gray-800 dark:data-popup-open:bg-gray-800";

const eraRow =
  "flex cursor-default items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 outline-none select-none data-highlighted:bg-gray-100 aria-[current=true]:font-medium aria-[current=true]:text-gray-900 dark:text-gray-300 dark:data-highlighted:bg-gray-800 dark:aria-[current=true]:text-gray-50 active:bg-gray-100 dark:active:bg-gray-800";

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
        viewport === "phone" ? "flex justify-center bg-gray-100 dark:bg-gray-950" : ""
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
  "inline-flex flex-none items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-200/70 hover:text-gray-900 aria-pressed:bg-gray-200/70 aria-pressed:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:aria-pressed:bg-gray-800 dark:aria-pressed:text-gray-100 [&>svg]:size-4",
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
      className="inline-flex h-6 w-7 items-center justify-center rounded text-gray-500 transition-colors hover:text-gray-900 aria-pressed:bg-white aria-pressed:text-gray-900 aria-pressed:shadow-sm dark:text-gray-400 dark:hover:text-gray-100 dark:aria-pressed:bg-gray-700 dark:aria-pressed:text-gray-100 [&>svg]:size-3.5"
    >
      {children}
    </button>
  );
}
