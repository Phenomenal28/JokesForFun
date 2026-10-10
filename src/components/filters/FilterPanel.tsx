import { Check } from "lucide-react";
import {
  BLACKLIST_FLAGS,
  CATEGORY_LABELS,
  FLAG_LABELS,
  JOKE_CATEGORIES,
  JOKE_TYPES,
  TYPE_LABELS,
  type BlacklistFlag,
  type JokeFilters,
} from "@/types/joke";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  draft: JokeFilters;
  onChange: (next: JokeFilters) => void;
  onApply: () => void;
  onClear: () => void;
  layout: "inline" | "sheet";
}

function Chip({
  active,
  children,
  onClick,
  accent = "ink",
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  accent?: "ink" | "shock";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "press meta border-2 border-foreground px-3 py-2",
        active
          ? accent === "shock"
            ? "bg-shock text-shock-foreground"
            : "bg-foreground text-background"
          : "bg-surface text-foreground hover:bg-acid",
      )}
    >
      {children}
    </button>
  );
}

export function FilterPanel({ draft, onChange, onApply, onClear, layout }: FilterPanelProps) {
  function toggleFlag(flag: BlacklistFlag) {
    const has = draft.blacklist.includes(flag);
    onChange({
      ...draft,
      blacklist: has ? draft.blacklist.filter((f) => f !== flag) : [...draft.blacklist, flag],
    });
  }

  return (
    <div className={cn("space-y-7", layout === "sheet" && "pb-24")}>
      <fieldset>
        <legend className="meta mb-3 text-muted-foreground">Category</legend>
        <div className="flex flex-wrap gap-2">
          {JOKE_CATEGORIES.map((category) => (
            <Chip
              key={category}
              active={draft.category === category}
              onClick={() => onChange({ ...draft, category })}
            >
              {CATEGORY_LABELS[category]}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="meta mb-3 text-muted-foreground">Format</legend>
        <div className="flex flex-wrap gap-2">
          {JOKE_TYPES.map((type) => (
            <Chip
              key={type}
              active={draft.type === type}
              onClick={() => onChange({ ...draft, type })}
            >
              {TYPE_LABELS[type]}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="meta mb-1 text-muted-foreground">Leave out</legend>
        <p className="mb-3 max-w-md text-sm text-muted-foreground">
          Anything you tick here is filtered out before jokes reach you.
        </p>
        <div className="flex flex-wrap gap-2">
          <Chip
            accent="shock"
            active={draft.safeMode}
            onClick={() => onChange({ ...draft, safeMode: !draft.safeMode })}
          >
            <span className="inline-flex items-center gap-2">
              {draft.safeMode && <Check className="size-3.5" strokeWidth={4} aria-hidden="true" />}
              Keep it clean
            </span>
          </Chip>
          {BLACKLIST_FLAGS.map((flag) => (
            <Chip
              key={flag}
              active={draft.blacklist.includes(flag)}
              onClick={() => toggleFlag(flag)}
            >
              <span className="inline-flex items-center gap-2">
                {draft.blacklist.includes(flag) && (
                  <Check className="size-3.5" strokeWidth={4} aria-hidden="true" />
                )}
                {FLAG_LABELS[flag]}
              </span>
            </Chip>
          ))}
        </div>
      </fieldset>

      <div
        className={cn(
          "flex flex-wrap gap-3 border-t-2 border-foreground pt-5",
          layout === "sheet" &&
            "fixed inset-x-0 bottom-0 border-t-2 bg-background p-4 shadow-[0_-6px_0_0_var(--foreground)]",
        )}
      >
        <button
          type="button"
          onClick={onApply}
          className="press print-block-sm bg-foreground px-5 py-3 text-background meta"
        >
          Apply filters
        </button>
        <button
          type="button"
          onClick={onClear}
          className="press print-block-sm bg-surface px-5 py-3 meta"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}