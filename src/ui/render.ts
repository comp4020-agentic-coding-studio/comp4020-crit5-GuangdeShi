import type { Card } from "../game/cards.ts";
import type { GameState } from "../game/state.ts";
import { pipLayout } from "./pips.ts";

const SUIT_SYMBOL: Record<Card["suit"], string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

const CROWN_CLASS: Record<"J" | "Q" | "K", string> = {
  J: "crown-jack",
  Q: "crown-queen",
  K: "crown-king",
};

/** A double-headed face-card portrait: two mirrored halves (the bottom one
 *  rotated 180deg, like a real face card read from either end), each a
 *  crown + head + collar silhouette, with the rank/suit badge sitting
 *  between them. The crown shape is the only thing that differs by rank —
 *  a plain point for Jack, a scalloped arch for Queen, a multi-spike crown
 *  for King — so each reads as visually distinct at a glance. */
function faceCardCenter(rank: "J" | "Q" | "K", symbol: string): string {
  const crown = CROWN_CLASS[rank];
  const portrait = `<span class="face-portrait"><span class="face-crown ${crown}"></span><span class="face-head"></span><span class="face-collar"></span></span>`;
  const badge = `<span class="face-badge"><span class="face-letter">${rank}</span><span class="face-suit">${symbol}</span></span>`;
  return `<span class="face-card"><span class="face-half top">${portrait}</span>${badge}<span class="face-half bottom">${portrait}</span></span>`;
}

/** The card face's interior: matching top-left / mirrored bottom-right
 *  corner indices, and a centre treatment that depends on rank — a pip
 *  layout for 2-10, a single large mark for the ace, a double-headed
 *  portrait for J/Q/K. */
function cardFace(card: Card): string {
  const symbol = SUIT_SYMBOL[card.suit];
  const corner = `<span class="corner-rank">${card.rank}</span><span class="corner-suit">${symbol}</span>`;
  let center: string;
  if (card.rank === "A") {
    center = `<span class="ace-mark">${symbol}</span>`;
  } else if (card.rank === "J" || card.rank === "Q" || card.rank === "K") {
    center = faceCardCenter(card.rank, symbol);
  } else {
    const pips = pipLayout(card.rank)
      .map(
        (pip) =>
          `<span class="pip" style="grid-row:${pip.row};grid-column:${pip.col};${
            pip.rotated ? "transform:rotate(180deg);" : ""
          }">${symbol}</span>`,
      )
      .join("");
    center = `<span class="pips">${pips}</span>`;
  }
  return `<span class="corner top-left">${corner}</span>${center}<span class="corner bottom-right">${corner}</span>`;
}

/** A face-up card. With an `action`, it's a clickable candidate — `action`
 *  becomes a `data-action` the click delegator in main.ts reads back out.
 *  Without one, it's a plain display card (the target row, a reveal). */
function faceUpCard(card: Card, action?: string, extraClass = "flip-in"): string {
  const tag = action ? "button" : "div";
  const type = action ? ` type="button"` : "";
  const dataAction = action ? ` data-action="${action}"` : "";
  return `<${tag}${type} class="card ${card.color} ${extraClass}"${dataAction}>${cardFace(card)}</${tag}>`;
}

function timer(secondsLeft: number): string {
  return `<div class="timer${secondsLeft <= 5 ? " low" : ""}">${secondsLeft}</div>`;
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
    return `<div class="card ${card.color} ${mark}">${cardFace(card)}</div>`;
  }
  return `<button type="button" class="card ${card.color} place-in" data-action="deselect:${card.id}">${cardFace(card)}</button>`;
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
