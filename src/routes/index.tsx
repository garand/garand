import { createFileRoute } from "@tanstack/react-router";
import { cva } from "cva";
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

const accentStyles = {
  microsoft: "hover:bg-brand-microsoft hover:shadow-brand-microsoft/60",
  facebook: "hover:bg-brand-facebook hover:shadow-brand-facebook/60",
  godaddy: "hover:bg-brand-godaddy hover:shadow-brand-godaddy/55",
  stadium: "hover:bg-brand-stadium hover:shadow-brand-stadium/60",
  controlEngineering:
    "hover:bg-brand-control-engineering hover:shadow-brand-control-engineering/55",
  paMedia: "hover:bg-brand-pa-media hover:shadow-brand-pa-media/55",
  capitalOne: "hover:bg-brand-capital-one hover:shadow-brand-capital-one/55",
  amcNetworks: "hover:bg-brand-amc-networks hover:shadow-brand-amc-networks/55",
  amc: "hover:bg-brand-amc hover:shadow-brand-amc/55",
  ifc: "hover:bg-brand-ifc hover:shadow-brand-ifc/55",
  weTv: "hover:bg-brand-we-tv hover:shadow-brand-we-tv/55",
  sundanceTv: "hover:bg-brand-sundance-tv hover:shadow-brand-sundance-tv/55",
} as const;

const pastWorkCardVariants = cva(
  "group relative z-0 min-h-64 overflow-hidden rounded-2xl bg-zinc-500/5 px-10 py-8 text-zinc-800 transition-all will-change-auto duration-100 ease-in hover:z-10 hover:shadow-card-hover sm:px-12 sm:py-10",
  {
    variants: {
      accent: accentStyles,
    },
  },
);

const pastWorkTitleVariants = cva(
  "w-full text-4xl leading-none tracking-tighter font-semibold text-zinc-800 transition-colors duration-100 ease-in",
  {
    variants: {
      tone: {
        light: "group-hover:text-white",
        dark: "group-hover:text-zinc-950",
      },
    },
  },
);

const pastWorkBodyVariants = cva(
  "max-w-xs text-base leading-tight text-zinc-500 transition-colors duration-100 ease-in text-balance",
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
    },
    compoundVariants: [
      {
        tone: "subtle",
        contentTone: "light",
        className: "group-hover:text-white/80",
      },
      {
        tone: "default",
        contentTone: "light",
        className: "group-hover:text-white/88",
      },
      {
        tone: "default",
        contentTone: "dark",
        className: "group-hover:text-zinc-950/88",
      },
      {
        tone: "strong",
        contentTone: "light",
        className: "group-hover:text-white/90",
      },
    ],
  },
);

const pastWorkLogoVariants = cva(
  "block max-h-full w-auto max-w-44 shrink-0 text-zinc-900/70 transition-colors duration-100 ease-in dark:text-zinc-100/75 [&_circle]:fill-current [&_ellipse]:fill-current [&_path]:fill-current [&_polygon]:fill-current [&_rect]:fill-current",
  {
    variants: {
      tone: {
        dark: "group-hover:text-zinc-950",
        light: "group-hover:text-white",
      },
    },
    defaultVariants: {
      tone: "dark",
    },
  },
);

const pastWork: readonly PastWorkItem[] = [
  {
    client: "Microsoft",
    Logo: MicrosoftLogo,
    description:
      "Managed and maintined feature updates and redesigns for multiple WordPress powered sites, including Microsoft Blogs, Microsoft On the Issues, and Microsoft Stories.",
    accent: "microsoft",
    contentTone: "light",
    bodyTone: "strong",
  },
  {
    client: "Facebook",
    Logo: FacebookLogo,
    description: "Helped maintain and implement redesigns for the Facebook inspirED initiative.",
    accent: "facebook",
    contentTone: "light",
    bodyTone: "default",
  },
  {
    client: "GoDaddy",
    Logo: GoDaddyLogo,
    description: "Developed custom WordPress themes for GoDaddy's website buider.",
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
    client: "Control Engineering",
    Logo: ControlEngineeringLogo,
    description:
      "Entire front-end build, built on top of WordPress with a custom PHP component implementation. The site layout was designed as a template to be used across all of their properties.",
    accent: "controlEngineering",
    contentTone: "light",
    bodyTone: "strong",
  },
  {
    client: "PA Media Group",
    Logo: PaMediaLogo,
    description: "Built a Vue.js based administration interface for browsing stories and videos.",
    accent: "paMedia",
    contentTone: "dark",
    bodyTone: "default",
  },
  {
    client: "Capital One",
    Logo: CapitalOneLogo,
    description:
      "Interfaced with internal CapitalOne designers to maintain their design system documentation.",
    accent: "capitalOne",
    contentTone: "light",
    bodyTone: "default",
  },
  {
    client: "AMC Networks",
    Logo: AmcNetworksLogo,
    description:
      "Supported work across the AMC Networks ecosystem and related entertainment brands.",
    accent: "amcNetworks",
    contentTone: "light",
    bodyTone: "subtle",
  },
  {
    client: "AMC",
    Logo: AmcLogo,
    description:
      "Built an Emmy nominated second screen experience for The Walking Dead. Maintined websites for The Walking Dead, Better Call Saul, Mad Men, and more, including mini-sites and sweepstakes pages.",
    accent: "amc",
    contentTone: "dark",
    bodyTone: "default",
  },
  {
    client: "IFC",
    Logo: IfcLogo,
    description: "Built a custom WordPress theme to power the redesign of the IFC.com website.",
    accent: "ifc",
    contentTone: "light",
    bodyTone: "default",
  },
  {
    client: "We TV",
    Logo: WeTvLogo,
    description: "Built a custom WordPress theme to power the redesign of the we.tv website.",
    accent: "weTv",
    contentTone: "light",
    bodyTone: "default",
  },
  {
    client: "Sundance TV",
    Logo: SundanceTvLogo,
    description:
      "Built a custom WordPress theme to power the redesign of the sundancetv.com website.",
    accent: "sundanceTv",
    contentTone: "light",
    bodyTone: "default",
  },
];

function Component() {
  return (
    <div className="min-h-screen bg-white p-8 sm:p-10 md:p-12 dark:bg-zinc-900 relative">
      <div className="from-white dark:from-zinc-900 to-white/0 dark:to-zinc-900/0 h-8 sm:h-10 md:h-12 pointer-events-none fixed top-0 inset-x-0 bg-linear-to-b z-999" />
      <div className="from-white dark:from-zinc-900 to-white/0 dark:to-zinc-900/0 h-8 sm:h-10 md:h-12 pointer-events-none fixed bottom-0 inset-x-0 bg-linear-to-t z-999" />
      <div>
        <div>
          <div className="relative mb-4 inline-flex aspect-square size-28 rounded-full bg-zinc-200 dark:bg-blend-multiply">
            <div className="pointer-events-none absolute inset-0 rounded-full border border-zinc-500/15 dark:hidden" />
            <img
              src="/avatar.jpg"
              className="size-full rounded-full dark:brightness-90 dark:contrast-[1.1]"
            />
          </div>
          <div className="flex flex-wrap items-start gap-y-3 sm:flex-nowrap sm:gap-x-24">
            <div>
              <h1 className="text-lg leading-tight font-medium text-zinc-900 dark:text-zinc-100">
                Anthony Garand
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400">Product Designer & Engineer</p>
            </div>
            <div className="grid auto-cols-max grid-flow-col gap-4 pt-0.5">
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
          <p className="mt-4 text-zinc-700 dark:text-zinc-300">
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
      </div>
      <div className="mt-8">
        <h2 className="font-medium text-zinc-900 dark:text-zinc-100">Roles</h2>
        <div className="mt-4 grid auto-rows-max gap-8">
          <div className="grid max-w-xs grid-flow-row grid-cols-[32rem,max-content] gap-x-1 gap-y-0.5">
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
      <div className="mt-8">
        <h2 className="font-medium text-zinc-900 dark:text-zinc-100">Past Work</h2>
        <div className="mt-5 grid max-w-[90rem] gap-5 md:grid-cols-2 xl:grid-cols-3">
          {pastWork.map((item) => (
            <article key={item.client} className={pastWorkCardVariants({ accent: item.accent })}>
              <div className="pointer-events-none absolute inset-0 mix-blend-overlay bg-linear-to-tr from-black/60 via-black/0 to-white/60 transition-opacity duration-100 opacity-0 group-hover:opacity-100" />
              <div className="relative z-10 mb-5 flex h-14 w-full items-center">
                {item.Logo ? (
                  <item.Logo
                    aria-label={`${item.client} logo`}
                    fill="currentColor"
                    className={pastWorkLogoVariants({ tone: item.contentTone })}
                  />
                ) : null}
              </div>
              <div className="relative flex h-full flex-col items-start">
                <div className="w-full">
                  {!item.Logo ? (
                    <div className="mb-3.5 flex min-h-13 items-end">
                      <h3 className={pastWorkTitleVariants({ tone: item.contentTone })}>
                        {item.client}
                      </h3>
                    </div>
                  ) : null}
                  <p
                    className={pastWorkBodyVariants({
                      tone: item.bodyTone,
                      contentTone: item.contentTone,
                    })}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
