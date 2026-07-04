# Memory Lane

Gentle games for keeping the mind bright — a small, installable web app.

Includes Matching, Word Play (Choose the Word / Spot the Slip), and Picture
Puzzles, with a calm, high-contrast, large-type design built for easy use.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default http://localhost:5173).

## Build

```bash
npm run build      # outputs static files to dist/
npm run preview    # serve the production build locally
```

## Progressive Web App

The app ships a web manifest and a service worker (via `vite-plugin-pwa`), so it
can be installed to a phone or desktop home screen and opened like a native app.
The service worker is only active in the production build (`npm run build` /
`npm run preview`) or once deployed.

## Deploy

Push to GitHub and import the repo into Vercel. Vercel auto-detects Vite —
Build Command `npm run build`, Output Directory `dist`. No extra config needed.
