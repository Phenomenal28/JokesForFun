// ---------------------------------------------------------------------------
// App.tsx — the app shell. The "boss" of the whole single-page app.
//
// BACKSTORY: This project used to use TanStack Router for the three "pages"
// (Gallery / Collection / About). That was heavier than a 3-page app needs,
// so we removed it. App.tsx now owns ONE piece of state — the current page —
// and decides which page component to render. A tiny context
// (src/lib/navigation.tsx) lets Header, FavoritesView, etc. read or change
// that page without us having to pass callbacks through every layer of props.
//
// What lives here and why:
//   - <GrainOverlay />     ... the paper-grain texture layer, fixed over everything
//                              (part of the riso visual identity, so it's global)
//   - <Header /> + <Footer> ... global chrome, same on every page
//   - one of HomePage/FavoritesPage/AboutPage ... whichever `page` says
//   - <Toaster />          ... the toast listener (mounted once so toasts show)
//
// The URL hash (#/favorites) is kept in sync so refresh + the browser back
// button still behave the way users expect — no real routing required.
// ---------------------------------------------------------------------------

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GrainOverlay } from "@/components/decorative/GrainOverlay";
import { Toaster } from "@/components/toast/Toaster";
import { HomePage } from "@/components/pages/HomePage";
import { FavoritesPage } from "@/components/pages/FavoritesPage";
import { AboutPage } from "@/components/pages/AboutPage";
import { PageProvider, type Page } from "@/lib/navigation";

// One browser-tab title per page. Set via `document.title` whenever `page`
// changes (see the effect below). Keeps the browser tab + bookmarks honest.
const TITLES: Record<Page, string> = {
  home: "JokesForFun — A Poster Gallery of Terrible Jokes",
  favorites: "Your Collection — JokesForFun",
  about: "About the Press — JokesForFun",
};

export default function App() {
  // The single source of truth for "which page am I on?".
  // We initialise from the URL hash so a refresh or a shared link lands on the
  // right page. `typeof window !== "undefined"` is a safety check in case this
  // file is ever imported during server-side rendering (it isn't today, but
  // it's cheap insurance).
  const [page, setPage] = useState<Page>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace(/^#\/?/, "");
      if (hash === "favorites" || hash === "about" || hash === "home") return hash;
    }
    return "home";
  });

  // Reflect the current page in the URL hash so back/forward and refresh land
  // on the same view (lightweight, no router dependency). We use replaceState
  // (not pushState) so we don't spam the history stack on every state change.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const target = `#/${page === "home" ? "" : page}`;
    if (window.location.hash !== target && !(page === "home" && !window.location.hash)) {
      window.history.replaceState(null, "", `${window.location.pathname}${target}${window.location.search}`);
    }
    window.document.title = TITLES[page];
  }, [page]);

  // Honor browser back/forward. When the user hits back, the hash changes and
  // we update `page` to match — so the back button really does take them home
  // from Favorites/About, just like a real router.
  useEffect(() => {
    const onPop = () => {
      const hash = window.location.hash.replace(/^#\/?/, "");
      setPage((hash === "favorites" || hash === "about") ? hash : "home");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    // PageProvider puts { page, navigate } into React context so any child
    // (Header, FavoritesView, AboutPage) can read or change the page directly.
    <PageProvider page={page} navigate={setPage}>
      {/* Decorative grain layer, fixed over the whole viewport (z-50). */}
      <GrainOverlay />
      {/* The visible page column. min-h-screen + flex-col keeps the footer at the bottom on short pages. */}
      <div className="flex min-h-screen flex-col">
        <Header />
        {/* Only one of these renders at a time; the others are unmounted. */}
        {page === "home" && <HomePage />}
        {page === "favorites" && <FavoritesPage />}
        {page === "about" && <AboutPage />}
        <Footer />
      </div>
      {/* Toasts are triggered everywhere with `toast(...)` from sonner.
          Mounting <Toaster /> once here is what actually makes them visible. */}
      <Toaster />
    </PageProvider>
  );
}
