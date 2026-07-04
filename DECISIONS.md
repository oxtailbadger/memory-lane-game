# Decisions Log

Why the app is built the way it is. Newest decisions at the top. When you
reverse one of these, add a new entry rather than editing the old one.

---

## Puzzle tiles: no border/gap, alignment via inset box-shadow

The 3×3 puzzle slices a single SVG across nine tiles using
`background-size: 300%` + percentage `background-position`. Tiles originally had
a 4px border and a 3px grid gap. Because CSS sizes/positions the background
relative to the area *inside* the border (padding box), those pixels scaled and
shifted each slice, so the assembled picture didn't line up at the seams.

**Decision:** grid `gap: 0`, tile `border: none`. Selection highlight and the
faint piece-seams are drawn with **inset `box-shadow`**, which paints over the
image without changing tile geometry — so slices stay pixel-perfect.

## Pace quizzes with a "Continue" button, not timers

All four question games originally auto-advanced on a `setTimeout` (1.4–1.7s).
Mike couldn't read the feedback in time.

**Decision:** after answering, show the result and wait for an explicit
**Continue** (or **See Results** on the last question) tap. Applied to Word
Play, Spot the Slip, Guess the Year, Name the Place. (Matching kept its
auto-flip but slowed to 2.5s.)

While doing this, fixed a latent bug in Spot the Slip: its guard used
`if (picked)`, which treated the "Sounds Off" answer (internally `false`) as
"nothing picked." Now compares against `null`.

## Two quiz games are near-duplicates (accepted tech debt)

`GuessYearGame` and `NamePlaceGame` share nearly identical logic and markup. A
generalized `QuizGame` component was attempted but a large search/replace was
fragile, so we kept the duplication to match the existing pattern (Word Play's
two games are also near-duplicates).

**Decision:** accept the duplication for now. **TODO:** fold both into one shared
quiz component before adding a third quiz-style game.

## Rotating greetings via localStorage

The home screen greets Mike by name with one of eight phrases, advancing one per
visit (not random) so he doesn't see repeats.

**Decision:** store the last index in `localStorage` (`ml-greeting-index`) and
compute the next in a `useState` initializer. Note: React **StrictMode**
double-invokes the initializer in dev, so greetings advance by two on the dev
server — this does **not** happen in the production build.

## PWA via vite-plugin-pwa

**Decision:** Vite + `vite-plugin-pwa` (generateSW) over a hand-rolled service
worker or a heavier framework. Manifest name/short_name "Memory Lane", theme
`#5B7F76`. Icons generated from `public/favicon.svg` with macOS `sips`.

## Single file, inline styles, no router

**Decision:** keep the whole app in `src/App.jsx` with inline styles and a
`useState` screen switch, matching the original artifact. Fine at this size;
revisit if the file gets unwieldy or we add real navigation/deep links.

## Content guardrails for quiz banks

**Decision:** quiz content stays **positive** — well-known milestones,
landmarks, and culture. No wars, terrorism, or partisan politics. Year questions
span 1950–2010 and lean into Mike's interests (technology, current events,
Coca-Cola). Historical facts are checked before being added.
