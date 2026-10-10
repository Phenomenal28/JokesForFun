import { useRef } from "react";
import { Copy, Heart, Share2 } from "lucide-react";
import { popConfirm } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface JokeActionsProps {
  isFavorite: boolean;
  onFavorite: () => void;
  onShare: () => void;
  label: string;
  tone: "ink" | "paper";
}

export function JokeActions({ isFavorite, onFavorite, onShare, label, tone }: JokeActionsProps) {
  const heart = useRef<HTMLSpanElement>(null);
  const shareIcon = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  const base =
    "press inline-flex items-center gap-2 border-2 px-3 py-2 meta focus-visible:outline-offset-4";
  const skin =
    tone === "ink"
      ? "border-background text-background hover:bg-background hover:text-foreground"
      : "border-foreground text-foreground hover:bg-foreground hover:text-background";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => {
          popConfirm(heart.current, reduced);
          onFavorite();
        }}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `Remove ${label} from collection` : `Save ${label} to collection`}
        className={cn(base, skin, isFavorite && "bg-shock text-shock-foreground border-shock")}
      >
        <span ref={heart} className="inline-flex">
          <Heart className="size-4" strokeWidth={3} fill={isFavorite ? "currentColor" : "none"} />
        </span>
        {isFavorite ? "Saved" : "Save"}
      </button>

      <button
        type="button"
        onClick={() => {
          popConfirm(shareIcon.current, reduced);
          onShare();
        }}
        aria-label={`Share ${label}`}
        className={cn(base, skin)}
      >
        <span ref={shareIcon} className="inline-flex">
          {typeof navigator !== "undefined" && "share" in navigator ? (
            <Share2 className="size-4" strokeWidth={3} />
          ) : (
            <Copy className="size-4" strokeWidth={3} />
          )}
        </span>
        Share
      </button>
    </div>
  );
}