import { createFileRoute, Link } from "@tanstack/react-router";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import { ARCHIVE_BASE, ERAS, type Era } from "../archive/eras";

export const Route = createFileRoute("/archive/")({
  head: () => ({
    meta: [
      { title: "Archive · Anthony Garand" },
      {
        name: "description",
        content:
          "Every version of Anthony Garand’s personal site since 2011, rebuilt from git history.",
      },
    ],
  }),
  component: ArchiveIndex,
});

const monthYear = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function liveRange(index: number) {
  const era = ERAS[index]!;
  const next = ERAS[index + 1];
  const from = monthYear.format(Date.parse(era.start));
  return `${from} – ${next ? monthYear.format(Date.parse(next.start)) : "now"}`;
}

function ArchiveIndex() {
  const first = ERAS[0]!;
  const years = `${first.start.slice(0, 4)}–${ERAS[ERAS.length - 1]!.start.slice(0, 4)}`;

  return (
    <div className="min-h-screen bg-white px-6 py-8 text-gray-900 sm:px-10 sm:py-10 md:py-12 lg:py-24 dark:bg-gray-900 dark:text-gray-50">
      <div className="mx-auto w-full max-w-6xl">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <LuArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Anthony Garand
        </Link>

        <header className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h1 className="text-3xl leading-tight font-medium tracking-tight">Archive</h1>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Every version of this site from {years}.
            </p>
          </div>
          <Link
            to="/archive/$era"
            params={{ era: first.slug }}
            className="group inline-flex flex-none items-center gap-2 self-start rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 sm:self-auto dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
          >
            Start in {first.start.slice(0, 4)}
            <LuArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </header>

        <ol className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {ERAS.map((era, index) => (
            <li key={era.slug}>
              <EraCard era={era} range={liveRange(index)} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function EraCard({ era, range }: { era: Era; range: string }) {
  return (
    <Link to="/archive/$era" params={{ era: era.slug }} className="group block">
      <div className="relative aspect-[8/5] overflow-hidden rounded-lg bg-gray-100 transition-shadow duration-300 group-hover:shadow-[0_18px_40px_-20px_rgb(0_0_0/0.35)] dark:bg-gray-800">
        <img
          src={`${ARCHIVE_BASE}/_thumbs/${era.slug}.jpg`}
          alt={`The ${era.name} version of the site`}
          loading="lazy"
          decoding="async"
          className="size-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.35)] mix-blend-soft-light dark:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.35)]"
        />
        {era.kind === "live" ? (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2 py-0.5 text-xs text-gray-700 shadow-sm backdrop-blur">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Live
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h2 className="font-medium">
          <span className="text-gray-400 tabular-nums dark:text-gray-500">
            {era.start.slice(0, 4)}
          </span>{" "}
          {era.name}
        </h2>
        <span className="flex-none text-xs text-gray-500 tabular-nums dark:text-gray-400">
          {range}
        </span>
      </div>
      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {era.summary}
      </p>
    </Link>
  );
}
