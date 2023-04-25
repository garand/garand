import { Link } from "@remix-run/react";
import { Heading } from "~/components/Heading";

export default function Component() {
  return (
    <div>
      <div className="max-w-prose">
        <Heading.Level2>Snippets</Heading.Level2>
        <div className="text-slate-500 text-lg grid grid-flow-row auto-rows-auto gap-6 mb-6 md:mb-12 -mt-4">
          <p className="mb-4">
            These are some useful bits of code that I find myself using
            regularly, you may find them useful too!
          </p>
          <ul className="grid grid-flow-row auto-rows-max gap-4">
            <li>
              <Link
                to="radix-dropdown-dialog"
                className="text-sky-600 hover:text-sky-700 transition-colors text-xl font-medium underline underline-offset-2 decoration-2 decoration-sky-600/50 hover:decoration-sky-700/50"
              >
                Composing a Radix Dialog inside of a Dropdown
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
