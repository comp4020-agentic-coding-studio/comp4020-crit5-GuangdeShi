import { describe, expect, it } from "vitest";
import type { Card } from "../src/game/cards.ts";
import { isSequenceCorrect } from "../src/game/validate.ts";

// The real game rule under test: a recalled sequence is correct only when
// every card identity matches the target in exactly the same order.

function card(rank: Card["rank"], suit: Card["suit"]): Card {
  const color = suit === "hearts" || suit === "diamonds" ? "red" : "black";
  return { id: `${rank}-${suit}`, rank, suit, color };
}

describe("isSequenceCorrect", () => {
  const target = [card("3", "hearts"), card("4", "diamonds"), card("5", "clubs")];

  it("is correct when identity and order both match", () => {
    const answer = [card("3", "hearts"), card("4", "diamonds"), card("5", "clubs")];
    expect(isSequenceCorrect(target, answer)).toBe(true);
  });

  it("is wrong when the same cards are in the wrong order", () => {
    const answer = [card("3", "hearts"), card("5", "clubs"), card("4", "diamonds")];
    expect(isSequenceCorrect(target, answer)).toBe(false);
  });

  it("is wrong when the answer is short", () => {
    const answer = [card("3", "hearts"), card("4", "diamonds")];
    expect(isSequenceCorrect(target, answer)).toBe(false);
  });

  it("is wrong when a card's suit doesn't match, even with the same rank in place", () => {
    const answer = [card("3", "hearts"), card("4", "diamonds"), card("5", "spades")];
    expect(isSequenceCorrect(target, answer)).toBe(false);
  });
});
