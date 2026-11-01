# Kitchen Ledger

Live site: https://sathishkumarkandappan.github.io/ProjectPublic/kitchen/

Two views: supplier/market price comparison and Indian dish ideas. The date picker and Refresh reload the published feed and show each ingredient's latest recorded market price on or before the selected date. Actual source dates remain visible. Future dates and all projection/budgeting panels have been removed. The feed is a dated snapshot; the proposed scheduled updater is not enabled.

The approved supplier snapshot remains undated (red rice ₹55/kg). Different units are never compared. Existing browser-local supplier quotes are read without changing old browser data. Undated supplier quotes are not used for historical dish ranking. Refresh cannot manufacture historical prices or new supplier quotes.

There are 75 vegetarian Indian dishes: 25 curry ideas, 25 palya/dry vegetable sides and 25 snacks. Every dish has a state/region association and a short description. These associations are not exclusive origin claims. State, ingredient and dish-name filters are available. Eight featured ideas rotate deterministically by date: up to six from a lower-priced main-ingredient pool and discovery picks from the remaining collection. Browse All shows all matching dishes. Suggestions use the lower available matching-unit supplier/market rate for the main ingredient. The shown ₹/kg is an ingredient rate, never a full recipe or meal cost. Missing quotes are not treated as zero. Review full recipes and school dietary needs separately.

Source dates and links are available in the collapsed information section. No Google Drive access is used. School menus and planning tabs are not published. Papertrail remains on the `app/papertrail` branch.

Serve the repository using a static server and open `/kitchen/`. Tests: `node --test kitchen/tests/*.test.mjs` (jsdom required). Syntax: `node --check kitchen/app.js`.
