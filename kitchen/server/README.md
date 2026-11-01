# Kitchen search service

A server is necessary: GitHub Pages cannot make server-side search or product-page requests. This service searches Bing RSS on each request, then extracts INR structured Product/Offer prices from up to three matching primary pages. No API key is required. The source may block scraping or omit structured offers; failures are reported and never replaced by invented prices. Search cannot guarantee all retailer prices or recover historical offers. Supplier rates are not discovered from unrelated retailers.

Run with Node 22+: `node kitchen/server/index.mjs`. GET `/health`; GET `/api/search-prices?name=Ragi%20flour&provider=BigBasket&date=YYYY-MM-DD`. Deploy the repository to a Node web-service host using `node kitchen/server/index.mjs`, with PORT supplied by the host. ALLOWED_ORIGINS defaults to the existing GitHub Pages origin. Free hosting may sleep or impose limits. No paid resources are provisioned by these files.

Once hosted, set kitchen/search-config.js searchEndpoint to its HTTPS `/api/search-prices` URL. The browser searches automatically on each date change with four concurrent requests. The service is source-code ready; deployment and real upstream extraction must be verified before claiming live prices.
