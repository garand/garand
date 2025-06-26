import { createFileRoute } from "@tanstack/react-router";
import { FaGithub, FaXTwitter } from "react-icons/fa6";

export const Route = createFileRoute("/")({
  component: Component,
});

function Component() {
  return (
    <div className="p-8">
      <div className="grid auto-cols-max justify-between grid-flow-col">
        <div>
          <div className="inline-flex mb-4 rounded-full relative dark:bg-blend-multiply">
            <div className="rounded-full border-1 border-zinc-500/15 absolute inset-0 pointer-events-none" />
            <img
              src="/avatar.jpg"
              className="h-20 rounded-full dark:brightness-[.8] dark:contrast-[1.2]"
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
        <div className="grid auto-cols-max gap-4 grid-flow-col">
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
        <div className="grid auto-rows-max gap-8 mt-4">
          <div className="max-w-xs grid gap-y-0.5 gap-x-1 grid-cols-[32rem,max-content] grid-flow-row">
            <div className="grid-cols-subgrid grid col-span-2">
              <div>Towbook</div>
              <div className=" text-zinc-500 dark:text-zinc-400 tracking-tight tabular-nums">
                2019 &ndash; Now
              </div>
            </div>
            <div className="grid-cols-subgrid grid col-span-2">
              <div>10up</div>
              <div className=" text-zinc-500 dark:text-zinc-400 tracking-tight tabular-nums">
                2017 &ndash; 2019
              </div>
            </div>
            <div className="grid-cols-subgrid grid col-span-2">
              <div className="flex items-center gap-2">
                Lift UX{" "}
                <span className="rounded-xl bg-zinc-50 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400 text-xs px-1.5 py-0.5">
                  Acquired
                </span>
              </div>
              <div className=" text-zinc-500 dark:text-zinc-400 tracking-tight tabular-nums">
                2011 &ndash; 2017
              </div>
            </div>
            <div className="grid-cols-subgrid grid col-span-2">
              <div>funeralOne</div>
              <div className=" text-zinc-500 dark:text-zinc-400 tracking-tight tabular-nums">
                2007 &ndash; 2011
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="font-medium">Past Work</h2>
        <div className="group/work-list grid auto-rows-max sm:grid-cols-[max-content_auto] gap-x-8 mt-4 max-w-prose grid-flow-row max-sm:gap-y-5">
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
                Built a custom WordPress theme to power the redesign of the main
                IFC.com website.
              </p>
            </div>
          </div>
          <div className={workStyle}>
            <h3 className={workTitleStyle}>We TV</h3>
            <div className="relative">
              <p className={workDescriptionStyle}>
                Built a custom WordPress theme to power the redesign of the main
                we.tv website.
              </p>
            </div>
          </div>
          <div className={workStyle}>
            <h3 className={workTitleStyle}>Sundance TV</h3>
            <div className="relative">
              <p className={workDescriptionStyle}>
                Built a custom WordPress theme to power the redesign of the main
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
