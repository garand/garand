import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import devtoolsJson from "vite-plugin-devtools-json";
import { nitro } from "nitro/vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [
    devtoolsJson(),
    tailwindcss(),
    tsConfigPaths(),
    tanstackStart(),
    nitro(),
    react(),
  ],
  server: {
    allowedHosts: true,
  },
});
