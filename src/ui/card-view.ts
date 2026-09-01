import type { Card } from "../game/cards.ts";
import { cardFaceAlt, cardFaceSrc } from "./card-assets.ts";

/** The card face's interior: a single vendored deck-face image (see
 *  public/cards/ATTRIBUTION.md) — corners, pips and face-card portraits are
 *  all baked into the asset, so there's nothing to draw here. */
function cardFace(card: Card): string {
  return `<img class="card-face" src="${cardFaceSrc(card)}" alt="${cardFaceAlt(card)}" draggable="false" />`;
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
