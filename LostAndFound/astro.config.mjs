import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
  output: "server",
  server: {
    proxy: {
      '/api': 'http://localhost:3001', // Proxy all API calls to Express backend
    },
  },
  security: {
    checkOrigin: true,
  },
});
