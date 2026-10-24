# Papertrail
A draft-to-research workspace with source discovery, screening, a personal library, untimed passage-by-passage reading, and a coach that keeps original writing separate from AI suggestions.

## Cloudflare — no Gemini key

The full app now supports Cloudflare Workers with Workers AI. Follow [CLOUDFLARE.md](CLOUDFLARE.md) to deploy directly from GitHub or with a browser login from your computer. Free-plan usage limits apply.

## Run locally with Gemini
Node 24 is available in the cloud environment.

```sh
npm ci --cache /tmp/npm-cache
npm run build
npm start
```

The server listens on port 3000 (override with PORT). A clearly labeled scripted sample works without credentials. Uploads are parsed in memory (50 MB maximum); scanned PDFs require OCR elsewhere. Full extracted text is retained for thorough reading, up to five million characters; larger documents are rejected. Drafts, library texts and reading progress persist in browser IndexedDB; notes also use local storage. Export project backups regularly. Quick overviews remain excerpt-based.

For live paper-specific conversation, get a Gemini API key at https://aistudio.google.com/apikey and securely inject `GEMINI_API_KEY` into the server process, then restart. The server calls Google's Gemini API; default model is `gemini-2.5-flash`, overridable with `GEMINI_MODEL`. Use a model and project eligible for the free tier; quotas and regional availability vary. Do not enable paid billing if you want to stay on the free tier. Free-tier provider data terms may permit use of submitted content to improve products; check Google's current terms before uploading confidential or unpublished papers. Never put keys in frontend code. The application does not automatically load .env files. Paper text is sent to the provider only for live chat. This local development app has no user authentication; add authentication, rate limiting, and deployment controls before public hosting.

`npm run check` checks JavaScript syntax. Smoke checks: GET /api/status, PDF upload, scripted sample conversation, stage selection, notes and export. A 30-minute session structures an initial critical reading; complex papers may need more time. Potential research gaps must be verified against the paper and wider literature.

## GitHub Pages demo
The `gh-pages` branch contains the static contents of `public/`. In repository Settings → Pages, select “Deploy from a branch”, branch `gh-pages`, folder `/ (root)`, and save. The Pages version supports the scripted sample, stages, timer, notebook, and export. It cannot run the Node server, PDF extraction, or live AI. Never add API keys to the static deployment.

To refresh the demo after frontend changes, publish the contents of `public/` to the root of `gh-pages`. Keep all backend code and API keys out of that branch.
