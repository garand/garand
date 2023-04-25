import { Heading } from "~/components/Heading";

export default function Component() {
  return (
    <div>
      <div className="max-w-prose">
        <Heading.Level2>Projects</Heading.Level2>
        <div className="text-slate-500 text-lg grid grid-flow-row auto-rows-auto gap-6 mb-6 md:mb-12">
          <p>
            These are some of the projects I've built over the years, some are
            active and some are here for historical purposes.
          </p>
          <aside className="rounded-lg bg-amber-50 px-6 py-5 text-amber-600 font-medium text-base">
            <span className="mr-2 inline-flex">🚧</span> Under Construction,
            lol.
          </aside>
        </div>
      </div>
    </div>
  );
}
