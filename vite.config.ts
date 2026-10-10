// ---------------------------------------------------------------------------
// vite.config.ts — Vite's configuration for both `npm run dev` and `npm run build`.
//
// Vite is our bundler/dev server. Here we plug in React support + Tailwind v4,
// and set up the `@` import alias so `import { cn } from "@/lib/utils"` works.
// ---------------------------------------------------------------------------

// `defineConfig` gives us editor autocomplete and type-checking for this file.
import { defineConfig } from "vite";
// The official React plugin gives us Fast Refresh in dev + JSX transform.
import react from "@vitejs/plugin-react";
// Tailwind v4 ships as a Vite plugin (no separate PostCSS config needed).
import tailwindcss from "@tailwindcss/vite";
// Node's path helpers, used to build an absolute path for the alias below.
import path from "node:path";
// In ESM there is no global `__dirname`, so we reconstruct it from `import.meta.url`.
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this app from a sub-path (/jokes-for-fun/). Setting
  // `base` makes the built asset URLs resolve there — without it, the deployed
  // site would 404 on its own JS/CSS and render blank. Because the app navigates
  // by URL hash (no path routing), no rewrite rules are needed.
  base: "/jokes-for-fun/",

  // Plugins run during bundling. The order matters: React first, Tailwind second.
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      // Make `@/...` an alias for `./src/...`. This mirrors the `paths` setting
      // in tsconfig.json so both TypeScript and Vite understand the same import.
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
