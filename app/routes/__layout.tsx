import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faLightbulb,
  faNewspaper,
  faTools,
  faUser,
  faCode,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Outlet } from "@remix-run/react";

export default function Component() {
  return (
    <div className="px-6 py-10 md:px-12 md:py-16 lg:px-16 lg:py-24 grid grid-flow-row auto-rows-auto lg:grid-flow-col lg:grid-cols-[auto_1fr] gap-8 md:gap-12 lg:gap-16">
      <div>
        <Link to="/">
          <img
            src="/avatar.png"
            className="rounded-full w-32 md:w-48 aspect-square mb-4 dark:brightness-75 dark:contrast-125"
            alt="Anthony Garand"
          />
        </Link>
        <h1 className="font-bold text-3xl text-slate-900 dark:text-slate-50">
          Anthony Garand
        </h1>
        <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
          <p className="flex items-center gap-1">
            Front-End Engineer{" "}
            <span className="text-slate-400 text-base">@</span>{" "}
            <a
              href="https://towbook.com/"
              target="_blank"
              rel="noreferrer"
              className="text-sky-600 dark:text-sky-500 decoration-sky-600/50 dark:decoration-sky-500/50 font-medium underline underline-offset-2 decoration-2"
            >
              Towbook
            </a>
          </p>
        </div>
        <ul className="flex gap-4 mb-6">
          <li>
            <a
              href="https://twitter.com/garand"
              target="_blank"
              rel="noreferrer"
              className="rounded-full inline-flex items-center p-4 bg-sky-50 hover:bg-sky-100 hover:scale-110 transition"
              title="Twitter"
              style={{
                transitionProperty: "color, transform",
              }}
            >
              <FontAwesomeIcon
                icon={faTwitter}
                className="text-sky-500 w-5 h-5"
              />
            </a>
          </li>
          <li>
            <a
              href="https://github.com/garand"
              target="_blank"
              rel="noreferrer"
              className="rounded-full inline-flex items-center p-4 bg-slate-50 hover:bg-slate-100 hover:scale-110 transition"
              title="GitHub"
              style={{
                transitionProperty: "color, transform",
              }}
            >
              <FontAwesomeIcon
                icon={faGithub}
                className="text-slate-500 w-5 h-5"
              />
            </a>
          </li>
          <li>
            <a
              href="mailto:garand@garand.me"
              className="rounded-full inline-flex items-center p-4 bg-amber-50 hover:bg-amber-100 hover:scale-110 transition"
              title="Email"
              style={{
                transitionProperty: "color, transform",
              }}
            >
              <FontAwesomeIcon
                icon={faEnvelope}
                className="text-amber-500 w-5 h-5"
              />
            </a>
          </li>
        </ul>
        <nav className="text-lg font-medium text-slate-700">
          <ul className="grid grid-flow-row auto-rows-auto gap-1">
            <li>
              <Link
                to="articles"
                className="flex items-center gap-4 px-5 py-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <FontAwesomeIcon
                  icon={faNewspaper}
                  className="text-slate-300 w-5 h-5"
                />
                Articles
              </Link>
            </li>
            <li>
              <Link
                to="thoughts"
                className="flex items-center gap-4 px-5 py-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <FontAwesomeIcon
                  icon={faLightbulb}
                  className="text-slate-300 w-5 h-5"
                />
                Thoughts
              </Link>
            </li>
            <li>
              <Link
                to="projects"
                className="flex items-center gap-4 px-5 py-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <FontAwesomeIcon
                  icon={faBriefcase}
                  className="text-slate-300 w-5 h-5"
                />
                Projects
              </Link>
            </li>
            <li>
              <Link
                to="snippets"
                className="flex items-center gap-4 px-5 py-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <FontAwesomeIcon
                  icon={faCode}
                  className="text-slate-300 w-5 h-5"
                />
                Snippets
              </Link>
            </li>
            <li>
              <Link
                to="about"
                className="flex items-center gap-4 px-5 py-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-slate-300 w-5 h-5"
                />
                About
              </Link>
            </li>
            <li>
              <Link
                to="uses"
                className="flex items-center gap-4 px-5 py-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <FontAwesomeIcon
                  icon={faTools}
                  className="text-slate-300 w-5 h-5"
                />
                Uses
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
