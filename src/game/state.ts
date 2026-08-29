import type { Card } from "./cards.ts";
import { generateRound } from "./generate.ts";
import { levelConfig, MAX_LEVEL } from "./levels.ts";
import { isSequenceCorrect } from "./validate.ts";

export type Phase =
  | "opening" // before the first click: nothing has started yet
  | "memorize" // target shown face-up, memorize timer running
  | "recall" // candidates face-up, recall timer running, answer being built
  | "success" // answer completed and correct
  | "failure" // answer completed and wrong, or the recall timer expired
  | "win"; // level 12 cleared

export type Outcome = "correct" | "incorrect" | "timeout" | null;

export interface GameState {
  readonly phase: Phase;
  readonly level: number;
  readonly target: readonly Card[];
  readonly candidates: readonly Card[];
  readonly answer: readonly Card[];
  readonly memorizeSecondsLeft: number;
  readonly recallSecondsLeft: number;
  readonly outcome: Outcome;
}

export function initialState(): GameState {
  return {
    phase: "opening",
    level: 0,
    target: [],
    candidates: [],
    answer: [],
    memorizeSecondsLeft: 0,
    recallSecondsLeft: 0,
    outcome: null,
  };
}

/** Starts (or restarts into) the given level with a freshly generated round. */
export function startLevel(level: number, rng: () => number = Math.random): GameState {
  const config = levelConfig(level);
  const { target, candidates } = generateRound(level, rng);
  return {
    phase: "memorize",
    level,
    target,
    candidates,
    answer: [],
    memorizeSecondsLeft: config.memorizeSeconds,
    recallSecondsLeft: config.recallSeconds,
    outcome: null,
  };
}

export function startGame(rng: () => number = Math.random): GameState {
  return startLevel(1, rng);
}

/** One tick of the memorize countdown. Flips into recall at zero. */
export function tickMemorize(state: GameState): GameState {
  if (state.phase !== "memorize") return state;
  const secondsLeft = state.memorizeSecondsLeft - 1;
  if (secondsLeft > 0) return { ...state, memorizeSecondsLeft: secondsLeft };
  return { ...state, phase: "recall", memorizeSecondsLeft: 0 };
}

/** One tick of the recall countdown. Reaching zero before the answer is
 *  complete ends the run in failure. */
export function tickRecall(state: GameState): GameState {
  if (state.phase !== "recall") return state;
  const secondsLeft = state.recallSecondsLeft - 1;
  if (secondsLeft > 0) return { ...state, recallSecondsLeft: secondsLeft };
  return { ...state, phase: "failure", recallSecondsLeft: 0, outcome: "timeout" };
}

/** Clicking a face-up candidate: appends it to the answer. Auto-validates
 *  once the answer reaches the target length — no submit step. */
export function selectCard(state: GameState, cardId: string): GameState {
  if (state.phase !== "recall") return state;
  if (state.answer.length >= state.target.length) return state;
  if (state.answer.some((card) => card.id === cardId)) return state;
  const card = state.candidates.find((candidate) => candidate.id === cardId);
  if (!card) return state;

  const answer = [...state.answer, card];
  if (answer.length < state.target.length) return { ...state, answer };

  const correct = isSequenceCorrect(state.target, answer);
  return {
    ...state,
    answer,
    phase: correct ? "success" : "failure",
    outcome: correct ? "correct" : "incorrect",
  };
}

/** Clicking a placed card removes it from the answer and returns it to the
 *  candidate pool; cards after it shift left, leaving no gap. */
export function deselectCard(state: GameState, cardId: string): GameState {
  if (state.phase !== "recall") return state;
  return { ...state, answer: state.answer.filter((card) => card.id !== cardId) };
}

/** Advances from a cleared level to the next round, or to the win state on
 *  Level 12. */
export function advance(state: GameState, rng: () => number = Math.random): GameState {
  if (state.phase !== "success") return state;
  if (state.level >= MAX_LEVEL) return { ...state, phase: "win" };
  return startLevel(state.level + 1, rng);
}
