import { useEffect, useRef } from "react";
import { JokeCard } from "./JokeCard";
import { JokeSkeleton } from "./JokeSkeleton";
import { jokeEntrance } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { Joke } from "@/types/joke";

interface JokeGridProps {
  jokes: Joke[];
  loadingMore: boolean;
  isFavorite: (joke: { id: number; category: string }) => boolean;
  onFavorite: (joke: Joke) => void;
}

export function JokeGrid({ jokes, loadingMore, isFavorite, onFavorite }: JokeGridProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => jokeEntrance(root.current, reduced), [jokes, reduced]);

  return (
    <div
      ref={root}
      className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3"
      aria-busy={loadingMore}
    >
      {jokes.map((joke, index) => (
        <JokeCard
          key={joke.uid}
          joke={joke}
          index={index}
          featured={index === 0}
          isFavorite={isFavorite(joke)}
          onFavorite={() => onFavorite(joke)}
        />
      ))}
      {loadingMore && <JokeSkeleton count={3} />}
    </div>
  );
}