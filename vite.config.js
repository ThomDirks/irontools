import { defineConfig } from "vite";

// The source page is app.html. `npm run build` writes the site to dist/, and
// `npm run release` copies it to the repo root (index.html + assets/), which
// is what GitHub Pages serves when it deploys from the main branch.
export default defineConfig({
  base: "./",
  server: { open: "/app.html" },
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
    rollupOptions: { input: "app.html" }
  }
});
