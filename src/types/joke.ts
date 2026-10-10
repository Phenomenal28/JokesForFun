export const JOKE_CATEGORIES = [
  "Any",
  "Programming",
  "Misc",
  "Dark",
  "Pun",
  "Spooky",
  "Christmas",
] as const;

export type JokeCategory = (typeof JOKE_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<JokeCategory, string> = {
  Any: "Anything",
  Programming: "Programming",
  Misc: "Miscellaneous",
  Dark: "Dark",
  Pun: "Puns",
  Spooky: "Spooky",
  Christmas: "Christmas",
};

export const JOKE_TYPES = ["Any", "single", "twopart"] as const;
export type JokeTypeFilter = (typeof JOKE_TYPES)[number];

export const TYPE_LABELS: Record<JokeTypeFilter, string> = {
  Any: "Any format",
  single: "One-liner",
  twopart: "Setup & punchline",
};

export const BLACKLIST_FLAGS = [
  "nsfw",
  "religious",
  "political",
  "racist",
  "sexist",
  "explicit",
] as const;

export type BlacklistFlag = (typeof BLACKLIST_FLAGS)[number];

export const FLAG_LABELS: Record<BlacklistFlag, string> = {
  nsfw: "Not safe for work",
  religious: "Religious",
  political: "Political",
  racist: "Racist",
  sexist: "Sexist",
  explicit: "Explicit language",
};

export interface JokeFilters {
  category: JokeCategory;
  type: JokeTypeFilter;
  /** Flags the user wants excluded from results. */
  blacklist: BlacklistFlag[];
  safeMode: boolean;
}

export const DEFAULT_FILTERS: JokeFilters = {
  category: "Any",
  type: "Any",
  blacklist: [],
  safeMode: false,
};

/** Normalized joke used everywhere in the UI. */
export interface Joke {
  id: number;
  /** Stable key: API ids can repeat across categories. */
  uid: string;
  category: string;
  type: "single" | "twopart";
  text: string | null;
  setup: string | null;
  delivery: string | null;
  flags: BlacklistFlag[];
  safe: boolean;
  lang: string;
}

export interface FavoriteJoke {
  uid: string;
  id: number;
  category: string;
  type: "single" | "twopart";
  text: string | null;
  setup: string | null;
  delivery: string | null;
  savedAt: number;
}

export function jokeToPlainText(joke: Pick<Joke, "type" | "text" | "setup" | "delivery">) {
  if (joke.type === "twopart") {
    return `${joke.setup ?? ""}\n\n${joke.delivery ?? ""}`.trim();
  }
  return (joke.text ?? "").trim();
}