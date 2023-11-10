import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { config } from "@fortawesome/fontawesome-svg-core";
import styles from "~/styles/index.css";

config.autoAddCss = false;

export const meta: MetaFunction = () => {
  return [
    {
      charset: "utf-8",
      title: "Anthony Garand",
      description: "Front-End Engineer working at Towbook.",
      viewport: "width=device-width,initial-scale=1",
    },
  ];
};

export const links: LinksFunction = () => {
  return [
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
    { rel: "stylesheet", href: styles },
  ];
};

export default function Component() {
  return (
    <html
      lang="en"
      className="antialiased font-sans bg-zinc-50 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="py-20">
        <Outlet />
        <ScrollRestoration />
        <LiveReload />
        <Scripts />
        {process.env.NODE_ENV === "production" && (
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
  var _gauges = _gauges || [];
  (function() {
    var t   = document.createElement('script');
    t.type  = 'text/javascript';
    t.async = true;
    t.id    = 'gauges-tracker';
    t.setAttribute('data-site-id', '4d5aa2a95ffe1f587b000001');
    t.setAttribute('data-track-path', 'https://track.gaug.es/track.gif');
    t.src = 'https://d2fuc4clr7gvcn.cloudfront.net/track.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(t, s);
  })();
        `,
            }}
          />
        )}
      </body>
    </html>
  );
}
