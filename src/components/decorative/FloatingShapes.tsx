import { useEffect, useRef } from "react";
import { backgroundMotion } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Slow-drifting riso shapes. Decorative only, hidden from assistive tech. */
export function FloatingShapes() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => backgroundMotion(root.current, reduced), [reduced]);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        data-drift
        className="absolute -left-16 top-10 hidden size-64 rounded-full border-2 border-foreground bg-acid/60 mix-blend-multiply sm:block"
      />
      <div
        data-drift
        className="absolute right-[-3rem] top-32 hidden size-40 rotate-12 border-2 border-foreground bg-flame/50 mix-blend-multiply sm:block sm:size-56"
      />
      <div
        data-drift
        className="halftone absolute bottom-24 left-1/3 hidden h-32 w-56 opacity-30 md:block"
      />
      <div
        data-drift
        className="absolute bottom-10 right-1/4 hidden size-24 sm:block bg-shock/40 mix-blend-multiply md:block"
        style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}
      />
    </div>
  );
}
