import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node"; // Node adapter for SSR
import { defineConfig } from "astro/config";
import path from "path";
import dotenv from "dotenv";

// Load env vars from .env file (safe fallback for dev)
dotenv.config();

export default defineConfig({
  output: "server", // Enables SSR
  adapter: node({ mode: "standalone" }), // Ideal for Render deployments
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
  server: {
    proxy: {
      // Only proxy during local development
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
      // Inject PUBLIC_API_BASE_URL into client code at build time
      "import.meta.env.PUBLIC_API_BASE_URL": JSON.stringify(
        process.env.PUBLIC_API_BASE_URL || "http://localhost:3001"
      ),
    },
  },
  security: {
    checkOrigin: true,
  },
});
