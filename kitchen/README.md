# Kitchen Ledger

https://sathishkumarkandappan.github.io/ProjectPublic/kitchen/

The interface contains a date picker followed by four horizontal tabs: Price, Curry, Palya and Snacks. Price shows only ingredient, market price and supplier price. Each dish tab lists all 50 dishes with their state/region: 150 vegetarian Indian suggestions in total. No dashboards, filters, projections, extra navigation or show-more buttons remain.

Date changes automatically reload the published market feed. Prices use the latest available record on or before that date; actual market dates and undated supplier labels remain in the table. Missing records display a dash. Units are preserved and only matching units receive green/red comparisons. Supplier red rice is ₹55/kg. Existing browser-local supplier quotes remain readable without changing stored data.

The first dish suggestions rotate by date using a pool of lower-priced main ingredients, followed by the rest of the 50-dish list. Missing prices are not treated as zero. Regional associations are not exclusive origin claims. The displayed lists are ideas, not full recipes or nutrition plans. No Google Drive access is used. The public market feed is a dated snapshot; automatic daily ingestion is not enabled.

Serve the repository and open `/kitchen/`. Check syntax with `node --check kitchen/app.js`. Run tests with `node --test kitchen/tests/*.test.mjs` (jsdom required).

Dish cards now show an ingredient cost estimate per portion and a native expandable triangle. Expanded cards list sample quantities for ten portions, matching-unit prices, price dates/sources, line costs and a subtotal. Quantities are illustrative templates by ingredient and dish category, not validated recipe yields. Oil and salt are included where priced; additional spices, toppings, labour, fuel and wastage are excluded. Missing prices produce a partial “From” estimate; an unpriced main ingredient shows “Price needed”. No quantity, origin, price or yield is inferred from the private school menu. All 50 dishes in each category remain visible.
