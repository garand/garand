import * as React from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
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
    links: [{ rel: "stylesheet", href: styles }],
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
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
