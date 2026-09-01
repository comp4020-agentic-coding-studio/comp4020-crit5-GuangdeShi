import type { Card, Rank } from "../game/cards.ts";

const RANK_WORD: Record<Rank, string> = {
  A: "ace",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "10": "10",
  J: "jack",
  Q: "queen",
  K: "king",
};

// Vendored from https://github.com/hayeah/playing-cards-assets (MIT) — see
// public/cards/ATTRIBUTION.md.
export function cardFaceSrc(card: Card): string {
  return `./cards/${RANK_WORD[card.rank]}_of_${card.suit}.png`;
}

export function cardFaceAlt(card: Card): string {
  const rankWord = card.rank === "A" ? "Ace" : card.rank === "J" ? "Jack" : card.rank === "Q" ? "Queen" : card.rank === "K" ? "King" : card.rank;
  const suit = card.suit.charAt(0).toUpperCase() + card.suit.slice(1);
  return `${rankWord} of ${suit}`;
}
