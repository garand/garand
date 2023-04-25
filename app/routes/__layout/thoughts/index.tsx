import { Link } from "@remix-run/react";
import { Heading } from "~/components/Heading";

export default function Component() {
  return (
    <div className="max-w-prose">
      <Heading.Level2>Thoughts</Heading.Level2>
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
