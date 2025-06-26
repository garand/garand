import {
  createRouter as createTanStackRouter,
  Link,
  useLocation,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultNotFoundComponent: NotFound,
  });

  return router;
}

function NotFound() {
  const location = useLocation();

  return (
    <div className="grid min-h-full place-items-center">
      <div className="">
        <h1 className="text-xl font-medium">Not Found</h1>
        <p className="mt-2 text-slate-600">
          The page you are looking for does not exist.
        </p>
        <div className="mt-4">
          <Link to="/" className="text-sky-500 underline">
            Go Home
          </Link>
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
