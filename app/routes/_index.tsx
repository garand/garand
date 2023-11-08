import {
  faGithub,
  faInstagram,
  faTwitter,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
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
                className="relative group rounded-md inline-flex p-2 hover:bg-zinc-100 hover:dark:bg-zinc-800 hover:transition-colors text-zinc-600 dark:text-zinc-400 hover:text-lime-500"
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
                  icon={faTwitter}
                  className="group-hover:opacity-0 transition-opacity duration-300"
                />
                <div className="absolute inset-0 grid place-items-center">
                  <FontAwesomeIcon
                    icon={faXTwitter}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/garand"
                className="relative group rounded-md inline-flex p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:transition-colors text-zinc-600 dark:text-zinc-400  hover:text-pink-500"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </li>
          </ul>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400">
          I'm a Christian, husband, father of three, and software engineer. I
          currently work as a software engineer at{" "}
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
                  width: `${random(30, 50)}%`,
                }}
              />
              <div
                className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-sm"
                style={{
                  width: `${random(8, 12)}%`,
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
        <ul
          className="flex overflow-auto gap-8"
          style={{
            paddingInline: `max(calc((100% - 48rem) / 2 + 2rem), 2rem)`,
          }}
        >
          {new Array(8).fill(0).map((_, i) => (
            <div
              key={i}
              className="aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-sm h-64"
            ></div>
          ))}
        </ul>
      </section>
    </>
  );
}

// generate random number between two values
function random(min = 1, max = 10) {
  return Math.random() * (max - min) + min;
}
