# Kauwe Bende – Interactive Game Website

A 3D interactive conversation card game built with Three.js. Players click 3D objects to reveal questions from different categories.

---

## Features

- Interactive 3D objects with hover animations
- Gyro tilt on mobile devices
- Text‑to‑speech for questions
- Category‑specific sounds & colors
- PWA - everything works offline after first visit
- No repeat questions until all are used

---

## Tech Stack

- Three.js – 3D rendering
- Vite – build tool
- Vanilla JavaScript (ES modules)
- Web Speech API – TTS
- PWA with service worker

---

## Development

Install dependencies:

```
npm install
```

Run locally:

```
npm run dev
```
- To quick start a live server on Windows, double‑click Start Live Server.bat (included in the project) to start the live server automatically.

Build for production:

```
npm run build
```

Preview production build:

```
npm run build
npx serve dist
```
---

## Deployment

Deploy to Vercel automatically:

1. Push code to GitHub
2. Import project on vercel.com
3. Vercel auto‑detects Vite – no extra config needed
4. Click Deploy

---

## Assets

- Questions: Edit JSON files in public/data/
- Sounds: Replace MP3s in public/sounds/
- 3D Models: Replace GLB files in public/models/
- Icons: Replace PNGs in public/icons/

---

## Contact & Support

For questions, bugs, or feature requests, contact me ([@Janneske2001](https://github.com/Janneske2001)) or open an issue in the repository. I am happy to help :).

---
