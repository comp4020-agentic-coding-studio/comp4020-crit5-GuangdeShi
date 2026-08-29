import type { Card } from "../game/cards.ts";
import { facePortrait } from "./face-portrait.ts";
import { pipLayout } from "./pips.ts";
import { suitIcon } from "./suits.ts";

/** The four corner indices: rank text plus a small SVG suit icon, reused
 *  as-is (mirrored via a 180deg rotation) for the bottom-right corner. */
function cornerMark(card: Card): string {
  return `<span class="corner-rank">${card.rank}</span>${suitIcon(card.suit, "corner-suit")}`;
}

/** The centre of a numbered card (2-10): one pip per `pipLayout` position,
 *  each an SVG suit icon placed on the 3x9 grid, upside-down in the top half
 *  so it reads correctly from either end of the card, exactly like a real
 *  deck. */
function pipCenter(card: Card): string {
  const pips = pipLayout(card.rank)
    .map((pip) => {
      const rotate = pip.rotated ? "transform:rotate(180deg);" : "";
      return `<span class="pip" style="grid-row:${pip.row};grid-column:${pip.col};${rotate}">${suitIcon(card.suit, "pip-icon")}</span>`;
    })
    .join("");
  return `<span class="pips">${pips}</span>`;
}

/** The centre of an ace: one large suit icon, nothing else. */
function aceCenter(card: Card): string {
  return `<span class="ace-mark">${suitIcon(card.suit, "ace-icon")}</span>`;
}

/** The centre of a face card (J/Q/K): a double-headed portrait, the same
 *  half rendered twice and mirrored, with the rank letter sitting between
 *  the two halves so it stays readable at any size. */
function faceCenter(card: Card, rank: "J" | "Q" | "K"): string {
  const portrait = facePortrait(rank, card.suit);
  return `<span class="face-card"><span class="face-half top">${portrait}</span><span class="face-letter">${rank}</span><span class="face-half bottom">${portrait}</span></span>`;
}

/** The card face's interior: matching top-left / mirrored bottom-right
 *  corner indices, and a centre treatment that depends on rank. */
function cardFace(card: Card): string {
  const corner = cornerMark(card);
  let center: string;
  if (card.rank === "A") {
    center = aceCenter(card);
  } else if (card.rank === "J" || card.rank === "Q" || card.rank === "K") {
    center = faceCenter(card, card.rank);
  } else {
    center = pipCenter(card);
  }
  return `<span class="corner top-left">${corner}</span>${center}<span class="corner bottom-right">${corner}</span>`;
}

/** A face-up card. With an `action`, it's a clickable candidate — `action`
 *  becomes a `data-action` the click delegator in main.ts reads back out.
 *  Without one, it's a plain display card (the target row, a reveal). */
export function faceUpCard(card: Card, action?: string, extraClass = "flip-in"): string {
  const tag = action ? "button" : "div";
  const type = action ? ` type="button"` : "";
  const dataAction = action ? ` data-action="${action}"` : "";
  return `<${tag}${type} class="card ${card.color} ${extraClass}"${dataAction}>${cardFace(card)}</${tag}>`;
}

export function faceDownCard(): string {
  return `<div class="card back"></div>`;
}

/** Where a selected candidate used to sit: kept in the layout so the row
 *  doesn't reflow, but empty. */
export function emptyCardSlot(): string {
  return `<div class="card slot"></div>`;
}

/** A filled answer slot: clickable to undo (unless `mark` freezes it as a
 *  result reveal), or an empty slot ready to receive the next pick. */
export function answerSlot(card: Card | undefined, mark?: "correct" | "wrong"): string {
  if (!card) return `<div class="card slot"></div>`;
  if (mark) {
    return `<div class="card ${card.color} ${mark}">${cardFace(card)}</div>`;
  }
  return `<button type="button" class="card ${card.color} place-in" data-action="deselect:${card.id}">${cardFace(card)}</button>`;
}
