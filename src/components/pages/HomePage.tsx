import { useRef, useState } from "react";
import { Dices, Filter, Loader2, RefreshCw } from "lucide-react";
import { FloatingShapes } from "@/components/decorative/FloatingShapes";
import { JokeGrid } from "@/components/jokes/JokeGrid";
import { JokeSkeleton } from "@/components/jokes/JokeSkeleton";
import { FilterPanel } from "@/components/filters/FilterPanel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useFilters } from "@/hooks/useFilters";
import { useJokes } from "@/hooks/useJokes";
import { useFavorites } from "@/hooks/useFavorites";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { leverPull } from "@/lib/animations";
import { CATEGORY_LABELS, JOKE_CATEGORIES, type Joke } from "@/types/joke";
import { toast } from "sonner";

export function HomePage() {
  const { applied, draft, setDraft, apply, applyDraft, clear, activeCount } = useFilters();
  const { jokes, isLoading, isLoadingMore, error, loadMore, retry } = useJokes(applied);
  const { isFavorite, toggle } = useFavorites();
  const reduced = usePrefersReducedMotion();
  const [sheetOpen, setSheetOpen] = useState(false);
  const surpriseRef = useRef<HTMLButtonElement>(null);

  function surprise() {
    leverPull(surpriseRef.current, reduced);
    const pool = JOKE_CATEGORIES.filter((c) => c !== "Any" && c !== applied.category);
    const pick = pool[Math.floor(Math.random() * pool.length)] ?? "Misc";
    const type = Math.random() > 0.5 ? "twopart" : "Any";
    apply({ ...applied, category: pick, type });
    toast(`Rolled: ${CATEGORY_LABELS[pick]}`);
  }

  function onFavorite(joke: Joke) {
    const saved = toggle(joke);
    toast(saved ? "Kept for later." : "Removed.");
  }

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b-2 border-foreground px-4 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20">
        <FloatingShapes />
        <div className="mx-auto max-w-[110rem]">
          <p className="meta mb-6 inline-block border-2 border-foreground bg-surface px-3 py-2">
            Issue 01 · printed hourly
          </p>
          <h1 className="display max-w-[22ch] text-[13vw] leading-[1.02] sm:text-[9vw] xl:text-[8rem]">
            The internet's
            <br />
            <span className="box-decoration-clone bg-shock px-2 text-shock-foreground">
              worst
            </span>{" "}
            jokes,
            <br />
            framed nicely.
          </h1>

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md text-lg leading-snug text-muted-foreground md:text-xl">
              Six fresh posters at a time, pulled live from JokeAPI. Keep the ones that land.
              Blame the API for the rest.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                ref={surpriseRef}
                type="button"
                onClick={surprise}
                className="press print-block inline-flex items-center gap-2 bg-acid px-6 py-4 text-acid-foreground meta"
              >
                <Dices className="size-5" strokeWidth={3} aria-hidden="true" />
                Surprise me
              </button>
              <button
                type="button"
                onClick={retry}
                className="press print-block-sm inline-flex items-center gap-2 bg-surface px-5 py-4 meta"
              >
                <RefreshCw className="size-4" strokeWidth={3} aria-hidden="true" />
                New batch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTROL STRIP */}
      <section className="border-b-2 border-foreground bg-surface-secondary px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-[110rem] flex-wrap items-center gap-3">
          <h2 className="display mr-auto text-2xl sm:text-3xl">
            {CATEGORY_LABELS[applied.category]}
          </h2>

          {/* Mobile: bottom sheet. Desktop: side sheet with same panel. */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  className="press print-block-sm inline-flex items-center gap-2 bg-foreground px-4 py-3 text-background meta"
                >
                  <Filter className="size-4" strokeWidth={3} aria-hidden="true" />
                  Filters{activeCount > 0 ? ` · ${activeCount}` : ""}
                </button>
              }
            />
            <SheetContent
              side="bottom"
              className="max-h-[88vh] overflow-y-auto border-t-2 border-foreground bg-background sm:max-w-none"
            >
              <SheetHeader className="px-1 text-left">
                <SheetTitle className="display text-3xl">Tune the gallery</SheetTitle>
              </SheetHeader>
              <div className="px-1 pt-4">
                <FilterPanel
                  draft={draft}
                  onChange={setDraft}
                  onApply={() => {
                    applyDraft();
                    setSheetOpen(false);
                  }}
                  onClear={() => {
                    clear();
                    setSheetOpen(false);
                  }}
                  layout="sheet"
                />
              </div>
            </SheetContent>
          </Sheet>

          {activeCount > 0 && (
            <button
              type="button"
              onClick={clear}
              className="press print-block-sm bg-surface px-4 py-3 meta"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* GALLERY */}
      <section className="px-4 py-10 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-[110rem]">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
              <JokeSkeleton count={6} />
            </div>
          ) : error && jokes.length === 0 ? (
            <div className="print-block mx-auto max-w-3xl bg-surface p-8 text-center sm:p-14">
              <p className="display text-4xl sm:text-6xl">
                {error.kind === "empty" ? "Nothing funny here." : "The jokes have left the building."}
              </p>
              <p className="mt-4 text-muted-foreground">{error.message}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={retry}
                  className="press print-block-sm bg-shock px-6 py-3 text-shock-foreground meta"
                >
                  Try again
                </button>
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={clear}
                    className="press print-block-sm bg-surface px-6 py-3 meta"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <JokeGrid
                jokes={jokes}
                loadingMore={isLoadingMore}
                isFavorite={(joke) => isFavorite(joke)}
                onFavorite={onFavorite}
              />
              <div className="mt-12 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="press print-block inline-flex items-center gap-3 bg-cobalt px-8 py-5 text-cobalt-foreground meta disabled:opacity-70"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="size-5 animate-spin" strokeWidth={3} aria-hidden="true" />
                      Printing
                    </>
                  ) : (
                    "Load more jokes"
                  )}
                </button>
                {error && jokes.length > 0 && (
                  <p className="meta text-destructive">{error.message}</p>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
