import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node"; // Node adapter for SSR
import { defineConfig } from "astro/config";
import path from "path";

// Astro configuration for TU Lost and Found
export default defineConfig({
  output: "server", // Enables SSR
  adapter: node({ mode: "standalone" }), // Works on Render's web service
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
  server: {
    proxy: {
      // Use local API in development only
      "/api": "http://localhost:3001",
    },
  },
  vite: {
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
    define: {
      // Ensure PUBLIC_API_BASE_URL can be accessed at runtime
      "import.meta.env.PUBLIC_API_BASE_URL": JSON.stringify(
        process.env.PUBLIC_API_BASE_URL || "http://localhost:3001"
      ),
    },
  },
  security: {
    checkOrigin: true,
  },
});
