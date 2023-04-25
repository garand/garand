import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Heading } from "~/components/Heading";
import * as ConditionalLinksInRemix from "./conditional-links-in-remix.mdx";

function postFromModule(module) {
  return {
    slug: module.filename.replace(/\.mdx?$/, ""),
    ...module.attributes?.meta,
  };
}

export async function loader() {
  // Return metadata about each of the posts for display on the index page.
  // Referencing the posts here instead of in the Index component down below
  // lets us avoid bundling the actual posts themselves in the bundle for the
  // index page.
  return json([postFromModule(ConditionalLinksInRemix)]);
}

export default function Component() {
  const posts = useLoaderData<typeof loader>();

  return (
    <div className="max-w-prose">
      <Heading.Level2>Articles</Heading.Level2>
      <div className="text-slate-500 text-lg">
        Nothing yet, I should probably write something here.
      </div>
      <ul className="hidden">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="grid grid-flow-col justify-between items-baseline"
          >
            <Link
              to={post.slug}
              className="text-sky-600 hover:text-sky-700 transition-colors text-lg underline underline-offset-2 decoration-2 decoration-sky-600/50 hover:decoration-sky-700/50"
            >
              {post.title}
            </Link>
            {post.description ? <p>{post.description}</p> : null}
            <div className="text-slate-400">October 11, 2011</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
