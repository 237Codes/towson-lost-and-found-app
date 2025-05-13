import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node"; // ✅ Node adapter for SSR
import { defineConfig } from "astro/config";
import path from "path";

// https://astro.build/config
export default defineConfig({
  output: "server", // ✅ enable SSR
  adapter: node({ mode: "standalone" }), // ✅ required for Render
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
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
