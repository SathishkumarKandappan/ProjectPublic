# Kitchen Ledger — Bengaluru

Standalone school kitchen budgeting website. Serve this folder with any static web host, or run `python3 -m http.server 8080` from the repository and open `/kitchen/`.

Includes Sona Masuri, Salem and red rice, common rations and vegetables, editable supplier prices and weekly quantities, browser persistence, category/search filters, custom ingredients, 2–4 week price scenarios, contingency, per-meal estimates and CSV exports. Quantities start at zero to avoid inventing school consumption.

## Data limitations

This version uses a dated reference snapshot, not automatic live prices. Rice reference: https://www.indiaprices.co.in/rice/bengaluru-rice-price/ (17 October 2026). Vegetable reference: https://market.todaypricerates.com/Bengaluru-vegetables-price-in-Karnataka (retrieved 1 November 2026, conflicting source dates 29–31 October). Retail range midpoints are used. Salem rice and rations without verified quotes are deliberately blank. Grade, delivery and supplier differences matter. All reference dates and missing quotes are visible.

Future prices are user-controlled compound price scenarios; they are not fitted forecasts. A live production feed and statistical forecasts require an authorized supplier/market data API, historical observations for each grade/unit, server-side ingestion, freshness checks and forecast backtesting. No credentials are included. Data is saved only on the current browser; export regularly. Totals exclude missing prices and do not include tax, delivery, cooking fuel or wastage.

Papertrail is preserved separately on the `app/papertrail` branch. This branch contains only Kitchen Ledger.\n\nRun checks from the repository root with `npm install` and `npm test`.
