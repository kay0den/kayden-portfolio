# KAYDEN Portfolio

## Run locally (optional)
1. Install Node.js 20+  2. `npm install`  3. `npm run dev`  → http://localhost:3000

## Add images / videos to a category
Drop the files inside `public/work/<category>/` (next to `category.json`). They appear automatically.
- Images: jpg, png, webp, avif, gif. Videos: mp4 (best), webm.
- Order = file name order. Prefix names: `01-name.jpg`, `02-name.jpg` ...
- Optional video cover: same name + `.poster.jpg`  (e.g. `intro.mp4` + `intro.poster.jpg`).
- Big videos: upload to YouTube and add to `category.json`: `"videos": [{ "youtube": "VIDEO_ID", "title": "My video" }]`

## Create a new category
Create folder `public/work/<new-name>/` with a `category.json`:
{ "title": "Concept Art", "tagline": "Short line", "description": "Longer text", "order": 5, "tint": "#ff6b9d" }
Then add files next to it. The home page, background and category page update by themselves.

## Identity & contact
Edit `src/site.config.ts`.

## Publish
Push to GitHub; Vercel redeploys automatically.
