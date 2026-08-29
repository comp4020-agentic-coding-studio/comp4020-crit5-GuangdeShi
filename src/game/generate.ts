import { buildDeck, shuffle, type Card } from "./cards.ts";
import { levelConfig } from "./levels.ts";

export interface Round {
  /** The sequence to memorise, in order. */
  readonly target: Card[];
  /**
   * A `candidateCount`-sized subset of the 52-card deck, shuffled into a
   * fresh position order for this round: every target card, plus enough
   * distractors drawn from the rest of the deck to reach the pool size. This
   * order never changes during play — a card that returns from the answer
   * goes back to this same grid position.
   */
  readonly candidates: Card[];
}

/** Builds one round: an independent shuffle of the full deck picks the
 *  target sequence, then the candidate pool is assembled from that target
 *  plus randomly drawn distractors (so a card's grid position gives no hint
 *  about its place in the target order), and shuffled once more into its
 *  final on-screen order. */
export function generateRound(level: number, rng: () => number = Math.random): Round {
  const config = levelConfig(level);
  const deck = buildDeck();

  const target = shuffle(deck, rng).slice(0, config.targetCount);
  const targetIds = new Set(target.map((card) => card.id));

  const rest = shuffle(
    deck.filter((card) => !targetIds.has(card.id)),
    rng,
  );
  const distractors = rest.slice(0, config.candidateCount - target.length);

  const candidates = shuffle([...target, ...distractors], rng);
  return { target, candidates };
}
