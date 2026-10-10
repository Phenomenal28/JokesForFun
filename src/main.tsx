// ---------------------------------------------------------------------------
// main.tsx — the app's entry point.
//
// This is the file index.html loads. Its only job is to boot React: grab the
// empty <div id="root"> in the DOM, render our <App /> component inside it,
// and wrap it in React's <StrictMode> for nicer dev-time warnings.
//
// We also import the global stylesheet here (index.css is the design system —
// tokens, fonts, custom utilities like `print-block` and `press`).
// ---------------------------------------------------------------------------

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// `document.getElementById("root")!` — the `!` says "trust me, this exists",
// because we know index.html always has <div id="root"></div>.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
