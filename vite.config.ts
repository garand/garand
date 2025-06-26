import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import devtoolsJson from "vite-plugin-devtools-json";

export default defineConfig({
  plugins: [devtoolsJson(), tsConfigPaths(), tailwindcss(), tanstackStart()],
  server: {
    allowedHosts: true,
  },
});
