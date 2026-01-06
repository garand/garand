import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [tanstackStart(), nitro(), tailwindcss(), react()],
  nitro: {},
  server: {
    allowedHosts: true,
  },
});
