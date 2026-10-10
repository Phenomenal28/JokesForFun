import { FavoritesView } from "@/components/favorites/FavoritesView";

export function FavoritesPage() {
  return (
    <main id="main" className="flex-1 px-4 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[110rem] space-y-10">
        <h1 className="display text-[13vw] leading-[0.84] sm:text-[7rem]">
          The
          <span className="ml-3 bg-acid px-2 text-acid-foreground">keepers</span>
        </h1>
        <FavoritesView />
      </div>
    </main>
  );
}
