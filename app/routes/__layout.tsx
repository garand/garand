import {
  faGithub,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faLightbulb,
  faNewspaper,
  faTools,
  faUser,
  faCode,
  faBriefcase,
  faRssSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Outlet } from "@remix-run/react";

export default function Component() {
  return (
    <div className="px-6 py-10 md:px-12 md:py-16 lg:px-16 lg:py-24 grid grid-flow-row auto-rows-auto lg:grid-flow-col lg:grid-cols-[auto_1fr] gap-8 md:gap-12 lg:gap-20">
      <div>
        <Link
          to="/"
          className="rounded-full bg-slate-200 inline-flex mb-4 w-32 md:w-48 aspect-square overflow-hidden"
        >
          <img
            src="/avatar.png"
            className="aspect-square dark:brightness-75 dark:contrast-125 mix-blend-luminosity"
            alt="Anthony Garand"
          />
        </Link>
        <h1 className="font-extrabold text-3xl text-slate-800 dark:text-slate-50 tracking-tight">
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
        <ul className="flex gap-3 mb-6">
          <li>
            <a
              href="https://twitter.com/garand"
              target="_blank"
              rel="noreferrer"
              className="rounded-full inline-flex items-center p-3.5 bg-sky-50 hover:bg-sky-100 hover:scale-110 transition ease-in group"
              title="Twitter"
              style={{
                transitionProperty: "background, transform",
              }}
            >
              <FontAwesomeIcon
                icon={faTwitter}
                className="text-sky-400 group-hover:text-sky-500 transition-colors ease-in text-lg aspect-square"
              />
            </a>
          </li>
          <li>
            <a
              href="https://github.com/garand"
              target="_blank"
              rel="noreferrer"
              className="rounded-full inline-flex items-center p-3.5 bg-emerald-50 hover:bg-emerald-100 hover:scale-110 transition ease-in"
              title="GitHub"
              style={{
                transitionProperty: "background, transform",
              }}
            >
              <FontAwesomeIcon
                icon={faGithub}
                className="text-emerald-400 group-hover:text-emerald-500 transition-colors ease-in text-lg aspect-square"
              />
            </a>
          </li>
          <li>
            <a
              href="mailto:garand@garand.me"
              target="_blank"
              rel="noreferrer"
              className="rounded-full inline-flex items-center p-3.5 bg-amber-50 hover:bg-amber-100 hover:scale-110 transition ease-in"
              onClick={(event) => {
                event.preventDefault();
                alert("🚧 Under construction 🚧");
              }}
              title="RSS"
              style={{
                transitionProperty: "background, transform",
              }}
            >
              <FontAwesomeIcon
                icon={faRssSquare}
                className="text-amber-400 group-hover:text-amber-500 transition-colors ease-in text-lg aspect-square"
              />
            </a>
          </li>
          <li>
            <a
              href="mailto:garand@garand.me"
              className="rounded-full inline-flex items-center p-3.5 bg-purple-50 hover:bg-purple-100 hover:scale-110 transition ease-in"
              title="Email"
              style={{
                transitionProperty: "background, transform",
              }}
            >
              <FontAwesomeIcon
                icon={faEnvelope}
                className="text-purple-400 group-hover:text-purple-500 transition-colors ease-in text-lg aspect-square"
              />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/anthonygarand/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full inline-flex items-center p-3.5 bg-rose-50 hover:bg-rose-100 hover:scale-110 transition ease-in"
              title="LinkedIn"
              style={{
                transitionProperty: "background, transform",
              }}
            >
              <FontAwesomeIcon
                icon={faLinkedin}
                className="text-rose-400 group-hover:text-rose-500 transition-colors ease-in text-lg aspect-square"
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
