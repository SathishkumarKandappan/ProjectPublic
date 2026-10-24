# Papertrail
A focused research-paper reading room with PDF upload, a four-stage 30-minute guide, chat, and a browser-local exportable notebook.

## Run
Node 24 is available in the cloud environment.

```sh
npm ci --cache /tmp/npm-cache
npm start
```

The server listens on port 3000 (override with PORT). A clearly labeled scripted sample works without credentials. Uploads are parsed in memory (15 MB maximum); scanned PDFs require OCR elsewhere. Text is capped at 65,000 characters. Uploaded text and conversation are session-only; notebook entries persist in browser local storage.

For live paper-specific conversation, securely inject `AI_API_KEY` into the server process and restart. The server calls OpenAI's API; default model is `gpt-4o-mini`, overridable with `AI_MODEL`. Never put keys in frontend code. The application does not automatically load .env files. Paper text is sent to the provider only for live chat. This local development app has no user authentication; add authentication, rate limiting, and deployment controls before public hosting.

`npm run check` checks JavaScript syntax. Smoke checks: GET /api/status, PDF upload, scripted sample conversation, stage selection, notes and export. A 30-minute session structures an initial critical reading; complex papers may need more time. Potential research gaps must be verified against the paper and wider literature.
