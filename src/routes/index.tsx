import { createFileRoute } from "@tanstack/react-router";
import { cva } from "cva";
import { useEffect, useRef, useState } from "react";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import {
  AmcLogo,
  AmcNetworksLogo,
  CapitalOneLogo,
  ControlEngineeringLogo,
  FacebookLogo,
  GoDaddyLogo,
  IfcLogo,
  MicrosoftLogo,
  PaMediaLogo,
  StadiumLogo,
  SundanceTvLogo,
  type WorkLogoComponent,
  WeTvLogo,
} from "../components/work-logos";

export const Route = createFileRoute("/")({
  component: Component,
});

type PastWorkItem = {
  client: string;
  Logo?: WorkLogoComponent;
  description: string;
  accent: keyof typeof accentStyles;
  contentTone: "light" | "dark";
  bodyTone: "subtle" | "default" | "strong";
};

type CardGridPosition = {
  index: number;
  row: number;
  column: number;
};

function getCardGridPositions(cards: HTMLElement[]) {
  const rows: number[] = [];
  const columns: number[] = [];
  const tolerance = 8;

  const findTrackIndex = (tracks: number[], value: number) => {
    const existingIndex = tracks.findIndex((track) => Math.abs(track - value) <= tolerance);

    if (existingIndex !== -1) {
      return existingIndex;
    }

    tracks.push(value);
    tracks.sort((a, b) => a - b);

    return tracks.findIndex((track) => track === value);
  };

  return cards.map((card, index) => {
    const rect = card.getBoundingClientRect();

    return {
      index,
      row: findTrackIndex(rows, rect.top),
      column: findTrackIndex(columns, rect.left),
    } satisfies CardGridPosition;
  });
}

function getAdjacentCardIndexes(positions: CardGridPosition[], index: number) {
  const referenceCard = positions.find((position) => position.index === index);

  if (!referenceCard) {
    return [];
  }

  return positions
    .filter((position) => {
      const sameRowNeighbor =
        position.row === referenceCard.row &&
        Math.abs(position.column - referenceCard.column) === 1;
      const sameColumnNeighbor =
        position.column === referenceCard.column &&
        Math.abs(position.row - referenceCard.row) === 1;

      return sameRowNeighbor || sameColumnNeighbor;
    })
    .map((position) => position.index);
}

const accentStyles = {
  microsoft: "sm:hover:shadow-brand-microsoft/60 data-[active=true]:shadow-brand-microsoft/60",
  facebook: "sm:hover:shadow-brand-facebook/60 data-[active=true]:shadow-brand-facebook/60",
  godaddy: "sm:hover:shadow-brand-godaddy/55 data-[active=true]:shadow-brand-godaddy/55",
  stadium: "sm:hover:shadow-brand-stadium/60 data-[active=true]:shadow-brand-stadium/60",
  controlEngineering:
    "sm:hover:shadow-brand-control-engineering/55 data-[active=true]:shadow-brand-control-engineering/55",
  paMedia: "sm:hover:shadow-brand-pa-media/55 data-[active=true]:shadow-brand-pa-media/55",
  capitalOne: "sm:hover:shadow-brand-capital-one/55 data-[active=true]:shadow-brand-capital-one/55",
  amcNetworks: "sm:hover:shadow-brand-amc-networks/55 data-[active=true]:shadow-brand-amc-networks/55",
  amc: "sm:hover:shadow-brand-amc/55 data-[active=true]:shadow-brand-amc/55",
  ifc: "sm:hover:shadow-brand-ifc/55 data-[active=true]:shadow-brand-ifc/55",
  weTv: "sm:hover:shadow-brand-we-tv/55 data-[active=true]:shadow-brand-we-tv/55",
  sundanceTv: "sm:hover:shadow-brand-sundance-tv/55 data-[active=true]:shadow-brand-sundance-tv/55",
} as const;

const accentBackgroundStyles = {
  microsoft: "bg-brand-microsoft",
  facebook: "bg-brand-facebook",
  godaddy: "bg-brand-godaddy",
  stadium: "bg-brand-stadium",
  controlEngineering: "bg-brand-control-engineering",
  paMedia: "bg-brand-pa-media",
  capitalOne: "bg-brand-capital-one",
  amcNetworks: "bg-brand-amc-networks",
  amc: "bg-brand-amc",
  ifc: "bg-brand-ifc",
  weTv: "bg-brand-we-tv",
  sundanceTv: "bg-brand-sundance-tv",
} as const;

const pastWorkCardVariants = cva(
  "group relative isolate z-0 min-h-64 overflow-hidden rounded-2xl bg-zinc-500/5 text-zinc-800 transition-shadow duration-150 ease-in sm:hover:z-10 sm:hover:shadow-card-hover data-[active=true]:z-10 data-[active=true]:shadow-card-hover",
  {
    variants: {
      accent: accentStyles,
    },
  },
);

const pastWorkCardBackgroundVariants = cva(
  "pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-150 ease-in opacity-0 sm:group-hover:opacity-100 group-data-[active=true]:opacity-100",
  {
    variants: {
      accent: accentBackgroundStyles,
    },
  },
);

const pastWorkCardDimmedBackgroundVariants = cva(
  "pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-[400ms] ease-in-out opacity-0 group-data-[shimmer=true]:opacity-12 group-data-[adjacent=true]:opacity-12",
  {
    variants: {
      accent: accentBackgroundStyles,
    },
  },
);

const pastWorkTitleVariants = cva(
  "w-full text-4xl leading-none tracking-tighter font-semibold transition-colors duration-75 ease-in",
  {
    variants: {
      tone: {
        light: "",
        dark: "",
      },
      state: {
        blended: "text-black/80 dark:text-white/80",
        active: "",
      },
    },
    compoundVariants: [
      {
        tone: "light",
        state: "active",
        className: "text-white",
      },
      {
        tone: "dark",
        state: "active",
        className: "text-zinc-950",
      },
    ],
  },
);

const pastWorkBodyVariants = cva(
  "max-w-xs text-base leading-tight transition-colors duration-75 ease-in text-balance",
  {
    variants: {
      tone: {
        subtle: "",
        default: "",
        strong: "",
      },
      contentTone: {
        light: "",
        dark: "",
      },
      state: {
        blended: "text-black/55 dark:text-white/55",
        active: "",
      },
    },
    compoundVariants: [
      {
        tone: "subtle",
        contentTone: "light",
        state: "active",
        className: "text-white/80",
      },
      {
        tone: "default",
        contentTone: "light",
        state: "active",
        className: "text-white/88",
      },
      {
        tone: "default",
        contentTone: "dark",
        state: "active",
        className: "text-zinc-950/88",
      },
      {
        tone: "strong",
        contentTone: "light",
        state: "active",
        className: "text-white/90",
      },
    ],
  },
);

const pastWorkLogoVariants = cva(
  "block max-h-full w-auto max-w-36 shrink-0 transition-colors duration-75 ease-in sm:max-w-44 [&_circle]:fill-current [&_ellipse]:fill-current [&_path]:fill-current [&_polygon]:fill-current [&_rect]:fill-current",
  {
    variants: {
      tone: {
        dark: "",
        light: "",
      },
      state: {
        blended: "text-black/55 dark:text-white/75",
        active: "",
      },
    },
    compoundVariants: [
      {
        tone: "dark",
        state: "active",
        className: "text-zinc-950",
      },
      {
        tone: "light",
        state: "active",
        className: "text-white",
      },
    ],
    defaultVariants: {
      tone: "dark",
    },
  },
);

function PastWorkCardContent({ item, state }: { item: PastWorkItem; state: "blended" | "active" }) {
  return (
    <>
      <div className="px-8 pt-7 sm:px-10 sm:pt-8">
        <div className="mb-5 flex h-14 w-full flex-none items-center">
          {item.Logo ? (
            <item.Logo
              aria-label={`${item.client} logo`}
              fill="currentColor"
              className={pastWorkLogoVariants({ tone: item.contentTone, state })}
            />
          ) : null}
        </div>
      </div>
      <div className="flex h-full flex-col items-start px-8 pb-7 sm:px-10 sm:pb-8">
        <div className="w-full">
          {!item.Logo ? (
            <div className="mb-3.5 flex min-h-13 items-end">
              <h3 className={pastWorkTitleVariants({ tone: item.contentTone, state })}>
                {item.client}
              </h3>
            </div>
          ) : null}
          <p
            className={pastWorkBodyVariants({
              tone: item.bodyTone,
              contentTone: item.contentTone,
              state,
            })}
          >
            {item.description}
          </p>
        </div>
      </div>
    </>
  );
}

const pastWork: readonly PastWorkItem[] = [
  {
    client: "Microsoft",
    Logo: MicrosoftLogo,
    description:
      "Managed and maintained feature updates and redesigns for multiple WordPress-powered sites, including Microsoft Blogs, Microsoft On the Issues, and Microsoft Stories.",
    accent: "microsoft",
    contentTone: "light",
    bodyTone: "strong",
  },
  {
    client: "Facebook",
    Logo: FacebookLogo,
    description:
      "Maintained and implemented redesign updates for the Facebook inspirED initiative, including ongoing front-end improvements across the experience.",
    accent: "facebook",
    contentTone: "light",
    bodyTone: "default",
  },
  {
    client: "GoDaddy",
    Logo: GoDaddyLogo,
    description:
      "Developed custom WordPress themes for GoDaddy's website builder, supporting product marketing pages and broader site updates.",
    accent: "godaddy",
    contentTone: "dark",
    bodyTone: "default",
  },
  {
    client: "Stadium",
    Logo: StadiumLogo,
    description:
      "Built the website for Stadium, a college sports website and TV service. One of the highlights of this project was designing and building a March Madness bracket.",
    accent: "stadium",
    contentTone: "light",
    bodyTone: "strong",
  },
  {
    client: "Capital One",
    Logo: CapitalOneLogo,
    description:
      "Maintained and extended Capital One's design system documentation in collaboration with internal designers, making it more useful across teams.",
    accent: "capitalOne",
    contentTone: "light",
    bodyTone: "default",
  },
  {
    client: "Control Engineering",
    Logo: ControlEngineeringLogo,
    description:
      "Built the front end on top of WordPress with a custom PHP component system. Designed the site layout as a reusable template for use across all of their properties.",
    accent: "controlEngineering",
    contentTone: "light",
    bodyTone: "strong",
  },
  {
    client: "PA Media Group",
    Logo: PaMediaLogo,
    description:
      "Built a Vue.js based administration interface for browsing stories and videos, making editorial content easier to review and manage.",
    accent: "paMedia",
    contentTone: "dark",
    bodyTone: "default",
  },
  {
    client: "AMC Networks",
    Logo: AmcNetworksLogo,
    description:
      "Supported site updates and launches across the AMC Networks ecosystem and related entertainment brands.",
    accent: "amcNetworks",
    contentTone: "light",
    bodyTone: "subtle",
  },
  {
    client: "AMC",
    Logo: AmcLogo,
    description:
      "Built an Emmy-nominated second screen experience for The Walking Dead. Built sites for The Walking Dead, Better Call Saul, Mad Men, and more, including mini-sites and sweepstakes pages.",
    accent: "amc",
    contentTone: "dark",
    bodyTone: "default",
  },
  {
    client: "IFC",
    Logo: IfcLogo,
    description:
      "Built a custom WordPress theme to power the redesign of the IFC.com website, with a focus on a flexible editorial experience.",
    accent: "ifc",
    contentTone: "light",
    bodyTone: "default",
  },
  {
    client: "We TV",
    Logo: WeTvLogo,
    description:
      "Built a custom WordPress theme to power the redesign of the we.tv website and support content publishing across the brand.",
    accent: "weTv",
    contentTone: "light",
    bodyTone: "default",
  },
  {
    client: "Sundance TV",
    Logo: SundanceTvLogo,
    description:
      "Built a custom WordPress theme to power the redesign of the sundancetv.com website, creating a more polished and scalable foundation.",
    accent: "sundanceTv",
    contentTone: "light",
    bodyTone: "default",
  },
];

function Component() {
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [shimmerCards, setShimmerCards] = useState<number[]>([]);
  const [adjacentCards, setAdjacentCards] = useState<number[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(max-width: 639px)");
    let frameId = 0;

    const updateActiveCard = () => {
      if (!mediaQuery.matches) {
        setActiveCard(null);
        return;
      }

      if (window.scrollY <= 0) {
        setActiveCard(null);
        return;
      }

      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1;

      if (scrolledToBottom) {
        setActiveCard(pastWork.length - 1);
        return;
      }

      const viewportCenter = window.innerHeight * 0.45;
      let nextActive: number | null = null;
      let closestDistance = Number.POSITIVE_INFINITY;

      cardRefs.current.forEach((card, index) => {
        if (!card) {
          return;
        }

        const rect = card.getBoundingClientRect();
        const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;

        if (!isVisible) {
          return;
        }

        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          nextActive = index;
        }
      });

      setActiveCard((current) => (current === nextActive ? current : nextActive));
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateActiveCard);
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    mediaQuery.addEventListener("change", requestUpdate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      mediaQuery.removeEventListener("change", requestUpdate);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(max-width: 639px)");

    if (!mediaQuery.matches || activeCard === null) {
      setAdjacentCards([]);
      return;
    }

    const cards = cardRefs.current.filter((card): card is HTMLElement => card !== null);

    if (cards.length === 0) {
      setAdjacentCards([]);
      return;
    }

    setAdjacentCards(getAdjacentCardIndexes(getCardGridPositions(cards), activeCard));
  }, [activeCard]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    if (reduceMotionQuery.matches || !desktopQuery.matches) {
      setShimmerCards([]);
      return;
    }

    const timeouts: Array<number> = [];
    const startDelay = 360;
    const stepDuration = 100;
    const dimmedTransitionDuration = 400;

    const cards = cardRefs.current.filter((card): card is HTMLElement => card !== null);

    if (cards.length === 0) {
      return;
    }

    const shimmerGroups = getCardGridPositions(cards)
      .reduce<Array<Array<number>>>((groups, item) => {
        const diagonalIndex = item.row + item.column;

        if (!groups[diagonalIndex]) {
          groups[diagonalIndex] = [];
        }

        groups[diagonalIndex].push(item.index);
        groups[diagonalIndex].sort((left, right) => left - right);

        return groups;
      }, [])
      .filter((group) => group.length > 0);

    shimmerGroups.forEach((group, groupIndex) => {
      const groupStartTime = startDelay + groupIndex * stepDuration;

      timeouts.push(
        window.setTimeout(
          () => {
            setShimmerCards((current) => [...new Set([...current, ...group])]);
          },
          groupStartTime,
        ),
      );

      timeouts.push(
        window.setTimeout(
          () => {
            setShimmerCards((current) => current.filter((index) => !group.includes(index)));
          },
          groupStartTime + dimmedTransitionDuration,
        ),
      );
    });

    return () => {
      timeouts.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      setShimmerCards([]);
    };
  }, []);

  const handleCardEnter = (index: number) => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches) {
      return;
    }

    const cards = cardRefs.current.filter((card): card is HTMLElement => card !== null);

    if (cards.length === 0) {
      return;
    }

    setAdjacentCards(getAdjacentCardIndexes(getCardGridPositions(cards), index));
  };

  const handleCardLeave = () => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches) {
      return;
    }

    setAdjacentCards([]);
  };

  return (
    <div className="relative min-h-screen bg-white px-[3.25rem] py-8 dark:bg-zinc-900 sm:px-[3.75rem] sm:py-10 md:py-12 lg:py-24">
      <div className="from-white dark:from-zinc-900 to-white/0 dark:to-zinc-900/0 h-8 sm:h-10 md:h-12 lg:h-20 pointer-events-none fixed top-0 inset-x-0 bg-linear-to-b mix-blend-soft-light z-999" />
      <div className="from-white dark:from-zinc-900 to-white/0 dark:to-zinc-900/0 h-8 sm:h-10 md:h-12 lg:h-20 pointer-events-none fixed bottom-0 inset-x-0 bg-linear-to-t mix-blend-soft-light z-999" />
      <div className="mx-auto w-full max-w-6xl">
        <div>
          <div className="relative mb-4 inline-flex aspect-square size-28 rounded-full bg-zinc-200 dark:bg-blend-multiply">
            <div className="pointer-events-none absolute inset-0 rounded-full border border-zinc-500/15 dark:hidden" />
            <img
              src="/avatar.jpg"
              className="size-full rounded-full dark:brightness-90 dark:contrast-[1.1]"
            />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-lg leading-tight font-medium text-zinc-900 dark:text-zinc-100">
                Anthony Garand
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400">Product Designer & Engineer</p>
            </div>
            <div className="grid shrink-0 auto-cols-max grid-flow-col justify-end gap-4 pt-0.5">
              <a
                href="https://x.com/garand"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                <FaXTwitter />
              </a>
              <a
                href="https://github.com/garand"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                <FaGithub />
              </a>
            </div>
          </div>
          <p className="mt-5 text-zinc-700 dark:text-zinc-300">
            Currently building at{" "}
            <a
              href="https://towbook.com"
              className="underline decoration-amber-400 underline-offset-3"
            >
              Towbook
            </a>
            .
          </p>
        </div>
        <div className="mt-12">
          <h2 className="text-lg leading-tight font-medium text-zinc-900 dark:text-zinc-100">
            Roles
          </h2>
          <div className="mt-4 grid auto-rows-max gap-8">
            <div className="grid max-w-xs grid-flow-row grid-cols-[32rem,max-content] gap-x-1 gap-y-1">
              <div className="col-span-2 grid grid-cols-subgrid">
                <div className="text-zinc-900 dark:text-zinc-100">Towbook</div>
                <div className="tracking-tight text-zinc-500 tabular-nums dark:text-zinc-400">
                  2019 &ndash; Now
                </div>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid">
                <div className="text-zinc-900 dark:text-zinc-100">10up</div>
                <div className="tracking-tight text-zinc-500 tabular-nums dark:text-zinc-400">
                  2017 &ndash; 2019
                </div>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                  Lift UX{" "}
                  <span className="rounded-xl bg-zinc-50 px-1.5 py-0.5 text-xs text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                    Acquired
                  </span>
                </div>
                <div className="tracking-tight text-zinc-500 tabular-nums dark:text-zinc-400">
                  2011 &ndash; 2017
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 @container/past-work">
          <h2 className="text-lg leading-tight font-medium text-zinc-900 dark:text-zinc-100">
            Past Work
          </h2>
          <div className="-mx-8 mt-5 grid gap-5 sm:-mx-10 @xl/past-work:grid-cols-2 @5xl/past-work:grid-cols-3 @7xl/past-work:grid-cols-4">
            {pastWork.map((item, index) => (
              <article
                key={item.client}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                onMouseEnter={() => {
                  handleCardEnter(index);
                }}
                onMouseLeave={handleCardLeave}
                data-active={activeCard === index ? "true" : "false"}
                className="transition-transform duration-700 ease-out sm:hover:scale-[1.015] data-[active=true]:scale-[1.015]"
              >
                <div
                  data-active={activeCard === index ? "true" : "false"}
                  data-adjacent={adjacentCards.includes(index) ? "true" : "false"}
                  data-shimmer={shimmerCards.includes(index) ? "true" : "false"}
                  className={pastWorkCardVariants({ accent: item.accent })}
                >
                  <div className={pastWorkCardDimmedBackgroundVariants({ accent: item.accent })} />
                  <div className={pastWorkCardBackgroundVariants({ accent: item.accent })} />
                  <div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-overlay transition-opacity duration-150 ease-in sm:group-hover:opacity-100 group-data-[active=true]:opacity-100 shadow-card-inner-glow shadow-black/20" />
                  <div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-overlay bg-linear-to-tr from-black/60 via-black/0 to-white/60 transition-opacity duration-150 ease-in sm:group-hover:opacity-100 group-data-[active=true]:opacity-100" />
                  <div className="pointer-events-none absolute inset-0 z-10 opacity-100 transition-opacity duration-150 ease-in sm:group-hover:opacity-0 group-data-[active=true]:opacity-0">
                    <div className="h-full mix-blend-overlay dark:mix-blend-darken">
                      <PastWorkCardContent item={item} state="blended" />
                    </div>
                  </div>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-100 ease-in sm:group-hover:opacity-100 group-data-[active=true]:opacity-100"
                  >
                    <PastWorkCardContent item={item} state="active" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
