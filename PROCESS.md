# Process overview

A reading-guide to how the work came together --- a map to your process, not an
essay about it. Markers read this file and follow its citations; they don't
trawl the repo for evidence you didn't point at, so if a moment mattered, cite
it.

This file is the shape; the course site's
[assessment page](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#what-you-submit)
is the requirement, and its
[word counts](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#word-counts)
cover every deliverable.

## What I built

Recall: a card sequence memory game. A short target sequence is shown face-up,
flips face-down, and a larger pool of candidates flips face-up in its place.
The player reconstructs the sequence by clicking candidates in order --- the
same click gesture undoes a placed card --- and the answer validates itself
the instant every slot is filled, no submit step. Twelve levels raise target
length, candidate count, and both timers; losing (wrong order, or the recall
timer running out) is a real, reachable outcome, and clearing level 12 ends
the run in a win screen rather than continuing forever.

## The moments that mattered

1. **Keeping game logic completely free of the DOM.** The brief's one required
   test --- exact-identity, exact-order sequence comparison --- had to target
   the real rule, not markup. `src/game/*.ts` (cards, levels, generation,
   validation, state transitions) has no DOM references at all; `main.ts` is
   the only file that touches `document`. That split is what let
   `spec/crit-5.test.ts` test `isSequenceCorrect` directly against the four
   cases the brief specifies, and let the rest of the state machine
   (memorize/recall timers, select/deselect, win-at-12) get unit tests of its
   own alongside it.
   [`d105284`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-GuangdeShi/commit/d105284)

2. **A once-a-second repaint was restarting every animation before it could be
   seen.** The UI redraws by replacing `#app`'s innerHTML from `render(state)`,
   which is simple but means a fresh DOM node every repaint. Adding flip-in,
   place-in, and glow animations in the polish pass meant the countdown timer
   (which repaints every second in memorize/recall) would restart all of them
   every tick --- flip-in on the whole candidate row, the correct/wrong glow,
   all replaying on a 1-second loop instead of once. Fixed by splitting the
   tick handler: a plain countdown only patches the timer element's text and
   `low` class directly; phase transitions and clicks still trigger the full
   repaint that the animations are meant to play on.
   [`63e4680`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-GuangdeShi/commit/63e4680)

3. **A real playtesting pass drove a full revision.** Playing the finished
   Stage-5 build surfaced four concrete problems no amount of reading the code
   would have caught: the cards didn't read as real playing cards (one suit
   icon plus one rank, for every card), the candidate pool was small enough
   that early levels could often be solved by spotting a couple of ranks
   without holding the full sequence in memory, and both timers were generous
   enough that the game felt shallow rather than genuinely testing recall.
   That fed a two-part revision: the candidate pool became the full 52-card
   deck every round (drawn from two independent shuffles, so a card's grid
   position and its place in the target sequence are decoupled), with a
   tighter 12-level timing table built around that harder pool
   ([`135226b`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-GuangdeShi/commit/135226b)),
   and the cards themselves were redrawn with mirrored corner indices and a
   real pip layout per rank (2-10), an ace mark, and a face-card badge for
   J/Q/K, replacing the placeholder single-icon face
   ([`0681166`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-GuangdeShi/commit/0681166)).
   A second playtest against this revision is still to come.

## Before you ship

`pnpm check:evidence` verifies your citations resolve to real commits, that a
reflection entry the marker reads is in `reflections/`, and that your
`CLAUDE.md` is there --- before a marker ever opens the file. It checks that
your map is traceable, not that it is good: the marker judges whether your
small, deliberately chosen set of moments shows real judgement and reflection. A
green check is not a substitute for that curation.

Images aren't checked: unlike a citation whose SHA doesn't resolve, a broken
image is visible the moment this file is rendered on GitHub.
