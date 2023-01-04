export default function Component() {
  return (
    <div>
      <div className="max-w-prose">
        <h1 className="text-3xl md:text-4xl lg:text-6xl text-slate-800 font-extrabold mb-6 md:mb-8 lg:mb-10">
          Snippets
        </h1>
        <div className="text-slate-500 text-lg grid grid-flow-row auto-rows-auto gap-6 mb-6 md:mb-12">
          <p>
            These are some useful bits of code that I find myself using
            regularly, you may find them useful too!
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
