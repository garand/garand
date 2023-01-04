import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Index() {
  return (
    <div className="p-6 md:p-12">
      <img
        src="/avatar.png"
        className="rounded-full w-32 md:w-48 aspect-square mb-4 dark:brightness-75 dark:contrast-125"
        alt="Anthony Garand"
      />
      <h1 className="font-bold text-3xl text-slate-900 dark:text-slate-50">
        Anthony Garand
      </h1>
      <div className="text-slate-500 dark:text-slate-400 text-lg mb-4">
        <p>
          Front-End Engineer working at{" "}
          <a
            href="https://towbook.com/"
            target="_blank"
            rel="noreferrer"
            className="text-sky-600 dark:text-sky-500 decoration-sky-600/50 dark:decoration-sky-500/50 font-medium underline underline-offset-2 decoration-2"
          >
            Towbook
          </a>
          .
        </p>
      </div>
      <ul className="flex gap-4">
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
    </div>
  );
}
