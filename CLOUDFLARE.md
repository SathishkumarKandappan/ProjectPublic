# Deploy Papertrail to Cloudflare

This deployment serves the complete website and calls **Workers AI** through a binding. No Gemini or OpenAI key is needed. Choose Cloudflare **Workers**, not Pages.

## Deploy from GitHub (no local terminal)

1. Sign in at https://dash.cloudflare.com/ and open **Workers & Pages**.
2. Create a Worker using **Import a repository** (the exact UI label may vary), connect GitHub, and select `SathishkumarKandappan/ProjectPublic`.
3. Set the production branch to **ReadReseachPaper**, root directory to the repository root, build command to **npm run build**, and deploy command to **npx wrangler deploy**. Dependency installation should use `npm ci` and Node 24.
4. Deploy. The checked-in `wrangler.jsonc` declares both the static asset directory and the `AI` binding. If prompted, accept Workers AI terms. Use the `workers.dev` URL Cloudflare displays after successful deployment.
5. Open that URL, upload a text-based PDF, and check that the first response discusses its actual research question. A successful deployment alone does not prove the account can use Workers AI.

If Cloudflare asks to create only a static site, go back and choose a Worker with repository import. The GitHub Pages URL remains demo-only.

## Deploy from Windows PowerShell

From your existing project folder:

```powershell
git switch ReadReseachPaper
git pull --ff-only
npm.cmd ci
npx.cmd wrangler login
npm.cmd run deploy
```

Login opens Cloudflare in your browser. No credentials should be committed to GitHub. Deployment prints your actual website URL. Change `name` in `wrangler.jsonc` if that Worker name already belongs to another project in your account.

## Validate and troubleshoot

- `/api/status` should report `live: true`, `provider: Cloudflare Workers AI`, and `uploadMode: browser`. This checks binding presence, not live inference.
- PDF extraction runs locally in the browser using bundled PDF.js assets. The binary PDF is not uploaded to the Worker. Scanned PDFs require OCR elsewhere; encrypted PDFs may not work.
- Only the first 40,000 characters of a paper are sent for analysis. Later results or limitations may be excluded. A truncation notice appears; cross-check the original paper.
- A real chat sends that text and up to ten recent conversation messages to Cloudflare Workers AI. Notebook notes stay in browser local storage.
- AI quota failures are reported in the chat. Workers Free and Workers AI have usage limits; check the current dashboard/pricing for your account. Do not upgrade or enable paid usage if you want to stay on free allowances. Free capacity and model access are not guaranteed.
- `npm run cf:dev` starts Wrangler development mode, but Workers AI inference may use the remote account and consume quota. It requires Cloudflare authentication.
- This is a personal-use app without built-in user authentication. For a private deployment, configure Cloudflare Access for its hostname before sharing it. An origin check is not authentication or a quota guarantee.

## Local Node alternative

`npm start` still starts the original Express backend using `GEMINI_API_KEY`. To use Workers AI, use the Cloudflare deployment or Wrangler workflow instead. Never put provider credentials in frontend files.
