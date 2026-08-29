import { buildDeck, shuffle, type Card } from "./cards.ts";
import { levelConfig } from "./levels.ts";

export interface Round {
  /** The sequence to memorise, in order. */
  readonly target: Card[];
  /**
   * Every candidate card for this round, in the fixed order they're offered
   * in — includes every target card exactly once plus distractors, shuffled
   * once. This order never changes during play: a card that returns from the
   * answer goes back to this same position.
   */
  readonly candidates: Card[];
}

/** Builds one round: a shuffled deck gives both a random target sequence and
 *  a random pick of distractors in the same draw, so nothing needs shuffling
 *  twice. */
export function generateRound(level: number, rng: () => number = Math.random): Round {
  const config = levelConfig(level);
  const deck = shuffle(buildDeck(), rng);
  const target = deck.slice(0, config.targetCount);
  const distractors = deck.slice(config.targetCount, config.candidateCount);
  const candidates = shuffle([...target, ...distractors], rng);
  return { target, candidates };
}
