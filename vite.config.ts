import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import path from "path";

export default defineConfig({
  vite: {
    server: {
      host: "::",
      port: 8080,
      hmr: { overlay: false },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
  },
});
