# Government and free-tier API sources

The 04:00 Asia/Kolkata GitHub Actions run collects these independently. No provider failure overwrites another source or supplier.json. Market/API results publish before the slower public retailer searches finish.

| Provider | Activation | Local spending guard |
| --- | --- | --- |
| AGMARKNET public report | Attempted without a key; rejects unknown response formats | Three source dates maximum, Bengaluru records only |
| data.gov.in AGMARKNET | Actions secret DATA_GOV_IN_API_KEY | Five pages per run; Karnataka query, Bengaluru rows only |
| Rewalto | Actions secret REWALTO_API_KEY | 32 requests/day, 1,000/month, ten listings/request |
| QuickCommerceAPI | Actions secret QUICKCOMMERCE_API_KEY | Three requests/day, 100 requests total (signup allowance, never auto-reset) |
| SerpApi | Actions secret SERPAPI_API_KEY | Eight requests/day, 250/month |

Create your own free account and save keys in GitHub → ProjectPublic → Settings → Secrets and variables → Actions. Never put keys in the public repository, browser or chat. Use free-only accounts without automatic top-ups. This code never creates a subscription or buys credits. Limits count attempts conservatively and persist in public api-usage.json; account usage outside this job also consumes your free allowance. Authentication, balance or rate-limit errors stop that provider; no repeated paid retry. Free quotas do not promise full daily ingredient coverage. Items rotate across the limited allowances while public searches continue checking the full list.

Source contracts checked 1 November 2026:
- https://data.gov.in/catalog/current-daily-price-various-commodities-various-markets-mandi
- https://agmarknet.gov.in/home
- https://rewalto.com/developers/docs/data and https://rewalto.com/pricing
- https://quickcommerceapi.com/docs and https://quickcommerceapi.com/pricing
- https://serpapi.com/search-api and https://serpapi.com/pricing

AGMARKNET data.gov.in prices are modal wholesale rupees per quintal, converted to rupees/kg; source dates and mandis remain attached. The separate public-report adapter only accepts rows with an explicit known price unit. Ragi grain is never mapped to ragi flour, and generic rice is never asserted to be Salem/Sona Masuri/red rice. Government benchmarks are labelled wholesale in the Market column, and excluded from illustrative meal procurement costs. Same-day retail prices take priority over wholesale benchmarks for the main market figure.

Rewalto keeps its original observation date and pin/national scope. No delivery-location control is added to the website. QuickCommerceAPI uses a fixed Bengaluru city-centre reference (12.9716, 77.5946); it does not claim a quote for the school's address. SerpApi figures remain search-indexed references. Strict ingredient/pack/currency matching rejects uncertain results. Provider schemas are unit-tested with representative contracts; authenticated live reads require the user's keys and remain unverified until configured.
