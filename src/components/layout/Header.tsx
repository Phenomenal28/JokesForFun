import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { usePage, type Page } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const NAV: { to: Page; label: string; desktopOnly?: boolean }[] = [
  { to: "home", label: "Gallery" },
  { to: "favorites", label: "Collection" },
  { to: "about", label: "About", desktopOnly: true },
];

export function Header() {
  const { favorites } = useFavorites();
  const { page, navigate } = usePage();

  return (
    <header className="border-b-2 border-foreground bg-background/80 backdrop-blur-[2px]">
      <div className="mx-auto flex max-w-[110rem] items-center gap-3 px-4 py-3 sm:px-8">
        <button
          type="button"
          onClick={() => navigate("home")}
          className="group flex shrink-0 items-baseline gap-2"
          aria-label="Riso Jokes home"
        >
          <span className="display bg-foreground px-2 py-1 text-xl text-background sm:text-2xl">
            Jokes
          </span>
          <span className="display text-xl sm:text-2xl">ForFun</span>
          <span className="meta hidden text-muted-foreground lg:inline">est. now</span>
        </button>

        <nav aria-label="Main" className="ml-auto flex items-center gap-1 sm:gap-4">
          {NAV.map((item) => {
            const active = page === item.to;
            return (
              <button
                key={item.to}
                type="button"
                onClick={() => navigate(item.to)}
                className={cn(
                  "meta px-1.5 py-2 transition-colors hover:text-shock sm:px-2",
                  item.desktopOnly && "hidden sm:inline-block",
                  active && "bg-foreground text-background",
                )}
              >
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => navigate("favorites")}
            className="press print-block-sm ml-1 shrink-0 inline-flex items-center gap-2 bg-shock px-3 py-2 text-shock-foreground"
            aria-label={`Saved jokes: ${favorites.length}`}
          >
            <Heart className="size-4" strokeWidth={3} aria-hidden="true" />
            <span className="meta">{favorites.length}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
