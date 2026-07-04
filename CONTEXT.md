# Memory Lane — Project Context

The "memory doc": the durable context for this project. Read this first when
picking the work back up.

## What this is

**Memory Lane** is a small, installable web app (PWA) of gentle games, built for
**Mike** — the owner's (Paul / oxtailbadger) father. It is designed to be calm,
encouraging, and very easy to use, with cognitive accessibility in mind.

The tone is always warm and never punishing: no "wrong", no timers racing the
player, no scores that shame. Feedback is gentle ("Good guess. The answer is…").

## Who it's for

- **Primary user: Mike.** Greetings are personalized to him by name. He has an
  interest in **technology, current events, and Coca-Cola**, which seeds some of
  the quiz content.
- Places meaningful to Mike are already seeded into "Name the Place": Warm
  Springs GA, Metropolis IL, Southern Illinois University (Carbondale),
  Washington D.C., Park Ridge IL, Bloomington IL, and Peoria IL.

## Tech stack

- **Vite + React 18**, plain JavaScript (`.jsx`), no TypeScript.
- **lucide-react** for icons.
- **vite-plugin-pwa** for the manifest + service worker (installable, offline).
- The whole app is one file: `src/App.jsx`, using **inline styles** (no CSS
  framework, no CSS modules). This matches the original Claude-chat artifact and
  keeps everything in one place.

## Structure of `src/App.jsx`

Everything lives in one file, roughly in this order:

1. `MatchingGame` — memory/concentration pairs game.
2. Word Play data (`WORD_ROUNDS`, `SPOT_ROUNDS`) + `WordPlayGame`,
   `SpotGame`, `WordPlayHub`.
3. `YEAR_QUESTIONS` (30) + `GuessYearGame`.
4. `PLACE_QUESTIONS` (30) + `NamePlaceGame`.
5. `PUZZLES` (10 flat-shape SVG scenes) + `PuzzlePlay`, `PuzzleGame`.
6. `Tile` (the home-screen list button).
7. `App` — screen router (plain `useState`, no router lib) + rotating greetings.

## Games (current state)

| Game | Status | Notes |
|------|--------|-------|
| Matching | ✅ | 6 icon pairs; cards linger 2.5s before flipping back. |
| Word Play → Choose the Word | ✅ | Homophone fill-in-the-blank. |
| Word Play → Spot the Slip | ✅ | "Sounds right / sounds off" grammar check. |
| Guess the Year | ✅ | 30-question bank, 8 random per round, scored. |
| Name the Place | ✅ | 30 landmarks, 8 per round, scored. Includes Mike's places. |
| Picture Puzzles | ✅ | 10 puzzles, 3×3 tap-to-swap. |

## Design system (colors used throughout)

- Background: `#EDF1EC` · Ink: `#2F3B36` · Muted text: `#5B6B62` / `#7A8C82`
- Accents: sage `#5B7F76`, deep green `#3F6B5A`, rose `#C98A93`, gold `#C9A227`,
  red `#B5565F`
- Correct highlight: bg `#E8F0E5` / border `#5B7F76`; wrong: bg `#F6E9EA` /
  border `#C98A93`
- Fonts: **Fraunces** (serif, headings) + **Atkinson Hyperlegible** (body),
  loaded from Google Fonts at runtime in `App`.

## Hosting & deploy

- GitHub: **github.com/oxtailbadger/memory-lane-game** (public), branch `main`.
- **Vercel auto-deploys on every push to `main`** (auto-detected Vite; build
  `npm run build`, output `dist`). No manual deploy step.
- Local dev: `npm install && npm run dev` (http://localhost:5173).

## Working notes

- The preview panel's launch config lives in the **root**
  `/Users/pstanton/.claude/launch.json` (entry named `memory-lane`), not in the
  project's own `.claude/launch.json`.
- PWA icons were generated from `public/favicon.svg` using macOS `sips`.

See `DECISIONS.md` for why things are the way they are, and `TODO.md` for what's
next.
