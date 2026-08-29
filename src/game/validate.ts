import type { Card } from "./cards.ts";

/**
 * The one rule under automated test: a recalled sequence is correct only
 * when every card identity matches the target in exactly the same order.
 * Same cards in the wrong order, a short answer, or a substituted card are
 * all incorrect — nothing here is a partial match.
 */
export function isSequenceCorrect(target: readonly Card[], answer: readonly Card[]): boolean {
  if (target.length !== answer.length) return false;
  return target.every((card, index) => card.id === answer[index]?.id);
}
