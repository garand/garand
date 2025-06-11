import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Component,
});

function Component() {
  return <h1 className="text-lg font-medium">Anthony Garand</h1>;
}
