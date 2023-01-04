import { Link } from "@remix-run/react";

export default function Component() {
  return (
    <div className="max-w-prose">
      <h1 className="text-3xl md:text-4xl lg:text-6xl text-slate-800 font-extrabold mb-6 md:mb-8 lg:mb-10">
        Thoughts
      </h1>
      <ul>
        <li className="grid grid-flow-col justify-between items-baseline">
          <Link
            to="on-disconnecting"
            className="text-sky-600 hover:text-sky-700 transition-colors text-lg underline underline-offset-2 decoration-2 decoration-sky-600/50 hover:decoration-sky-700/50"
          >
            On Disconnecting
          </Link>
          <div className="text-slate-400">October 11, 2011</div>
        </li>
      </ul>
    </div>
  );
}
