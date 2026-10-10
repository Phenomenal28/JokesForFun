/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from "react";

/**
 * Minimal manual "router" for a single-page app with no URL routing.
 * App.tsx owns the current page; consumers read it via usePage().
 * Keeps Header / FavoritesView / Anywhere from prop-drilling nav handlers.
 */
export type Page = "home" | "favorites" | "about";

interface PageContextValue {
  page: Page;
  navigate: (page: Page) => void;
}

const PageContext = createContext<PageContextValue | null>(null);

export function PageProvider({
  page,
  navigate,
  children,
}: {
  page: Page;
  navigate: (page: Page) => void;
  children: ReactNode;
}) {
  return <PageContext.Provider value={{ page, navigate }}>{children}</PageContext.Provider>;
}

/** Read the current page + nav callback. Must be used inside <PageProvider>. */
export function usePage(): PageContextValue {
  const ctx = useContext(PageContext);
  if (!ctx) throw new Error("usePage must be used inside <PageProvider>");
  return ctx;
}
