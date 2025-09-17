import {
  createRouter as createTanStackRouter,
  ErrorComponentProps,
  Link,
  NotFoundRouteProps,
  useLocation,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { Button } from "./components/Button";
import { LuArrowLeft, LuHouse, LuRotateCcw } from "react-icons/lu";

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultNotFoundComponent: NotFound,
    defaultErrorComponent: Error,
  });

  return router;
}

function NotFound({ data }: NotFoundRouteProps) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-md px-6 text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-zinc-200 select-none dark:text-zinc-900">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Page Not Found
          </h2>
          <p className="mb-2 text-zinc-600 dark:text-zinc-400">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <p className="inline-block rounded-lg bg-zinc-100 px-3 py-2 font-mono text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {location.pathname}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid auto-cols-max grid-flow-col justify-center gap-4">
          <Button variant="secondary" onClick={() => window.history.back()}>
            <LuArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button variant="primary" asChild>
            <Link to="/">
              <LuHouse className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Error({ error, info, reset }: ErrorComponentProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-md px-6 text-center">
        {/* Error Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-zinc-200 select-none dark:text-zinc-900">
            500
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Something went wrong
          </h2>
          <p className="mb-4 text-zinc-600 dark:text-zinc-400">
            We encountered an unexpected error.
            <br /> Please try again.
          </p>

          {/* Error Details */}
          {error && (
            <div className="mb-4 rounded-lg bg-zinc-100 p-4 text-left text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              <p className="font-mono text-sm break-words">{error.message}</p>
            </div>
          )}

          {/* Component Stack (Development) */}
          {info?.componentStack && process.env.NODE_ENV === "development" && (
            <details className="mb-4 rounded-lg bg-zinc-100 p-4 text-left text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              <summary className="mb-2 cursor-pointer font-semibold">
                Component Stack
              </summary>
              <pre className="font-mono text-xs break-words whitespace-pre-wrap">
                {info.componentStack}
              </pre>
            </details>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid auto-cols-max grid-flow-col justify-center gap-4">
          <Button variant="secondary" onClick={reset}>
            <LuRotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button variant="primary" asChild>
            <Link to="/">
              <LuHouse className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
