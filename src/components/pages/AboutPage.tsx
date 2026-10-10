import { usePage } from "@/lib/navigation";

const BLOCKS = [
  {
    title: "What this is",
    body: "A joke gallery dressed as a risograph print shop. Every joke arrives live from JokeAPI and gets typeset into one of five poster treatments.",
    tone: "bg-surface",
  },
  {
    title: "How filters work",
    body: "Pick a category and a format, then tick anything you'd rather not read. Those choices are sent to the API as content filters and remembered in your browser.",
    tone: "bg-acid text-acid-foreground",
  },
  {
    title: "Your data",
    body: "There is no account and no server of ours. Saved jokes and filter preferences live in this browser's local storage and never leave it.",
    tone: "bg-foreground text-background",
  },
  {
    title: "Credits",
    body: "Jokes by JokeAPI v2. Interface built with React, Tailwind, shadcn/ui primitives and anime.js. Motion respects your reduced-motion setting.",
    tone: "bg-flame text-flame-foreground",
  },
] as const;

export function AboutPage() {
  const { navigate } = usePage();

  return (
    <main id="main" className="flex-1 px-4 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[80rem] space-y-10">
        <h1 className="display text-[13vw] leading-[0.84] sm:text-[7rem]">About the press</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {BLOCKS.map((block) => (
            <section key={block.title} className={`print-block p-6 sm:p-8 ${block.tone}`}>
              <h2 className="display text-3xl">{block.title}</h2>
              <p className="mt-4 leading-relaxed">{block.body}</p>
            </section>
          ))}
        </div>
        <button
          type="button"
          onClick={() => navigate("home")}
          className="press print-block-sm inline-block bg-shock px-6 py-3 text-shock-foreground meta"
        >
          Back to the gallery
        </button>
      </div>
    </main>
  );
}
