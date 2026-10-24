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

## Paper screening and My research

The sidebar now has **Paper screening** (PDF, DOI, or the reading-room paper) and **My research** (research area, original notes, a coach, and backup/restore). DOI lookups request public Crossref metadata from the Worker. No extra key is required. DOI-only relevance is provisional: the record may contain only a title, not an abstract or the full paper. Crossref registration is not a journal-quality or authenticity certification. The evidence panel queries DOAJ by ISSN, OpenAlex by DOI, and Europe PMC by DOI, showing matched records, absent records, and service failures separately. OpenAlex records can expose a reported retraction flag; Europe PMC flags are limited to its biomedical/life-science coverage. DOAJ can supply declared journal review processes. No check establishes actual peer review, ethical conduct, universal indexing or a complete absence of retractions. No predatory-journal blacklist or paywalled database is queried. Publisher websites are not crawled. Public APIs may impose rate limits or require credentials; those results stay unavailable rather than being treated as negative evidence.

Original notes and the research area auto-save to browser local storage, shared by anyone using the same browser profile. Uploaded note files append rather than replace notes. Export backups regularly; clearing browser data loses local work. Backup restore explicitly confirms replacement. AI suggestions remain in a separate panel and export with an AI label; they never overwrite the user's notes. AI suggestions are not persisted across refreshes. PDF note imports use the bundled browser reader; notes are limited to 30,000 characters. Research area is limited to 6,000 characters.

Coach requests send the area and notes to Workers AI only when requested. DOI screening sends the DOI to Crossref and supplied text to Workers AI for analysis. Coach output provides scaffolds, questions, evidence gaps and steps rather than submission-ready ghostwriting. It cannot certify originality or rule out plagiarism. Verify sources and write your final work in your own words.

After pushing updates, check your Cloudflare Worker **Builds/Deployments** for the latest commit and redeploy if automatic builds are not enabled. GitHub Pages remains a static demo and does not implement these API-backed features. The local Node server supports DOI metadata lookup but research AI requires the Cloudflare Worker binding.

## Draft-to-research workflow and thorough reading

My research shows one step at a time (draft/question, find sources, read sources, thoughts, structure/next step), with previous/next controls so the whole workflow does not compete for attention. Upload the current draft (PDF/TXT/MD) in My research, describe the question, and ask for a research plan based on labelled draft excerpts. Crossref search returns real bibliographic records with DOI links; it does not supply full texts. Save candidates, make your own relevance decision and reason, attach their full reference PDFs, then open the passage reader. Screened PDF sources can also be sent directly to the library or reading room. DOI metadata alone cannot support thorough reading.

Thorough reading retains **all extracted text**, up to **five million characters per document**, from files up to **50 MB**. Documents over a limit are rejected rather than silently truncated. PDFs are processed locally in the browser. The reader splits the full text into passages of at most 6,000 characters and sends only the selected passage plus recent discussion to AI. Limits do not imply a phone can process every large PDF smoothly. Scans require OCR; figure, equation and table extraction may be incomplete and needs comparison with the original PDF.

Each passage has explanation, evidence/assumption probing, discussion of the user's answer, and the user's reflection. Marking reviewed requires all four; skips stay separate from completion. Progress, chats and reflections are saved in IndexedDB. The reader is untimed and resumes across sessions. A reviewed indicator describes completed interactions, not verified mastery or exhaustive comprehension. Longer papers require more calls and can exhaust free Workers AI allowances; pause and resume when quota is available.

Draft excerpts, selected-library metadata and the user's notes inform the coach; AI never rewrites the saved draft or notes automatically. Reflections transferred to notes have source/passage labels and separately labelled source excerpts. The final synthesis is based on the user's reflections and reports incomplete coverage. Record and complete one user-chosen next task. Export a **full project backup** to retain draft text, library, progress, suggestions, task history and notes; restore replaces the project only after confirmation. Original PDF binaries are not stored; only extracted text is saved. Notes in the legacy text field retain their 30,000-character limit.

Quick overview and screening still use bounded excerpts (up to 40,000 characters); only thorough reading covers all extracted passages. Neither AI nor the workflow can certify originality, plagiarism clearance, or that all claims have been independently verified.
