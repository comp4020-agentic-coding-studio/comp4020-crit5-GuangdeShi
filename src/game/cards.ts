// A standard 52-card deck: no jokers.

export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";
export type Color = "red" | "black";

export interface Card {
  readonly id: string;
  readonly rank: Rank;
  readonly suit: Suit;
  readonly color: Color;
}

const SUITS: readonly Suit[] = ["hearts", "diamonds", "clubs", "spades"];
const RANKS: readonly Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function colorOf(suit: Suit): Color {
  return suit === "hearts" || suit === "diamonds" ? "red" : "black";
}

export function buildDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ id: `${rank}-${suit}`, rank, suit, color: colorOf(suit) });
    }
  }
  return deck;
}

/** Fisher-Yates. `rng` defaults to Math.random but accepts a seeded source for tests. */
export function shuffle<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
