import * as React from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import styles from "../index.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Anthony Garand",
      },
      {
        name: "description",
        content:
          "Anthony Garand is a senior product designer and developer focused on building pragmatic web applications.",
      },
    ],
    links: [
      { rel: "stylesheet", href: styles },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
  }),
  component: Component,
});

function Component() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

function Document({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <HeadContent />
      </head>
      <body className="h-full text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
        {children}
        <TanStackRouterDevtools />
        <Scripts />
      </body>
    </html>
  );
}
