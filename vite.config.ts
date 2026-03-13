import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [devtools(), nitro(), tailwindcss(), tanstackStart(), react()],
  nitro: {},
  server: {
    allowedHosts: true,
  },
});
