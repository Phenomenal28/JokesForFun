/** Skeletons mirror the real poster cards so the layout never shifts. */
export function JokeSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="print-block flex animate-pulse flex-col gap-5 bg-surface p-5 sm:p-7"
          style={{ animationDelay: `${i * 90}ms` }}
        >
          <div className="flex gap-2">
            <div className="h-6 w-24 border-2 border-foreground/20 bg-surface-secondary" />
            <div className="h-6 w-16 bg-surface-secondary" />
          </div>
          <div className="space-y-3 pt-2">
            <div className="h-7 w-[92%] bg-surface-secondary" />
            <div className="h-7 w-[70%] bg-surface-secondary" />
            <div className="h-5 w-[55%] bg-acid/40" />
          </div>
          <div className="mt-auto flex gap-2 border-t-2 border-foreground/15 pt-4">
            <div className="h-9 w-24 bg-surface-secondary" />
            <div className="h-9 w-24 bg-surface-secondary" />
          </div>
        </div>
      ))}
    </>
  );
}