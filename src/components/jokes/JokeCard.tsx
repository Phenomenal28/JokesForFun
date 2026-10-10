import { toast } from "sonner";
import { JokeActions } from "./JokeActions";
import { jokeToPlainText, type Joke } from "@/types/joke";
import { cn } from "@/lib/utils";

/**
 * Controlled variation: five poster treatments that share one design system.
 * Variant is derived from the joke id so a card never reshuffles on re-render.
 */
const VARIANTS = [
  {
    // A — acid field, heavy type
    shell: "bg-acid text-acid-foreground",
    tone: "paper" as const,
    number: "text-acid-foreground/25",
    rotate: "sm:-rotate-[0.6deg]",
    ornament: "bg-foreground",
  },
  {
    // B — ink field, shock accent
    shell: "bg-foreground text-background",
    tone: "ink" as const,
    number: "text-shock",
    rotate: "sm:rotate-[0.7deg]",
    ornament: "bg-shock",
  },
  {
    // C — paper poster, slight tilt
    shell: "bg-surface text-foreground",
    tone: "paper" as const,
    number: "text-foreground/15",
    rotate: "sm:-rotate-[1.2deg]",
    ornament: "bg-flame",
  },
  {
    // D — monochrome with one aggressive accent
    shell: "bg-surface-secondary text-foreground",
    tone: "paper" as const,
    number: "text-cobalt",
    rotate: "sm:rotate-[0.4deg]",
    ornament: "bg-cobalt",
  },
  {
    // E — flame field, asymmetric
    shell: "bg-flame text-flame-foreground",
    tone: "paper" as const,
    number: "text-flame-foreground/25",
    rotate: "sm:-rotate-[0.3deg]",
    ornament: "bg-foreground",
  },
] as const;

interface JokeCardProps {
  joke: Joke;
  index: number;
  isFavorite: boolean;
  onFavorite: () => void;
  /** Bigger, wider treatment for the lead card in the grid. */
  featured?: boolean;
}

export function JokeCard({ joke, index, isFavorite, onFavorite, featured = false }: JokeCardProps) {
  const variant = VARIANTS[(joke.id + index) % VARIANTS.length]!;
  const text = jokeToPlainText(joke);

  async function share() {
    const payload = `${text}\n\n— riso jokes`;
    const nav: Navigator | undefined = typeof navigator === "undefined" ? undefined : navigator;
    if (!nav) return;
    try {
      if (typeof nav.share === "function") {
        await nav.share({ title: "A joke", text: payload });
        return;
      }
      await nav.clipboard.writeText(payload);
      toast("Copied.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("[share] failed", error);
      toast("Couldn't share that one.");
    }
  }


  return (
    <article
      data-joke-card
      data-entered="false"
      style={{ opacity: 0 }}
      className={cn(
        "print-block relative flex flex-col gap-5 p-5 transition-transform duration-200 sm:p-7",
        "hover:-translate-y-1",
        variant.shell,
        variant.rotate,
        featured && "md:col-span-2 md:row-span-1",
      )}
    >
      <span
        aria-hidden="true"
        className={cn("absolute right-3 top-1 display select-none", variant.number, featured ? "text-8xl sm:text-9xl" : "text-6xl sm:text-7xl")}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div data-joke-meta className="flex flex-wrap items-center gap-2 pr-16">
        <span className="meta border-2 border-current px-2 py-1">{joke.category}</span>
        <span className="meta opacity-70">
          {joke.type === "twopart" ? "setup · punchline" : "one-liner"}
        </span>
        {joke.flags.length > 0 && (
          <span className="meta opacity-70">· {joke.flags.join(" / ")}</span>
        )}
      </div>

      <div data-joke-text className="relative">
        <span aria-hidden="true" className={cn("absolute -left-2 -top-3 h-2 w-14", variant.ornament)} />
        {joke.type === "twopart" ? (
          <div className="space-y-4 pt-4">
            <h3
              className={cn(
                "display normal-case",
                featured ? "text-3xl sm:text-5xl" : "text-2xl sm:text-3xl",
              )}
            >
              {joke.setup}
            </h3>
            <p
              className={cn(
                "font-sans font-semibold leading-tight",
                featured ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
              )}
            >
              {joke.delivery}
            </p>
          </div>
        ) : (
          <h3
            className={cn(
              "display normal-case pt-4",
              featured ? "text-3xl sm:text-5xl" : "text-2xl sm:text-[1.9rem]",
            )}
          >
            {joke.text}
          </h3>
        )}
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 border-t-2 border-current/30 pt-4">
        <JokeActions
          isFavorite={isFavorite}
          onFavorite={onFavorite}
          onShare={share}
          label={`joke ${index + 1}`}
          tone={variant.tone}
        />
        <span className="meta hidden opacity-50 sm:block">#{joke.id}</span>
      </div>
    </article>
  );
}