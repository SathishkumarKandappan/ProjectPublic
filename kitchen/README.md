# Kitchen Ledger

https://sathishkumarkandappan.github.io/ProjectPublic/kitchen/

The interface contains a date picker followed by five horizontal tabs: Price, Curry, Palya, Snacks and Meal package. Price shows ingredients alongside market, supplier, Blinkit, BigBasket and Instamart references. Each dish tab lists all 50 dishes with their state/region: 150 vegetarian Indian suggestions in total. No dashboards, filters, projections, extra navigation or show-more buttons remain.

Date changes automatically reload the published market feed. Prices use the latest available record on or before that date; actual market dates and undated supplier labels remain in the table. Missing records display a dash. Units are preserved and only matching units receive green/red comparisons. Supplier red rice is ₹55/kg. Existing browser-local supplier quotes remain readable without changing stored data.

The first dish suggestions rotate by date using a pool of lower-priced main ingredients, followed by the rest of the 50-dish list. Missing prices are not treated as zero. Regional associations are not exclusive origin claims. The displayed lists are ideas, not full recipes or nutrition plans. No Google Drive access is used. The public market feed is a dated snapshot; automatic daily ingestion is not enabled.

Serve the repository and open `/kitchen/`. Check syntax with `node --check kitchen/app.js`. Run tests with `node --test kitchen/tests/*.test.mjs` (jsdom required).

Dish cards now show an ingredient cost estimate per portion and a native expandable triangle. Expanded cards list sample quantities for ten portions, matching-unit prices, price dates/sources, line costs and a subtotal. Quantities are illustrative templates by ingredient and dish category, not validated recipe yields. Oil and salt are included where priced; additional spices, toppings, labour, fuel and wastage are excluded. Missing prices produce a partial “From” estimate; an unpriced main ingredient shows “Price needed”. No quantity, origin, price or yield is inferred from the private school menu. All 50 dishes in each category remain visible.

## PDF reference prices and retailer listings

The 92-page PDF was scanned locally for quantity/cost rows. `pdf-rates.js` contains only normalized item names, units, rates and page references—not menus, school consumption quantities or weekly budgets. Explicit supplier-list rates take precedence. A matching-unit PDF weekly rate fills gaps and is labelled budget-derived and undated. The first usable occurrence in PDF order is used; it is not asserted to be today's supplier quote. Important recovered references: masoor dal ₹110/kg, ragi flour ₹100/kg, Salem rice ₹44/kg, wheat flour ₹65/kg, rice flour ₹60/kg and besan ₹120/kg. Ambiguous fragments were excluded; grams/litres/pieces/packets/bunches were not conflated. The Ragi entry is treated as ragi flour following the user's clarification. Puffed rice weight pricing is grounded in the pori undai ingredient row on PDF page 90.

Price columns now include Blinkit, BigBasket and Instamart. `retailers.js` stores public listed reference prices with named products, pack evidence, observation date and source links. Rates are normalized per kg. They are not checkout quotes or delivery/availability guarantees. No location is requested or configured. Prior dates do not inherit later retailer observations; absent listings stay blank. Per-portion estimates may use the lowest available matching-unit listed reference. Different brands and grades can differ; product details are retained in link tooltips. No paid feeds, logins, new automations or Drive access were added.

## Meal packages

A fifth horizontal tab, Meal package, shows all 40 date-dependent options. Each includes a morning snack (sweet, curd-based, salted or milk ragi ganji, or pori undai), a red-rice-only lunch with a curry and palya, and an evening snack. Recipe combinations are generated from the public dish library; they are not copied school menu plans. Costs are shown per person with expandable meals and combined ingredients. Sample quantities cover ten people; red rice is 75g dry per person. Morning drinks do not automatically include cooking oil. Quantities are illustrative, not prescribed child portions or verified nutritional plans. Missing prices are explicitly partial.

November 2026 price expansion: 499 linked public product/pack observations, including named reference variants for unspecified PDF labels and regional shops beyond the three comparison retailers. Recipe costing matches exact units; pieces are never converted to kilograms using guessed weights. Observation dates are retained, and changing the date does not invent historical quotes. All 150 dish baskets and 25 light morning options have ingredient rates on the observation date. These are public listed references, not location-specific checkout/live quotes.

Meal package budget is ₹1,900 for 200 people (₹9.50 each). All 40 packages show group totals and budget status. Unpriced ingredients never qualify as within budget. Lunch uses the PDF planning quantity of 40g dry red rice per person; expandable quantities remain illustrative, and costs exclude additional spices, fuel, labour and wastage. Existing recipe quantities are not reduced to manufacture a budget fit.
