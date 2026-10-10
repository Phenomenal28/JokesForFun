import { useCallback, useEffect, useRef, useState } from "react";
import { fetchJokes, JokeApiError } from "@/lib/api/jokeApi";
import type { Joke, JokeFilters } from "@/types/joke";

const BATCH = 6;

interface JokesState {
  jokes: Joke[];
  status: "idle" | "loading" | "loading-more" | "ready" | "error";
  error: { message: string; kind: JokeApiError["kind"] } | null;
}

/** Owns API state only: jokes, loading and errors. Filters live outside. */
export function useJokes(filters: JokeFilters) {
  const [state, setState] = useState<JokesState>({ jokes: [], status: "loading", error: null });
  const controller = useRef<AbortController | null>(null);
  const seen = useRef(new Set<string>());

  const run = useCallback(
    async (activeFilters: JokeFilters, mode: "replace" | "append") => {
      controller.current?.abort();
      const ac = new AbortController();
      controller.current = ac;

      setState((prev) => ({
        jokes: mode === "replace" ? [] : prev.jokes,
        status: mode === "replace" ? "loading" : "loading-more",
        error: null,
      }));

      try {
        const batch = await fetchJokes(activeFilters, BATCH, ac.signal);
        if (ac.signal.aborted) return;
        if (mode === "replace") seen.current = new Set();
        const fresh = batch.filter((joke) => {
          const key = `${joke.category}:${joke.id}`;
          if (seen.current.has(key)) return false;
          seen.current.add(key);
          return true;
        });
        setState((prev) => ({
          jokes: mode === "replace" ? fresh : [...prev.jokes, ...fresh],
          status: "ready",
          error: null,
        }));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        const apiError =
          error instanceof JokeApiError
            ? { message: error.message, kind: error.kind }
            : { message: "Something went sideways.", kind: "api" as const };
        if (!(error instanceof JokeApiError)) console.error("[useJokes] unexpected", error);
        setState((prev) => ({
          jokes: mode === "append" ? prev.jokes : [],
          status: "error",
          error: apiError,
        }));
      }
    },
    [],
  );

  // Refetch whenever applied filters change (debounced to collapse bursts).
  const key = JSON.stringify(filters);
  useEffect(() => {
    const timer = setTimeout(() => void run(JSON.parse(key) as JokeFilters, "replace"), 120);
    return () => clearTimeout(timer);
  }, [key, run]);

  useEffect(() => () => controller.current?.abort(), []);

  return {
    jokes: state.jokes,
    error: state.error,
    isLoading: state.status === "loading",
    isLoadingMore: state.status === "loading-more",
    loadMore: useCallback(() => void run(filters, "append"), [filters, run]),
    retry: useCallback(() => void run(filters, "replace"), [filters, run]),
  };
}