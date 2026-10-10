import {
  BLACKLIST_FLAGS,
  type BlacklistFlag,
  type Joke,
  type JokeFilters,
} from "@/types/joke";

const BASE_URL = "https://v2.jokeapi.dev/joke";

/** Raw JokeAPI shapes — never leaked to the UI. */
interface RawJokeBase {
  error: false;
  id: number;
  category: string;
  safe: boolean;
  lang: string;
  flags?: Partial<Record<BlacklistFlag, boolean>>;
}
type RawJoke =
  | (RawJokeBase & { type: "single"; joke: string })
  | (RawJokeBase & { type: "twopart"; setup: string; delivery: string });

interface RawErrorResponse {
  error: true;
  message?: string;
  additionalInfo?: string;
  code?: number;
}

interface RawMultiResponse {
  error: false;
  amount: number;
  jokes: RawJoke[];
}

export type JokeApiErrorKind = "network" | "http" | "api" | "shape" | "empty";

export class JokeApiError extends Error {
  readonly kind: JokeApiErrorKind;
  readonly detail?: string;

  constructor(message: string, kind: JokeApiErrorKind, detail?: string) {
    super(message);
    this.name = "JokeApiError";
    this.kind = kind;
    this.detail = detail;
  }
}

export function buildJokeQuery(filters: JokeFilters, amount: number): string {
  const params = new URLSearchParams();
  params.set("amount", String(Math.min(Math.max(amount, 1), 10)));

  if (filters.type !== "Any") params.set("type", filters.type);

  const flags = new Set<BlacklistFlag>(filters.blacklist);
  if (filters.safeMode) {
    params.set("safe-mode", "");
  }
  if (flags.size > 0) {
    params.set("blacklistFlags", [...flags].join(","));
  }

  const category = filters.category === "Any" ? "Any" : filters.category;
  const qs = params.toString().replace(/safe-mode=$/, "safe-mode").replace(/safe-mode=&/, "safe-mode&");
  return `${BASE_URL}/${category}?${qs}`;
}

function normalize(raw: RawJoke, seed: number): Joke {
  const flags = BLACKLIST_FLAGS.filter((f) => raw.flags?.[f]);
  const base = {
    id: raw.id,
    uid: `${raw.category}-${raw.id}-${seed}`,
    category: raw.category,
    flags,
    safe: Boolean(raw.safe),
    lang: raw.lang ?? "en",
  };
  if (raw.type === "twopart") {
    return { ...base, type: "twopart", text: null, setup: raw.setup, delivery: raw.delivery };
  }
  return { ...base, type: "single", text: raw.joke, setup: null, delivery: null };
}

function isRawJoke(value: unknown): value is RawJoke {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  if (typeof v["id"] !== "number") return false;
  if (v["type"] === "single") return typeof v["joke"] === "string";
  if (v["type"] === "twopart")
    return typeof v["setup"] === "string" && typeof v["delivery"] === "string";
  return false;
}

/** Fetch and normalize a batch of jokes. Throws JokeApiError only. */
export async function fetchJokes(filters: JokeFilters, amount = 6, signal?: AbortSignal): Promise<Joke[]> {
  const url = buildJokeQuery(filters, amount);

  let response: Response;
  try {
    response = await fetch(url, { signal: signal ?? null, headers: { Accept: "application/json" } });

  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    console.error("[jokeApi] network failure", { url, error });
    throw new JokeApiError("We couldn't reach the joke vault.", "network");
  }

  if (response.status === 429) {
    throw new JokeApiError("Too many jokes, too fast. Give it a breath.", "http", "429");
  }
  if (!response.ok) {
    console.error("[jokeApi] http error", { url, status: response.status });
    throw new JokeApiError("The joke vault answered with a shrug.", "http", String(response.status));
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (error) {
    console.error("[jokeApi] invalid json", { url, error });
    throw new JokeApiError("That response wasn't readable.", "shape");
  }

  if (typeof payload !== "object" || payload === null) {
    throw new JokeApiError("That response wasn't readable.", "shape");
  }

  if ((payload as RawErrorResponse).error === true) {
    const err = payload as RawErrorResponse;
    console.error("[jokeApi] api error", { url, err });
    throw new JokeApiError(
      err.code === 106
        ? "No jokes match those filters."
        : "The joke vault refused that request.",
      err.code === 106 ? "empty" : "api",
      err.message,
    );
  }

  const seed = Date.now();
  const multi = payload as RawMultiResponse;
  const rawList = Array.isArray(multi.jokes) ? multi.jokes : [payload];
  const jokes = rawList.filter(isRawJoke).map((raw, i) => normalize(raw, seed + i));

  if (jokes.length === 0) {
    throw new JokeApiError("No jokes match those filters.", "empty");
  }
  return jokes;
}