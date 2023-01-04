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
      </body>
    </html>
  );
}
