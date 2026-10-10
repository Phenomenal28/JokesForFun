import { toast } from "sonner";
import { Copy, Trash2, X } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { jokeToPlainText } from "@/types/joke";
import { usePage } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const TONES = [
  "bg-acid text-acid-foreground",
  "bg-surface text-foreground",
  "bg-foreground text-background",
  "bg-flame text-flame-foreground",
] as const;

export function FavoritesView() {
  const { favorites, remove, clear } = useFavorites();
  const { navigate } = usePage();

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied.");
    } catch (error) {
      console.error("[favorites] copy failed", error);
      toast("Couldn't copy that.");
    }
  }

  if (favorites.length === 0) {
    return (
      <div className="print-block mx-auto max-w-3xl bg-surface p-8 text-center sm:p-14">
        <p className="display text-4xl sm:text-6xl">
          Your joke collection
          <br />
          is empty.
        </p>
        <p className="mt-4 text-muted-foreground">Find something worth saving.</p>
        <button
          type="button"
          onClick={() => navigate("home")}
          className="press print-block-sm mt-8 inline-block bg-shock px-6 py-3 text-shock-foreground meta"
        >
          Back to the gallery
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="meta text-muted-foreground">
          {favorites.length} joke{favorites.length === 1 ? "" : "s"} kept
        </p>
        <button
          type="button"
          onClick={() => {
            clear();
            toast("Collection cleared.");
          }}
          className="press print-block-sm inline-flex items-center gap-2 bg-surface px-4 py-2 meta hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="size-4" strokeWidth={3} aria-hidden="true" />
          Clear collection
        </button>
      </div>

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {favorites.map((joke, index) => {
          const text = jokeToPlainText(joke);
          return (
            <li
              key={joke.uid}
              className={cn("print-block flex flex-col gap-4 p-5 sm:p-6", TONES[index % TONES.length])}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="meta border-2 border-current px-2 py-1">{joke.category}</span>
                <button
                  type="button"
                  onClick={() => remove(joke.uid)}
                  aria-label="Remove from collection"
                  className="press inline-flex border-2 border-current p-2"
                >
                  <X className="size-4" strokeWidth={3} aria-hidden="true" />
                </button>
              </div>
              <p className="display normal-case text-2xl">{joke.setup ?? joke.text}</p>
              {joke.delivery && <p className="font-semibold leading-tight">{joke.delivery}</p>}
              <button
                type="button"
                onClick={() => copy(text)}
                className="press mt-auto inline-flex items-center gap-2 border-2 border-current px-3 py-2 meta"
              >
                <Copy className="size-4" strokeWidth={3} aria-hidden="true" />
                Copy
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}