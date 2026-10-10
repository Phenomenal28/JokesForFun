import { animate, stagger, utils } from "animejs";

type Target = Element | null;

function q(root: Element, selector: string): Element[] {
  return Array.from(root.querySelectorAll(selector));
}

/** Staggered poster entrance for a batch of cards. Returns a cleanup fn. */
export function jokeEntrance(root: Target, reduced: boolean) {
  if (!root) return () => {};
  const cards = q(root, "[data-joke-card][data-entered='false']");
  if (cards.length === 0) return () => {};

  cards.forEach((card) => card.setAttribute("data-entered", "true"));

  if (reduced) {
    utils.set(cards, { opacity: 1, translateY: 0, rotate: 0, scale: 1 });
    return () => {};
  }

  const cardAnim = animate(cards, {
    opacity: [0, 1],
    translateY: [28, 0],
    scale: [0.97, 1],
    duration: 520,
    ease: "outQuint",
    delay: stagger(70),
  });

  const texts = cards.flatMap((card) => q(card, "[data-joke-text]"));
  const textAnim = texts.length
    ? animate(texts, {
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 460,
        ease: "outQuad",
        delay: stagger(70, { start: 140 }),
      })
    : null;

  const metas = cards.flatMap((card) => q(card, "[data-joke-meta]"));
  const metaAnim = metas.length
    ? animate(metas, {
        opacity: [0, 1],
        translateX: [-10, 0],
        duration: 380,
        ease: "outQuad",
        delay: stagger(40, { start: 220 }),
      })
    : null;

  return () => {
    // Finalize instead of leaving half-played state behind (a paused
    // entrance would otherwise strand cards at opacity 0).
    cardAnim.pause();
    textAnim?.pause();
    metaAnim?.pause();
    utils.set(cards, { opacity: 1, translateY: 0, scale: 1 });
    if (texts.length) utils.set(texts, { opacity: 1, translateY: 0 });
    if (metas.length) utils.set(metas, { opacity: 1, translateX: 0 });
  };
}

/** Short confirmation pop, used for favorite / copy. */
export function popConfirm(target: Target, reduced: boolean) {
  if (!target || reduced) return;
  animate(target, {
    scale: [1, 1.35, 1],
    rotate: [0, -12, 0],
    duration: 420,
    ease: "outElastic(1, .55)",
  });
}

/** Lever-pull feel for Surprise Me. */
export function leverPull(target: Target, reduced: boolean) {
  if (!target || reduced) return;
  animate(target, {
    translateY: [0, 8, -4, 0],
    rotate: [0, 1.5, -1, 0],
    duration: 520,
    ease: "outBack",
  });
}

/** Slow ambient drift for decorative shapes. Returns cleanup. */
export function backgroundMotion(root: Target, reduced: boolean) {
  if (!root || reduced) return () => {};
  const shapes = q(root, "[data-drift]");
  const anims = shapes.map((shape, index) =>
    animate(shape, {
      translateX: [0, index % 2 === 0 ? 26 : -22],
      translateY: [0, index % 3 === 0 ? -30 : 24],
      rotate: [0, index % 2 === 0 ? 22 : -18],
      duration: 14000 + index * 2600,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    }),
  );
  return () => anims.forEach((a) => a.pause());
}