import { Link } from "@remix-run/react";
import { Heading } from "~/components/Heading";

export default function Component() {
  return (
    <div>
      <Heading.Level1>Hey! I'm Anthony Garand</Heading.Level1>
      <div className="max-w-prose mb-16">
        <p className="text-3xl text-slate-500">
          I'm a front-end engineer, working to make the web a better place.
        </p>
      </div>
      <div className="hidden max-w-6xl">
        <div className="mb-6 grid grid-flow-col justify-between items-baseline">
          <Heading.Level3>Recent Articles</Heading.Level3>
          <Link
            to="articles"
            className="font-medium text-sky-600 dark:text-sky-500 decoration-sky-600/50 dark:decoration-sky-500/50 underline underline-offset-2 decoration-2"
          >
            Read more &rarr;
          </Link>
        </div>
        <div className="grid auto-rows-auto md:grid-cols-2 xl:grid-cols-3 justify-start gap-8">
          {[...Array(3)].map((value, index) => (
            <Link
              to=""
              key={index}
              className="rounded-xl bg-slate-50 hover:bg-slate-100 transition-all ease-in-out hover:scale-105 p-4"
            >
              <img
                className="aspect-[3/1] rounded-lg bg-slate-300 object-cover w-full mb-4"
                src="https://images.unsplash.com/photo-1515266591878-f93e32bc5937?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
                alt="Mountain"
              />
              <div className="px-4 py-2">
                <Heading.Level5>Deploying Remix to Azure</Heading.Level5>
                <p className="text-slate-500">
                  Eiusmod elit enim id mollit. Officia veniam consectetur sint
                  quis id sunt fugiat mollit officia nisi adipisicing elit minim
                  minim adipisicing.
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
