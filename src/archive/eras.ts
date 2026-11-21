/**
 * Every version of garand.me (and anthonygarand.com before it) that lives in
 * this repo's git history. `scripts/archive/build.ts` uses this list to
 * rebuild each version and save a static copy to `public/archive-sites/<slug>/`,
 * and the `/archive` route uses it to render the timeline.
 */

export type EraKind = "jekyll" | "static" | "remix" | "tanstack" | "live";

export type Era = {
  slug: string;
  /** Short name shown on the timeline */
  name: string;
  /** ISO date the version first shipped (first commit of the design) */
  start: string;
  /** ISO date of the snapshot that was archived (last commit before the next design) */
  end: string;
  /** Commit the snapshot was built from */
  commit: string;
  /** Branch the commit lives on */
  branch: "legacy" | "main";
  kind: EraKind;
  domain: string;
  stack: string[];
  summary: string;
  /** Things that no longer work, called out in the viewer */
  notes?: string[];
};

export const ERAS: Era[] = [
  {
    slug: "2011-notebook",
    name: "The Notebook",
    start: "2011-08-18",
    end: "2011-09-03",
    commit: "c8f6b86",
    branch: "legacy",
    kind: "jekyll",
    domain: "anthonygarand.com",
    stack: ["Jekyll", "Sass", "Muli"],
    summary:
      "The first GitHub Pages site: “The Notebook of Anthony Garand”. Posts on the left, the name and a grid of links on the right.",
    notes: ["Rebuilt from the original Jekyll templates and posts."],
  },
  {
    slug: "2011-version-two",
    name: "Version Two",
    start: "2011-09-10",
    end: "2011-10-20",
    commit: "0d06f59",
    branch: "legacy",
    kind: "jekyll",
    domain: "anthonygarand.com",
    stack: ["Jekyll", "Compass", "Mensch"],
    summary:
      "“Version……. TWO.” A yellow logo tab, a horizontal nav, Open Sans, and articles, recent work and an about page.",
    notes: [
      "Rebuilt from the original Jekyll templates and posts.",
      "The Twitter follow button is gone.",
    ],
  },
  {
    slug: "2011-new-version",
    name: "Textured",
    start: "2011-10-21",
    end: "2011-12-25",
    commit: "f853dc0",
    branch: "legacy",
    kind: "static",
    domain: "anthonygarand.com",
    stack: ["Hand-written HTML", "Compass", "FitText", "jQuery"],
    summary:
      "Off Jekyll and onto hand-written pages: a noisy paper texture, wide-tracked headings, photo headers on posts, plus projects and experiments.",
    notes: ["Typekit fonts are substituted with similar Google Fonts."],
  },
  {
    slug: "2012-v3",
    name: "Site V3",
    start: "2012-02-01",
    end: "2012-11-15",
    commit: "043adf9",
    branch: "legacy",
    kind: "static",
    domain: "anthonygarand.com",
    stack: ["Hand-written HTML", "Sass", "Typekit"],
    summary:
      "Launched with “Graceful Improvements with CSS3”: a black monogram, a left-hand nav and a serif reading layout.",
    notes: ["Typekit fonts are substituted with similar Google Fonts."],
  },
  {
    slug: "2013-hey",
    name: "Hey,",
    start: "2013-08-01",
    end: "2015-04-14",
    commit: "fe0605c",
    branch: "main",
    kind: "static",
    domain: "garand.me",
    stack: ["Hand-written HTML", "Compass", "jQuery", "500px API"],
    summary:
      "The move to garand.me. A full-bleed photo, “Hey, I’m Anthony Garand”, and a photo grid pulled from 500px. Writing moved to “Thoughts”.",
    notes: [
      "The 500px photo grid no longer loads because the API is gone.",
      "Typekit fonts are substituted with similar Google Fonts.",
    ],
  },
  {
    slug: "2015-responsive",
    name: "Responsive",
    start: "2015-08-30",
    end: "2017-07-11",
    commit: "f06a673",
    branch: "main",
    kind: "static",
    domain: "garand.me",
    stack: ["Hand-written HTML", "Gulp", "Sass", "Instafeed"],
    summary:
      "A responsive rebuild with Gulp: a black-and-white portrait, a short intro and an Instagram grid.",
    notes: [
      "The Instagram grid no longer loads.",
      "Typekit fonts are substituted with similar Google Fonts.",
    ],
  },
  {
    slug: "2018-dark-mode",
    name: "Dark Mode",
    start: "2018-12-03",
    end: "2019-10-10",
    commit: "27e6d00",
    branch: "main",
    kind: "static",
    domain: "garand.me",
    stack: ["Hand-written HTML", "Sass"],
    summary:
      "😎 Dark mode: the same one-screen intro, now white and gold on black over a new photo.",
    notes: [
      "The avatar was hot-linked from Instagram and is gone. An older photo from the repo stands in, darkened so the text stays readable.",
      "Typekit fonts are substituted with similar Google Fonts.",
    ],
  },
  {
    slug: "2023-remix",
    name: "Remix",
    start: "2023-01-03",
    end: "2023-04-25",
    commit: "fc90121",
    branch: "main",
    kind: "remix",
    domain: "garand.me",
    stack: ["Remix 1", "React 18", "Tailwind CSS 3", "Font Awesome", "Fly.io"],
    summary:
      "“refactor: move to remix!” A sidebar app with articles, thoughts, projects, snippets, about and uses pages.",
    notes: ["Saved as static HTML, so client-side JavaScript is turned off."],
  },
  {
    slug: "2023-clean",
    name: "Clean",
    start: "2023-11-07",
    end: "2024-11-24",
    commit: "e251353",
    branch: "main",
    kind: "remix",
    domain: "garand.me",
    stack: ["Remix 2", "Tailwind CSS 3", "Switzer"],
    summary:
      "One clean page set in Switzer: a title, an “Available for work” badge, and rows for writing and projects.",
    notes: [
      "The gray bars are what shipped. Writing and projects were still placeholders.",
      "Saved as static HTML, so client-side JavaScript is turned off.",
    ],
  },
  {
    slug: "2025-tanstack",
    name: "TanStack",
    start: "2025-06-23",
    end: "2025-11-15",
    commit: "db6ae6f",
    branch: "main",
    kind: "tanstack",
    domain: "garand.me",
    stack: ["TanStack Start", "React 19", "Tailwind CSS 4"],
    summary:
      "A rebuild on TanStack Start: a small avatar, a roles timeline and a plain list of past work, with dark mode.",
    notes: ["Saved as static HTML, so client-side JavaScript is turned off."],
  },
  {
    slug: "now",
    name: "Now",
    start: "2026-03-13",
    end: "2026-07-30",
    commit: "2ade9c0",
    branch: "main",
    kind: "live",
    domain: "garand.me",
    stack: ["TanStack Start", "React 19", "Tailwind CSS 4", "Innovator Grotesk"],
    summary:
      "The current site: past work as logo cards with hover shimmer, set in Innovator Grotesk.",
  },
];

export const ARCHIVE_BASE = "/archive-sites";

/** URL the viewer's iframe loads for a path within an era. */
export function eraFrameUrl(era: Era, path = "/") {
  // The live site is a single page; never point the frame anywhere else.
  if (era.kind === "live") return "/";
  let clean = path.replace(/^\/+/, "");
  if (clean === "" || clean.endsWith("/")) clean += "index.html";
  return `${ARCHIVE_BASE}/${era.slug}/${clean}`;
}

/** Inverse of eraFrameUrl: the era-relative path for a URL loaded in the iframe. */
export function eraPathFromFrame(era: Era, pathname: string) {
  const prefix = `${ARCHIVE_BASE}/${era.slug}`;
  let p =
    era.kind === "live"
      ? pathname
      : pathname.startsWith(prefix)
        ? pathname.slice(prefix.length)
        : pathname;
  p = p.replace(/(^|\/)index\.html$/, "$1");
  return p.startsWith("/") ? p : `/${p}`;
}
