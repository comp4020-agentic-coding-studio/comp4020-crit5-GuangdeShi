import { buildDeck, shuffle, type Card } from "./cards.ts";
import { levelConfig } from "./levels.ts";

export interface Round {
  /** The sequence to memorise, in order. */
  readonly target: Card[];
  /**
   * The full 52-card deck, shuffled into a fresh position order for this
   * round. Always every card, exactly once — the target is drawn from this
   * same deck, so it's guaranteed to appear in here exactly once per card.
   * This order never changes during play: a card that returns from the
   * answer goes back to this same grid position.
   */
  readonly candidates: Card[];
}

/** Builds one round: the full deck shuffled once for the candidate grid, and
 *  shuffled again (independently) to pick the target sequence — so a card's
 *  position in the grid gives no hint about its place in the target order. */
export function generateRound(level: number, rng: () => number = Math.random): Round {
  const config = levelConfig(level);
  const deck = buildDeck();
  const candidates = shuffle(deck, rng);
  const target = shuffle(deck, rng).slice(0, config.targetCount);
  return { target, candidates };
}
