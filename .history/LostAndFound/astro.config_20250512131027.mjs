import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless"; // ✅ Added Vercel adapter
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
  output: "server", // ✅ Required for serverless SSR deployment
  adapter: vercel(), // ✅ Register the adapter
  server: {
    proxy: {
      '/api': 'http://localhost:3001', // Proxy API calls in dev only
    },
  },
  security: {
    checkOrigin: true,
  },
});
