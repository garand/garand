import {
  faGithub,
  faTwitter,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowRight, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Component() {
  const availability: "yes" | "limited" | "no" = "yes";

  return (
    <>
      <section className="max-w-3xl mx-auto px-8">
        <div className="mb-6 flex justify-between items-baseline gap-8">
          <h1 className="text-lg text-zinc-500 dark:text-zinc-400">
            Anthony Garand
          </h1>
          <ul className="flex items-center gap-0.5">
            <li>
              <a
                href="https://github.com/garand"
                className="relative group rounded-md inline-flex p-2 hover:bg-zinc-100 hover:dark:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400 hover:text-purple-500"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
            </li>
            <li>
              <a
                href="https://x.com/garand"
                className="relative group rounded-md inline-flex p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400  hover:text-sky-500"
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
                className="relative group rounded-md inline-flex p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400  hover:text-green-500"
              >
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
            </li>
          </ul>
        </div>
        <h3 className="text-zinc-800 dark:text-zinc-100 text-2xl sm:text-3xl font-[450] tracking-[-.01em]">
          Senior Software Engineer
          <span className="text-zinc-400 dark:text-zinc-400"> &amp; </span>
          <br />
          Product Designer
        </h3>
        {availability === "yes" && (
          <div className="mt-3">
            <div className="rounded-full inline-flex text-zinc-600 dark:text-zinc-400 items-center text-xs border border-zinc-200 dark:border-zinc-700 p-[5px]">
              <div className="bg-lime-500 dark:bg-lime-600 rounded-full w-2 ml-[3px] aspect-square mr-2 inline-block shadow-lime-400/80 dark:shadow-lime-500/80 shadow-[0_0_12px]" />
              <div className="leading-none mr-1.5">Available for work</div>
            </div>
          </div>
        )}
        {availability === "limited" && (
          <div className="mt-3">
            <div className="rounded-full inline-flex text-zinc-600 dark:text-zinc-400 items-center text-xs border border-zinc-200 dark:border-zinc-700 p-[5px]">
              <div className="bg-amber-500 dark:bg-amber-600 rounded-full w-2 ml-[3px] aspect-square mr-2 inline-block shadow-amber-400/80 dark:shadow-amber-500/80 shadow-[0_0_12px]" />
              <div className="leading-none mr-1.5">Limited availability</div>
            </div>
          </div>
        )}
        {availability === "no" && (
          <div className="mt-3">
            <div className="rounded-full inline-flex text-zinc-600 dark:text-zinc-400 items-center text-xs border border-zinc-200 dark:border-zinc-700 p-[5px]">
              <div className="bg-red-500 dark:bg-red-600 rounded-full w-2 ml-[3px] aspect-square mr-2 inline-block shadow-red-400/80 dark:shadow-red-500/80 shadow-[0_0_12px]" />
              <div className="leading-none mr-1.5">Not available for work</div>
            </div>
          </div>
        )}
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
            className="bg-gradient-to-l from-transparent to-zinc-50 dark:to-zinc-900 absolute top-0 left-0 bottom-0 z-10 pointer-events-none"
            style={{
              width: `calc(((100vw - 48rem) / 2 + 2rem) / 2)`,
            }}
          />
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
              <div key={i}>
                <div
                  className="aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-sm flex-shrink-0 snap-start"
                  style={{
                    width: `min(32rem, calc(100vw - 4rem))`,
                  }}
                ></div>
                <div className="mt-4 flex gap-8 items-end">
                  <div className="flex-1">
                    <div className="mb-1">
                      <div
                        className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-sm"
                        style={{
                          width: `${random(40, 55)}%`,
                        }}
                      />
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      <div
                        className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-sm"
                        style={{
                          width: `90%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button className="rounded-full border border-zinc-200 dark:border-zinc-700 px-3 py-[3px] text-sm hover:border-transparent hover:bg-zinc-800 dark:hover:bg-zinc-50 hover:text-zinc-50 dark:hover:text-zinc-800 transition-colors inline-flex items-center gap-1.5 text-zinc-800 dark:text-zinc-300">
                      <span>Read More</span>
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="h-2.5 mr-0.5"
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </section>
      <section className="mt-20 max-w-3xl mx-auto px-8">
        <h2 className="text-xl mb-4">About</h2>
        <div className="space-y-4 text-zinc-500 dark:text-zinc-400">
          <div className="float-right w-1/2 sm:w-1/3 max-w-[200px] ml-6 mb-6 -mr-8 sm:mr-0 transition-all">
            <img
              src="/avatar.png"
              title="Anthony Garand"
              alt="Anthony Garand"
              className="rounded-l-3xl sm:rounded-r-3xl shadow-2xl shadow-zinc-200 dark:shadow-zinc-800 mix-blend-multiply dark:mix-blend-difference"
            />
          </div>
          <p>
            I'm a {getAge("1991-11-05")} year old software engineer living in
            Michigan. I&apos;m a Christian, a husband to my incredible wife, and
            a father to three beautiful children.
          </p>
          <p>
            I have a passion for the small details. I believe they can make or
            break an experience and although a user may not notice them, they
            will <em>feel</em> them.
          </p>
          <p>
            Currently, I work at{" "}
            <a
              href="https://towbook.com"
              rel="noopener noreferer"
              className="text-sky-600 underline underline-offset-2 decoration-sky-500/40"
            >
              Towbook
            </a>
            , building and maintaining large scale web applications for the
            towing industry. I've been working there since late 2019.
          </p>
          <p>
            Previously, I've worked at LiftUX and 10up, where I worked on
            products and websites for clients like Microsoft, AMC Networks,
            Capital One, PA Media Group, and Stadium.
          </p>
        </div>
      </section>
    </>
  );
}

// generate random number between two values
function random(min = 1, max = 10) {
  return Math.random() * (max - min) + min;
}

function getAge(birthDate: string) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}
