import { useCallback, useEffect, useState } from "react";
import {
  BLACKLIST_FLAGS,
  DEFAULT_FILTERS,
  type JokeFilters,
} from "@/types/joke";

const STORAGE_KEY = "riso-gallery:filters:v1";

function readStored(): JokeFilters | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<JokeFilters>;
    const blacklist = Array.isArray(parsed.blacklist)
      ? parsed.blacklist.filter(
          (f): f is (typeof BLACKLIST_FLAGS)[number] =>
            (BLACKLIST_FLAGS as readonly string[]).includes(f),
        )
      : [];
    return {
      category: parsed.category ?? DEFAULT_FILTERS.category,
      type: parsed.type ?? DEFAULT_FILTERS.type,
      blacklist,
      safeMode: Boolean(parsed.safeMode ?? DEFAULT_FILTERS.safeMode),
    };
  } catch {
    return null;
  }
}

/**
 * Filters now live in component state and mirror to localStorage (sticky across
 * sessions). URL sync has been removed: the app no longer uses TanStack Router.
 * `draft` is the in-progress panel state; `applied` drives the API.
 */
export function useFilters() {
  const [applied, setApplied] = useState<JokeFilters>(() => readStored() ?? DEFAULT_FILTERS);
  const [draft, setDraft] = useState<JokeFilters>(applied);

  // Persist applied filters.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(applied));
    } catch (error) {
      console.warn("[filters] could not persist", error);
    }
  }, [applied]);

  const apply = useCallback((next: JokeFilters) => {
    setApplied(next);
    setDraft(next);
  }, []);
  const applyDraft = useCallback(() => setApplied(draft), [draft]);
  const clear = useCallback(() => {
    setDraft(DEFAULT_FILTERS);
    setApplied(DEFAULT_FILTERS);
  }, []);

  const activeCount =
    (applied.category !== "Any" ? 1 : 0) +
    (applied.type !== "Any" ? 1 : 0) +
    applied.blacklist.length +
    (applied.safeMode ? 1 : 0);

  return { applied, draft, setDraft, apply, applyDraft, clear, activeCount };
}
