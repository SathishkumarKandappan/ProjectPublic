# Kitchen Ledger — Bengaluru

Static school kitchen budgeting dashboard. Serve the repository and open `/kitchen/`. Run `node kitchen/tests/dashboard.test.mjs` after installing jsdom (root package.json). The site is published on https://sathishkumarkandappan.github.io/ProjectPublic/kitchen/ . Papertrail is preserved separately on `app/papertrail`.

## Prices and dates

“Today / latest” shows the latest available record per ingredient, with its actual publication date. Choosing a past date shows only records from that exact date. Missing history stays blank. Choosing a date in the next seven days shows estimates. Supplier prices are displayed separately; manual dated supplier quotes override the imported undated supplier list. Saved quantities migrate from the original dashboard; changes remain browser-local.

Public market feed: `market.json` retains dated observations. A GitHub Actions workflow on the repository default branch fetches public rice and vegetable listings daily at 07:00 Asia/Kolkata (01:30 UTC), using the updater on `feat/bangalore-kitchen-budget`, and commits the market-only feed to `gh-pages`. GitHub schedules may be delayed. The browser checks the published feed on load, on Refresh, and every 15 minutes. Source failures preserve old observations and are surfaced. Source publication dates are never replaced with fetch dates. This is daily published market data, not a real-time trade feed. The bootstrap feed was checked against public listings on 1 November 2026. Rice sources can be older than today. Salem rice and unlisted rations need supplier quotes.

Sources: https://www.indiaprices.co.in/rice/bengaluru-rice-price/ and https://www.vegetablemarketprice.com/market/bangalore/today . Vegetable prices are retail range midpoints. Confirm grade, location and bulk rates with a supplier. No secrets or paid API are required. HTML source changes can break ingestion; the updater rejects undated, future-dated and malformed data instead of inventing values.

## Forecasts and colours

Seven-day projections use a linear trend only with three or more distinct daily observations spanning at least two days, within 30 days of the latest observation, from the same source and basis. Movement is capped at 3% of the last price per day. Otherwise a labelled flat estimate carries the last available price forward. Baselines older than two days are flagged. These estimates have not been statistically validated and have no calibrated confidence interval.

## Supplier comparison

36 price-list rows were imported from the provided supplier sheet, tab `Price List - RamLal`, B4:E39. No menu, contact or school planning data is published. The sheet contains no effective date; quotes remain explicitly undated. Supplier prices are a fixed approved snapshot; the daily updater reads only public general-market pages and does not access Google Drive.

Unit prices are calculated as pack cost / pack quantity. Grams are converted to kilograms: hing at ₹85 / 50g is ₹1,700/kg. Packet, piece, bunch and litre units remain distinct. Bottle gourd / cauliflower per piece and curry leaves per bunch are not compared with market prices per kg. White rice is unspecified and is not mapped to Salem or Sona Masuri. Generic cooking oil is not assumed to be sunflower oil. Moong/urad varieties are not guessed from market lists containing multiple grades.

Green marks the lower price in each matching market/supplier pair; red the higher one; grey the same price or no comparison. Difference = supplier − market. Percentage = difference / market × 100; zero market price has no percentage. The comparison is indicative: an undated supplier quote is not a historical supplier price and an old market listing is not today's live price.

Budget basis can be supplier with market fallback, or market only. Supplier prices with mismatched units are excluded from the supplier budget and market price is used instead. Historical budgets do not use undated supplier quotes. Weekly difference includes only comparable items and the entered weekly quantities. Missing prices are excluded; tax, delivery, fuel and wastage remain excluded. CSV export includes both unit prices, source dates, differences and all seven days of projections. Export regularly.

## Low-cost menu suggestions

Fifteen illustrative curry, palya and snack ideas are ranked within dish type by main-ingredient cost per sample portion. The default selects the lower matching-unit supplier/market quote; users can choose their existing budget basis instead. Date selection, projected market prices, missing quotes, undated supplier prices and older observations are reflected and disclosed. Ten-portion sample quantities can be scaled; ingredient/tag exclusions are a text filter, not an allergy certification. Salt, oil, spices, tempering, fuel and labour are excluded. These estimates are not complete recipes, complete meal costs or prescribed school portions. Review quantities, yield, nutrition and dietary requirements before planning a menu.

Tests: `node --test kitchen/tests/*.test.mjs`.

The seven-day outlook shows both projected general-market prices and the supplier planning rate, including separate unit labels. Supplier planning rates carry forward the last available quote as of today; they do not invent future supplier prices. Different units are displayed without colour comparison. CSV exports include both seven-day series and the supplier quote date/basis.
