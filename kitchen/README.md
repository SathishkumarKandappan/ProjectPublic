# Kitchen Ledger — Bengaluru

Static school kitchen budgeting dashboard. Serve the repository and open `/kitchen/`. Run `node kitchen/tests/dashboard.test.mjs` after installing jsdom (root package.json). The site is published on https://sathishkumarkandappan.github.io/ProjectPublic/kitchen/ . Papertrail is preserved separately on `app/papertrail`.

## Prices and dates

“Today / latest” shows the latest available record per ingredient, with its actual publication date. Choosing a past date shows only records from that exact date. Missing history stays blank. Choosing a date in the next seven days shows estimates. Saved supplier quotes override public prices on the same date and unit. Targets and quantities migrate from the original dashboard; changes remain browser-local.

Public feed: `prices.json` retains dated observations. A GitHub Actions workflow on the repository default branch fetches public rice and vegetable listings daily at 07:00 Asia/Kolkata (01:30 UTC), using the updater on `feat/bangalore-kitchen-budget`, and commits the feed to `gh-pages`. GitHub schedules may be delayed. The browser checks the published feed on load, on Refresh, and every 15 minutes. Source failures preserve old observations and are surfaced. Source publication dates are never replaced with fetch dates. This is daily published market data, not a real-time trade feed. The bootstrap feed was checked against public listings on 1 November 2026. Rice sources can be older than today. Salem rice and unlisted rations need supplier quotes.

Sources: https://www.indiaprices.co.in/rice/bengaluru-rice-price/ and https://www.vegetablemarketprice.com/market/bangalore/today . Vegetable prices are retail range midpoints. Confirm grade, location and bulk rates with a supplier. No secrets or paid API are required. HTML source changes can break ingestion; the updater rejects undated, future-dated and malformed data instead of inventing values.

## Forecasts and colours

Seven-day projections use a linear trend only with three or more distinct daily observations spanning at least two days, within 30 days of the latest observation, from the same source and basis. Movement is capped at 3% of the last price per day. Otherwise a labelled flat estimate carries the last available price forward. Baselines older than two days are flagged. These estimates have not been statistically validated and have no calibrated confidence interval.

Green = below that ingredient's editable target; red = above it; grey = at target or no comparison. Initial targets are the original reference prices. No cross-ingredient price comparison is implied. Missing prices are excluded from totals; delivery, tax, fuel and wastage are excluded. Contingency is shown separately. CSV export includes selected-date prices, source dates, targets and all seven days of projections. Export regularly.
