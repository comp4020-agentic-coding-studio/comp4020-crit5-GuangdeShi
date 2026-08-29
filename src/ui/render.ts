import type { GameState } from "../game/state.ts";
import { answerSlot, emptyCardSlot, faceDownCard, faceUpCard } from "./card-view.ts";

function timer(secondsLeft: number): string {
  return `<div class="timer${secondsLeft <= 5 ? " low" : ""}">${secondsLeft}</div>`;
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
  const candidateGrid = state.candidates.map(() => faceDownCard()).join("");
  return `
    <div class="round" data-phase="memorize">
      ${timer(state.memorizeSecondsLeft)}
      <div class="row target-row">${targetRow}</div>
      <div class="candidate-grid">${candidateGrid}</div>
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
  const candidateGrid = state.candidates
    .map((card) => (placed.has(card.id) ? emptyCardSlot() : faceUpCard(card, `select:${card.id}`)))
    .join("");
  return `
    <div class="round" data-phase="recall">
      ${timer(state.recallSecondsLeft)}
      <div class="row answer-row">${answerRow}</div>
      <div class="candidate-grid">${candidateGrid}</div>
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
  const failBanner = correct ? "" : `<p class="fail-banner">You Failed</p>`;
  return `
    <div class="round result ${correct ? "success" : "failure"}">
      ${failBanner}
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
