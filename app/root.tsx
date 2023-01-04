import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import style from "~/style/index.css";
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Anthony Garand",
  description: "Front-End Engineer working at Towbook.",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [{ rel: "stylesheet", href: style }];
}

export default function Component() {
  return (
    <html lang="en" className="dark:bg-black">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
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
      </body>
    </html>
  );
}
