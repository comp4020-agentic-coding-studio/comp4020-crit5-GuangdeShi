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
flips face-down, and a pool of candidates flips face-up in its place. The
player reconstructs the sequence by clicking candidates in order --- the same
click gesture undoes a placed card --- and the answer validates itself the
instant every slot is filled, no submit step. Fifteen levels raise target
length, candidate pool size, and both timers together in bigger, more
distinct steps than the curve first shipped with, so later levels demand
more memory and more discrimination between distractors, not just less time
to react. Losing (wrong order, or the recall timer running out) is real and
reachable, and clearing level 15 ends the run in a win screen. The deck is a
vendored public-domain standard deck rather than anything hand-drawn.

## The moments that mattered

1. **Picking the mechanic against the brief, not against what sounded fun.**
   My first idea was a simple auto-moving ball in a maze, steered left/right.
   I dropped it once I lined it up against what Crit 5 actually asks for: one
   mechanic, no tutorial, a real losable state, a real ending, one rule
   focused enough to unit test. A sequence-memory game answers all five
   directly --- memorise, watch it flip away, reconstruct in order --- where
   the ball idea would have needed a separate explanation of what "steering"
   accomplishes. Sequence identity-and-order comparison also gives me exactly
   one clean rule to point a test at, which the brief asks for by name.
   [`d105284`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-GuangdeShi/commit/d105284)

2. **Directing the build in stages instead of asking for the whole game at
   once.** I split the work into logic, then UI, then polish, then tests and
   docs, then deployment, and held the agent to explicit rules the whole way:
   work locally first, keep git history intact, commit in small meaningful
   steps, don't drift into unrelated edits, and never push or deploy without
   my say. The payoff shows up directly in the log --- pure game rules with no
   DOM references land as their own commit
   ([`d105284`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-GuangdeShi/commit/d105284)),
   the click-to-select/undo/auto-validate UI as the next
   ([`97265a6`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-GuangdeShi/commit/97265a6)),
   animation and feedback polish as a third
   ([`63e4680`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-GuangdeShi/commit/63e4680))
   --- so when something needed correcting later, I could point at the one
   commit responsible instead of untangling a single monolithic drop.

3. **No tutorial, on purpose.** I ruled out any written instructions --- no
   "remember these cards," no "select in order," no how-to-play screen ---
   and had the agent teach the game entirely through what's on screen: a
   countdown, a face-up target row, empty answer slots waiting to be filled,
   a candidate grid that lifts on hover, and validation that just happens the
   moment the last slot is filled. That affordance-only interface is what
   [`97265a6`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-GuangdeShi/commit/97265a6)
   built, directly against the brief's no-tutorial requirement.

4. **First real playtest: the finished, green build was too easy.** Every
   test passed and the rules were correct, but actually playing it exposed
   something no test could: with only a handful of visible candidates, I
   found myself remembering just the ranks ("5, 6, 7") and ignoring suit and
   order entirely, because the pool was too small to need more. That drove
   revision 1 --- the candidate grid became the full 52-card deck so a card's
   position gives no hint about its place in the sequence, timers tightened
   to match, and the cards themselves were redrawn with real corner indices
   and pip layouts instead of a single icon standing in for the whole card.
   [`135226b`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-GuangdeShi/commit/135226b),
   [`0681166`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-GuangdeShi/commit/0681166)

5. **Second playtest: 52 was the wrong overcorrection.** Playing that
   revision, the full deck on screen at once was too crowded to scan, and the
   J/Q/K cards read as a letter in a box rather than a face card. I didn't
   walk revision 1 back to where it started --- I treated 52 as data about
   where the comfortable middle was, and settled on a 26-card half-deck
   (targets plus distractors, each independently reshuffled every round) with
   the timing table retuned again for that smaller, more scannable pool. The
   face cards became double-headed portraits with a rank-distinct crown
   shape, and losing now ends in an unmissable "YOU FAILED" screen instead of
   a quiet return to the menu.
   [`77d897e`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-GuangdeShi/commit/77d897e),
   [`a022125`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-GuangdeShi/commit/a022125)

6. **Visual quality kept failing inspection even when the instruction was
   already specific.** I asked for correct pip counts, proper pip layout,
   mirrored corner indices, and real face-card treatment, and got exactly
   that, technically. Looking at the result --- helped by a standalone
   `card-gallery.html` built specifically so the whole deck could be inspected
   at once, outside of play --- the J/Q/K portraits still read as geometric
   and abstract, and the pip layout still didn't look like a real card.
   Correct-per-instruction and actually-looks-right turned out to be two
   different bars.
   [`78b2f7f`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-GuangdeShi/commit/78b2f7f)

7. **Changing strategy instead of asking for another pass.** Rather than keep
   iterating on a hand-drawn deck, I gave the agent a real playing-card
   reference and pointed it at existing public-domain assets --- the
   Wikimedia Commons CC0 English-pattern deck and the
   `hayeah/playing-cards-assets` repository --- and had it replace the entire
   custom rendering system with vendored card-face images. This wasn't a
   styling tweak; it removed the hand-drawn suit/pip/face-portrait code
   outright and replaced how every card is produced. It's also the one
   moment in this project I'd call a genuine change of implementation
   approach rather than a revision of the existing one, and it's what finally
   made J/Q/K and the pip layouts read as a real deck.
   [`09d337a`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-GuangdeShi/commit/09d337a)

8. **Diagnosing the environment instead of touching working code.** I opened
   the card gallery in a browser and saw nothing load. Rather than assuming
   the code was broken and starting to rewrite it, the agent checked the
   running dev servers first and found the real cause: a second project (C4)
   already held port 5173, so C5 had auto-incremented to 5174 --- I'd just
   opened the wrong URL. Nothing about the game needed fixing. Small, but a
   useful example of investigating state before editing code.

9. **A third playtest, after deployment: rushed rather than remembered, and
   crowded from the very first level.** With the vendored deck settled, the
   remaining friction was pacing --- the recall timer felt like it was
   testing reaction speed more than memory, and starting every level,
   including the first, at a flat 26 candidates made level 1 feel visually
   overloaded before the player had done anything. Rather than raise the
   pool uniformly again, I ramped it: 16 candidates at level 1 climbing to 28
   by level 12, alongside longer timers throughout. The intent is that
   difficulty comes increasingly from holding more cards in memory and
   telling more distractors apart, not from being rushed --- and that level 1
   specifically stays approachable.
   [`750ea9e`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-GuangdeShi/commit/750ea9e)

10. **A late visual correction: the deck's own border was working against
    the table.** The vendored assets each drew their own black outline around
    the white card face, which read as a heavy box once scaled down to game
    size. I had the agent strip that stroke from the source before
    rasterizing rather than paper over it in CSS, so the card still separates
    from the dark background through the existing drop shadow, and face cards
    keep their own ornamental portrait framing untouched --- that framing is
    part of the artwork, not the border I was removing.
    [`77341f2`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-GuangdeShi/commit/77341f2)

11. **What the automated tests could tell me, and what they couldn't.** Every
    revision above shipped on a green suite --- deck integrity, per-level
    candidate-pool invariants, exact-order validation, timeout and
    wrong-order failure, level advance through to a win. None of that ever
    told me the game was too easy, too crowded, rushed rather than
    memory-testing, or that a queen didn't look like a queen. The code was
    correct at every one of those points; the experience wasn't yet. Tests
    protected the one rule the brief asks me to prove; playing the game, and
    looking at the deck in the gallery, is what actually judged the design.

12. **A fourth playtest: the ramped curve was still too gradual.** Levels 1
    through 12 climbed smoothly enough that adjacent levels felt almost the
    same, and the run never reached anything I'd call late-game. I widened
    the gaps between tiers instead of nudging them again --- target length
    now jumps in steps of two rather than crawling up by one every other
    level --- and stretched the run from 12 levels to 15 so there's room for
    a genuinely hard late stretch. Timers grew alongside target length rather
    than shrinking, so a level with twice the cards to remember gets
    meaningfully more time, not less.
    [`191c116`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-GuangdeShi/commit/191c116)

## Getting it live

The repository stayed private through all of the above, by design --- CI is
gated on `!github.event.repository.private` so a private-phase push doesn't
spend the org's shared Actions minutes, and Pages can't serve a private repo
regardless. Flipping the repo to public triggered no push event, so the first
build ran as a manual `workflow_dispatch` and failed outright: GitHub Pages
had never been configured to build from Actions, so `configure-pages` had
nothing to attach to (`Get Pages site failed ... Not Found`). Enabling Pages
against the Actions build fixed it on the next dispatch, and every push since
--- the border fix and this level rebalance included --- has built, checked,
and deployed on its own.

## Before you ship

`pnpm check:evidence` verifies your citations resolve to real commits, that a
reflection entry the marker reads is in `reflections/`, and that your
`CLAUDE.md` is there --- before a marker ever opens the file. It checks that
your map is traceable, not that it is good: the marker judges whether your
small, deliberately chosen set of moments shows real judgement and reflection. A
green check is not a substitute for that curation.

Images aren't checked: unlike a citation whose SHA doesn't resolve, a broken
image is visible the moment this file is rendered on GitHub.
