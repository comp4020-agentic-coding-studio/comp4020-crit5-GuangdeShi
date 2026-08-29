import type { Card } from "../game/cards.ts";
import type { GameState } from "../game/state.ts";

const SUIT_SYMBOL: Record<Card["suit"], string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

/** A face-up card. With an `action`, it's a clickable candidate — `action`
 *  becomes a `data-action` the click delegator in main.ts reads back out.
 *  Without one, it's a plain display card (the target row, a reveal). */
function faceUpCard(card: Card, action?: string): string {
  const tag = action ? "button" : "div";
  const type = action ? ` type="button"` : "";
  const dataAction = action ? ` data-action="${action}"` : "";
  return `<${tag}${type} class="card ${card.color}"${dataAction}>
    <span class="rank">${card.rank}</span><span class="suit">${SUIT_SYMBOL[card.suit]}</span>
  </${tag}>`;
}

function faceDownCard(): string {
  return `<div class="card back"></div>`;
}

/** Where a selected candidate used to sit: kept in the layout so the row
 *  doesn't reflow, but empty. */
function emptyCardSlot(): string {
  return `<div class="card slot"></div>`;
}

/** A filled answer slot: clickable to undo (unless `mark` freezes it as a
 *  result reveal), or an empty slot ready to receive the next pick. */
function answerSlot(card: Card | undefined, mark?: "correct" | "wrong"): string {
  if (!card) return `<div class="card slot"></div>`;
  if (mark) {
    return `<div class="card ${card.color} ${mark}">
      <span class="rank">${card.rank}</span><span class="suit">${SUIT_SYMBOL[card.suit]}</span>
    </div>`;
  }
  return `<button type="button" class="card ${card.color}" data-action="deselect:${card.id}">
    <span class="rank">${card.rank}</span><span class="suit">${SUIT_SYMBOL[card.suit]}</span>
  </button>`;
}

function renderOpening(): string {
  return `
    <div class="opening">
      <button type="button" class="card back big" data-action="start" aria-label="Start"></button>
    </div>
  `;
}

function renderMemorize(state: GameState): string {
  const targetRow = state.target.map((card) => faceUpCard(card)).join("");
  const candidateRow = state.candidates.map(() => faceDownCard()).join("");
  return `
    <div class="round" data-phase="memorize">
      <div class="timer">${state.memorizeSecondsLeft}</div>
      <div class="row target-row">${targetRow}</div>
      <div class="row candidate-row">${candidateRow}</div>
    </div>
  `;
}

function renderRecall(state: GameState): string {
  const placed = new Set(state.answer.map((card) => card.id));
  const answerRow = Array.from(
    { length: state.target.length },
    (_, i) => state.answer[i],
  )
    .map((card) => answerSlot(card))
    .join("");
  const candidateRow = state.candidates
    .map((card) => (placed.has(card.id) ? emptyCardSlot() : faceUpCard(card, `select:${card.id}`)))
    .join("");
  return `
    <div class="round" data-phase="recall">
      <div class="timer">${state.recallSecondsLeft}</div>
      <div class="row answer-row">${answerRow}</div>
      <div class="row candidate-row">${candidateRow}</div>
    </div>
  `;
}

function renderResult(state: GameState): string {
  const correct = state.outcome === "correct";
  const marked = state.target
    .map((target, index) => {
      const card = state.answer[index];
      if (!card) return answerSlot(undefined);
      return answerSlot(card, card.id === target.id ? "correct" : "wrong");
    })
    .join("");
  const revealRow = correct ? "" : `<div class="row reveal-row">${state.target.map((card) => faceUpCard(card)).join("")}</div>`;
  return `
    <div class="round result ${correct ? "success" : "failure"}">
      <div class="row answer-row">${marked}</div>
      ${revealRow}
      <p class="level-line">Level ${state.level}</p>
      <button type="button" class="card back big" data-action="start" aria-label="Restart"></button>
    </div>
  `;
}

function renderWin(state: GameState): string {
  const targetRow = state.target.map((card) => faceUpCard(card)).join("");
  return `
    <div class="round result win">
      <div class="row target-row">${targetRow}</div>
      <p class="level-line">Level ${state.level} complete</p>
      <button type="button" class="card back big" data-action="start" aria-label="Play again"></button>
    </div>
  `;
}

export function render(state: GameState): string {
  switch (state.phase) {
    case "opening":
      return renderOpening();
    case "memorize":
      return renderMemorize(state);
    case "recall":
      return renderRecall(state);
    case "success":
    case "failure":
      return renderResult(state);
    case "win":
      return renderWin(state);
  }
}
