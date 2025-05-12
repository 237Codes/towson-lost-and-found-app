import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
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
  adapter: vercel(), 
  server: {
    proxy: {
      '/api': 'http://localhost:3001', // Proxy API calls in dev only
    },
  },
  security: {
    checkOrigin: true,
  },
});
