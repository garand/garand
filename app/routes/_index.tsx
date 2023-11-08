import {
  faGithub,
  faTwitter,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Component() {
  return (
    <>
      <section className="max-w-3xl mx-auto px-8">
        <div className="mb-4 flex justify-between items-baseline gap-8">
          <h1 className="text-xl mb-4">Anthony Garand</h1>
          <ul className="flex items-center gap-0.5">
            <li>
              <a
                href="https://github.com/garand"
                className="relative group rounded-md inline-flex p-2 hover:bg-zinc-100 hover:dark:bg-zinc-800 hover:transition-colors text-zinc-600 dark:text-zinc-400 hover:text-purple-500"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
            </li>
            <li>
              <a
                href="https://x.com/garand"
                className="relative group rounded-md inline-flex p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:transition-colors text-zinc-600 dark:text-zinc-400  hover:text-sky-500"
              >
                <FontAwesomeIcon
                  icon={faXTwitter}
                  className="group-hover:opacity-0 transition-opacity duration-300"
                />
                <div className="absolute inset-0 grid place-items-center">
                  <FontAwesomeIcon
                    icon={faTwitter}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </a>
            </li>
            <li>
              <a
                href="mailto:garand@garand.me"
                className="relative group rounded-md inline-flex p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:transition-colors text-zinc-600 dark:text-zinc-400  hover:text-green-500"
              >
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
            </li>
          </ul>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400">
          I'm a Christian, husband, father of three, and software engineer. I'm
          currently working at{" "}
          <a
            href="https://towbook.com"
            rel="noopener noreferer"
            className="text-sky-600 underline underline-offset-2 decoration-sky-500/40"
          >
            Towbook
          </a>
          .
        </p>
      </section>
      <section className="max-w-3xl mx-auto px-8 mt-20">
        <h2 className="text-xl mb-4">Writing</h2>
        <ol className="flex flex-col gap-1">
          {new Array(8).fill(0).map((_, i) => (
            <li className="flex justify-between items-baseline" key={i}>
              <div
                className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-sm"
                style={{
                  width: `${random(40, 55)}%`,
                }}
              />
              <div
                className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-sm"
                style={{
                  width: `${random(60, 80)}px`,
                }}
              />
            </li>
          ))}
          {/* <li className="flex justify-between items-baseline">
            <a
              href="/"
              className="text-sky-600 underline underline-offset-2 decoration-sky-500/40"
            >
              Deploying Remix to Azure with Containers
            </a>
            <span className="text-zinc-500 dark:text-zinc-400">
              <time>2021-08-14</time>
            </span>
          </li> */}
        </ol>
      </section>
      <section className="mt-20">
        <h2 className="text-xl mb-4 max-w-3xl mx-auto px-8">Projects</h2>
        <div className="relative">
          <div
            className="bg-gradient-to-r from-transparent to-zinc-50 dark:to-zinc-900 absolute top-0 right-0 bottom-0 z-10 pointer-events-none"
            style={{
              width: `calc(((100vw - 48rem) / 2 + 2rem) / 2)`,
            }}
          />
          <ul
            className="flex gap-4 md:gap-8 overflow-auto snap-x snap-mandatory relative"
            style={{
              paddingInline: `max(calc((100% - 48rem) / 2 + 2rem), 2rem)`,
              scrollPaddingInline: `max(calc((100% - 48rem) / 2 + 2rem), 2rem)`,
            }}
          >
            {new Array(8).fill(0).map((_, i) => (
              <div
                key={i}
                className="aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-sm flex-shrink-0 snap-start"
                style={{
                  width: `min(32rem, calc(100vw - 4rem))`,
                }}
              ></div>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

// generate random number between two values
function random(min = 1, max = 10) {
  return Math.random() * (max - min) + min;
}
