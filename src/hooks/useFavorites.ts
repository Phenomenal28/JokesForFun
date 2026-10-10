import { useCallback, useEffect, useState } from "react";
import type { FavoriteJoke, Joke } from "@/types/joke";

const STORAGE_KEY = "riso-gallery:favorites:v1";
const EVENT = "riso-gallery:favorites-changed";

/** A favorite is uniquely identified by (api id + category). */
function sameKey(a: { id: number; category: string }, b: { id: number; category: string }) {
  return a.id === b.id && a.category === b.category;
}

function read(): FavoriteJoke[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is FavoriteJoke =>
        typeof item === "object" && item !== null && typeof (item as FavoriteJoke).uid === "string",
    );
  } catch (error) {
    console.warn("[favorites] unreadable store, resetting", error);
    return [];
  }
}

function write(items: FavoriteJoke[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn("[favorites] could not persist", error);
  }
  window.dispatchEvent(new Event(EVENT));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteJoke[]>([]);

  useEffect(() => {
    const sync = () => setFavorites(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  /** Match by (id + category) — same key toggle uses. */
  const isFavorite = useCallback(
    (joke: { id: number; category: string }) => favorites.some((f) => sameKey(f, joke)),
    [favorites],
  );

  const toggle = useCallback((joke: Joke) => {
    const current = read();
    const exists = current.some((f) => sameKey(f, joke));
    const next = exists
      ? current.filter((f) => !sameKey(f, joke))
      : [
          {
            uid: joke.uid,
            id: joke.id,
            category: joke.category,
            type: joke.type,
            text: joke.text,
            setup: joke.setup,
            delivery: joke.delivery,
            savedAt: Date.now(),
          },
          ...current,
        ];
    write(next);
    setFavorites(next);
    return !exists;
  }, []);

  const remove = useCallback((uid: string) => {
    const next = read().filter((f) => f.uid !== uid);
    write(next);
    setFavorites(next);
  }, []);

  const clear = useCallback(() => {
    write([]);
    setFavorites([]);
  }, []);

  return { favorites, isFavorite, toggle, remove, clear };
}
