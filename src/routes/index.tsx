import { createFileRoute } from "@tanstack/react-router";
import { FaGithub, FaXTwitter } from "react-icons/fa6";

export const Route = createFileRoute("/")({
  component: Component,
});

function Component() {
  return (
    <div className="p-8 sm:p-10 md:p-12">
      <div className="grid auto-cols-max grid-flow-col justify-between">
        <div>
          <div className="relative mb-4 inline-flex rounded-full dark:bg-blend-multiply">
            <div className="pointer-events-none absolute inset-0 rounded-full border-1 border-zinc-500/15 dark:hidden" />
            <img
              src="/avatar.jpg"
              className="h-20 rounded-full dark:brightness-90 dark:contrast-[1.1]"
            />
          </div>
          <h1 className="text-lg leading-tight font-medium">Anthony Garand</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Product Designer & Engineer
          </p>
          <p className="mt-4">
            Currently working at{" "}
            <a
              href="https://towbook.com"
              className="underline decoration-amber-400 underline-offset-3"
            >
              Towbook
            </a>
            .
          </p>
        </div>
        <div className="grid auto-cols-max grid-flow-col gap-4">
          <a href="https://x.com/garand" className="">
            <FaXTwitter />
          </a>
          <a href="https://github.com/garand" className="">
            <FaGithub />
          </a>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="font-medium">Roles</h2>
        <div className="mt-4 grid auto-rows-max gap-8">
          <div className="grid max-w-xs grid-flow-row grid-cols-[32rem,max-content] gap-x-1 gap-y-0.5">
            <div className="col-span-2 grid grid-cols-subgrid">
              <div>Towbook</div>
              <div className="tracking-tight text-zinc-500 tabular-nums dark:text-zinc-400">
                2019 &ndash; Now
              </div>
            </div>
            <div className="col-span-2 grid grid-cols-subgrid">
              <div>10up</div>
              <div className="tracking-tight text-zinc-500 tabular-nums dark:text-zinc-400">
                2017 &ndash; 2019
              </div>
            </div>
            <div className="col-span-2 grid grid-cols-subgrid">
              <div className="flex items-center gap-2">
                Lift UX{" "}
                <span className="rounded-xl bg-zinc-50 px-1.5 py-0.5 text-xs text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                  Acquired
                </span>
              </div>
              <div className="tracking-tight text-zinc-500 tabular-nums dark:text-zinc-400">
                2011 &ndash; 2017
              </div>
            </div>
            <div className="col-span-2 grid grid-cols-subgrid">
              <div>funeralOne</div>
              <div className="tracking-tight text-zinc-500 tabular-nums dark:text-zinc-400">
                2007 &ndash; 2011
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="font-medium">Past Work</h2>
        <div className="group/work-list mt-4 grid max-w-prose grid-flow-row auto-rows-max gap-x-8 max-sm:gap-y-5 sm:grid-cols-[max-content_auto]">
          <div className={workStyle}>
            <h3 className={workTitleStyle}>Microsoft</h3>
            <div className="relative">
              <p className={workDescriptionStyle}>
                Managed and maintined feature updates and redesigns for multiple
                WordPress powered sites, including Microsoft Blogs, Microsoft On
                the Issues, and Microsoft Stories.
              </p>
            </div>
          </div>
          <div className={workStyle}>
            <h3 className={workTitleStyle}>Facebook</h3>
            <div className="relative">
              <p className={workDescriptionStyle}>
                Helped maintain and implement redesigns for the Facebook
                inspirED initiative.
              </p>
            </div>
          </div>
          <div className={workStyle}>
            <h3 className={workTitleStyle}>GoDaddy</h3>
            <div className="relative">
              <p className={workDescriptionStyle}>
                Developed custom WordPress themes for GoDaddy's website buider.
              </p>
            </div>
          </div>
          <div className={workStyle}>
            <h3 className={workTitleStyle}>Campus Insiders</h3>
            <div className="relative">
              <p className={workDescriptionStyle}>
                Built the website for Campus Insiders, a college sports website
                and TV service. One of the highlights of this project was
                designing and building a March Madness bracket.
              </p>
            </div>
          </div>
          <div className={workStyle}>
            <h3 className={workTitleStyle}>Control Engineering</h3>
            <div className="relative">
              <p className={workDescriptionStyle}>
                Entire front-end build, built on top of WordPress with a custom
                PHP component implementation. The site layout was designed as a
                template to be used across all of their properties.
              </p>
            </div>
          </div>
          <div className={workStyle}>
            <h3 className={workTitleStyle}>PA Media Group</h3>
            <div className="relative">
              <p className={workDescriptionStyle}>
                Built a Vue.js based administration interface for browsing
                stories and videos.
              </p>
            </div>
          </div>
          <div className={workStyle}>
            <h3 className={workTitleStyle}>CapitalOne</h3>
            <div className="relative">
              <p className={workDescriptionStyle}>
                Interfaced with internal CapitalOne designers to maintain their
                design system documentation.
              </p>
            </div>
          </div>
          <div className={workStyle}>
            <h3 className={workTitleStyle}>AMC Networks</h3>
            <div className="relative">
              <p className={workDescriptionStyle}></p>
            </div>
          </div>
          <div className={workStyle}>
            <h3 className={workTitleStyle}>AMC</h3>
            <div className="relative">
              <p className={workDescriptionStyle}>
                Built an Emmy nominated second screen experience for The Walking
                Dead. Maintined websites for The Walking Dead, Better Call Saul,
                Mad Men, and more. Including mini-sites, Sweepstakes pages, etc.
              </p>
            </div>
          </div>
          <div className={workStyle}>
            <h3 className={workTitleStyle}>IFC</h3>
            <div className="relative">
              <p className={workDescriptionStyle}>
                Built a custom WordPress theme to power the redesign of the
                IFC.com website.
              </p>
            </div>
          </div>
          <div className={workStyle}>
            <h3 className={workTitleStyle}>We TV</h3>
            <div className="relative">
              <p className={workDescriptionStyle}>
                Built a custom WordPress theme to power the redesign of the
                we.tv website.
              </p>
            </div>
          </div>
          <div className={workStyle}>
            <h3 className={workTitleStyle}>Sundance TV</h3>
            <div className="relative">
              <p className={workDescriptionStyle}>
                Built a custom WordPress theme to power the redesign of the
                sundancetv.com website.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

let workStyle =
  "group/work-item grid grid-cols-subgrid sm:col-span-2 relative py-0.5 group-hover/work-list:text-zinc-500 dark:group-hover/work-list:text-zinc-400";

let workTitleStyle =
  "group-hover/work-item:text-zinc-900 dark:group-hover/work-item:text-zinc-100 max-sm:text-zinc-900 dark:max-sm:text-zinc-100";

let workDescriptionStyle =
  "text-zinc-500 dark:text-zinc-400 sm:group-hover/work-item:block sm:absolute sm:hidden leading-snug max-sm:text-sm max-sm:mt-1";
