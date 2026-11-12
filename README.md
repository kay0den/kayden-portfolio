# KAYDEN Portfolio

## Run locally
1. Install Node.js 20+ (https://nodejs.org)
2. `npm install`
3. `npm run dev`  → open http://localhost:3000

## Add a category
Create `src/content/categories/<slug>/category.json` (see existing ones). It appears automatically.

## Add a project
Create `src/content/categories/<slug>/projects/<project>.json`.
Put images/videos in `public/work/<slug>/<project>/` and reference them as `/work/<slug>/<project>/file.jpg`.

## Identity & contact
Edit `src/site.config.ts`.

## Publish
Push to GitHub, import the repo on https://vercel.com → Deploy.
