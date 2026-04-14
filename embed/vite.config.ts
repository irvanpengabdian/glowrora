import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "TrustifyEmbed",
      formats: ["iife"],
      fileName: () => "trustify-embed",
    },
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    minify: "esbuild",
    rollupOptions: {
      output: {
        entryFileNames: "trustify-embed.js",
        extend: true,
      },
    },
  },
});
