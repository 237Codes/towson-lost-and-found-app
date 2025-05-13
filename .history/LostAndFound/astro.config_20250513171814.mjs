import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import path from "path";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
  output: "static",
  server: {
    proxy: {
      "/api": "http://localhost:3001", // Proxy API calls in dev only
    },
  },
  vite: {
    resolve: {
      alias: {
        "@": path.resolve("./src"), // Enables @/components/... imports
      },
    },
  },
  security: {
    checkOrigin: true,
  },
});
