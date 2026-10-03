import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { aiApiMiddleware } from "./server/api.js";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "offline-ai-layer",
      configureServer(server) {
        server.middlewares.use(aiApiMiddleware);
      },
      configurePreviewServer(server) {
        server.middlewares.use(aiApiMiddleware);
      },
    },
  ],
});

