// ---------------------------------------------------------------------------
// eslint.config.js — the project's lint rules.
//
// ESLint is our "second pair of eyes" that catches mistakes the TypeScript
// compiler won't, such as React hooks used incorrectly. Run it with:
//     npm run lint
//
// This is ESLint's modern "flat config" format (ESLint 9+). Each object in the
// array is a rule block; files matched by `files` get the `extends` rulesets.
// ---------------------------------------------------------------------------

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // Never lint the build output.
  globalIgnores(["dist"]),

  {
    // Only lint our TypeScript source.
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended, // baseline JS mistakes (unused vars, etc.)
      tseslint.configs.recommended, // TypeScript-aware rules
      reactHooks.configs.flat.recommended, // enforces the Rules of Hooks
      reactRefresh.configs.vite, // warns about non-component exports in .tsx (Fast Refresh)
    ],
    languageOptions: {
      // Tell ESLint we're running in a browser, so it knows about `window`, `document`, etc.
      globals: globals.browser,
    },
  },
]);
