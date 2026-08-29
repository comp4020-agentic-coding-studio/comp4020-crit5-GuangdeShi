import { describe, expect, it } from "vitest";
import { buildDeck } from "../src/game/cards.ts";
import { generateRound } from "../src/game/generate.ts";
import { MAX_LEVEL, levelConfig } from "../src/game/levels.ts";
import {
  type GameState,
  advance,
  deselectCard,
  selectCard,
  startGame,
  startLevel,
  tickMemorize,
  tickRecall,
} from "../src/game/state.ts";

/** Runs the memorize countdown to completion, however many seconds it takes. */
function finishMemorize(state: GameState): GameState {
  while (state.phase === "memorize") state = tickMemorize(state);
  return state;
}

describe("buildDeck", () => {
  it("has 52 unique cards, no jokers", () => {
    const deck = buildDeck();
    expect(deck.length).toBe(52);
    expect(new Set(deck.map((card) => card.id)).size).toBe(52);
  });
});

describe("level configuration", () => {
  it("has 12 levels, indexed from 1", () => {
    expect(MAX_LEVEL).toBe(12);
    expect(levelConfig(1).level).toBe(1);
    expect(levelConfig(12).level).toBe(12);
  });

});

describe("generateRound", () => {
  for (let level = 1; level <= MAX_LEVEL; level++) {
    it(`level ${level}: candidate pool is the configured size, unique, and contains every target card exactly once`, () => {
      const config = levelConfig(level);
      const { target, candidates } = generateRound(level);

      expect(target.length).toBe(config.targetCount);
      expect(candidates.length).toBe(config.candidateCount);
      expect(new Set(candidates.map((card) => card.id)).size).toBe(config.candidateCount);

      for (const card of target) {
        expect(candidates.filter((candidate) => candidate.id === card.id).length).toBe(1);
      }
    });
  }
});

describe("game state transitions", () => {
  it("counts the memorize timer down to zero, then flips to recall", () => {
    let state = startLevel(1, () => 0); // deterministic shuffle
    expect(state.phase).toBe("memorize");
    const config = levelConfig(1);
    for (let i = 0; i < config.memorizeSeconds - 1; i++) state = tickMemorize(state);
    expect(state.phase).toBe("memorize");
    state = finishMemorize(state);
    expect(state.phase).toBe("recall");
    expect(state.recallSecondsLeft).toBe(config.recallSeconds);
  });

  it("ends in failure when the recall timer runs out before the answer is complete", () => {
    let state = startLevel(1, () => 0);
    state = finishMemorize(state);
    for (let i = 0; i < 100 && state.phase === "recall"; i++) state = tickRecall(state);
    expect(state.phase).toBe("failure");
    expect(state.outcome).toBe("timeout");
  });

  it("selecting every target card in order reaches success without a submit step", () => {
    let state = startLevel(1, () => 0);
    state = finishMemorize(state);
    for (const card of state.target) state = selectCard(state, card.id);
    expect(state.phase).toBe("success");
    expect(state.outcome).toBe("correct");
  });

  it("selecting the target cards out of order reaches failure", () => {
    let state = startLevel(1, () => 0);
    state = finishMemorize(state);
    const reversed = [...state.target].reverse();
    for (const card of reversed) state = selectCard(state, card.id);
    expect(state.phase).toBe("failure");
    expect(state.outcome).toBe("incorrect");
  });

  it("deselecting a placed card returns it to the pool and shifts later cards left", () => {
    let state = startLevel(1, () => 0);
    state = finishMemorize(state);
    const [first, second] = state.target;
    state = selectCard(state, first.id);
    state = selectCard(state, second.id);
    expect(state.answer.map((c) => c.id)).toEqual([first.id, second.id]);

    state = deselectCard(state, first.id);
    expect(state.answer.map((c) => c.id)).toEqual([second.id]);
  });

  it("advances to the next level after success, and to win after level 12", () => {
    let state = startLevel(MAX_LEVEL, () => 0);
    state = finishMemorize(state);
    for (const card of state.target) state = selectCard(state, card.id);
    expect(state.phase).toBe("success");
    state = advance(state);
    expect(state.phase).toBe("win");
  });

  it("startGame begins at level 1 in the memorize phase", () => {
    const state = startGame(() => 0);
    expect(state.level).toBe(1);
    expect(state.phase).toBe("memorize");
  });
});
