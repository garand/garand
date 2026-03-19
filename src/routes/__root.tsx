import type { ReactNode } from "react";
import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
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
  shellComponent: Document,
  component: Outlet,
});

function Document({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script src="/vite-preload-recovery.js" />
        <HeadContent />
        <script
          async
          defer
          src="https://cdn.visitors.now/v.js"
          data-token="78bd4808-5b31-4d23-9a5d-36d769dc5dfe"
        />
      </head>
      <body className="h-full text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "TanStack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
