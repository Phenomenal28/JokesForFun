export function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-foreground bg-surface-secondary">
      <div className="mx-auto flex max-w-[110rem] flex-col gap-4 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <p className="display text-4xl leading-none sm:text-6xl">
          GO ON
          <br />
          TELL SOMEONE
        </p>
        <div className="meta space-y-2 text-muted-foreground sm:text-right">
          <p>
            Jokes served by{" "}
            <a
              href="https://jokeapi.dev"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-shock decoration-2 underline-offset-4 hover:text-foreground"
            >
              JokeAPI v2
            </a>
          </p>
          <p>Everything you save stays in your browser</p>
        </div>
      </div>
    </footer>
  );
}