import assert from 'node:assert/strict';
import fs from 'node:fs';
import {manualPrices} from '../manual-prices.js';
import {retailerPrices,retailerQuote} from '../retailers.js';
import {foodVariantAllowed,packAmount} from '../server/search-prices.mjs';
const review=JSON.parse(fs.readFileSync('kitchen/manual-review.json'));
assert.equal(new Set(manualPrices.map(q=>q.name)).size,159);
assert.equal(manualPrices.length,review.references);
for(const q of manualPrices){
 assert.equal(q.sourcePriceDate,null);
 assert.equal(q.observed,'2026-11-03');
 assert.ok(q.url.startsWith('https://'));
 assert.ok(foodVariantAllowed(q.name,q.product));
 const pack=packAmount(q.pack);assert.ok(pack,q.pack);
 assert.equal(pack.unit,q.unit);
 assert.ok(Math.abs(q.price*pack.quantity-q.packQuantity)<.001);
}
for(const [name,title] of [['Beetroot','Beetroot powder'],['Mint','Mentos mint chewy candy'],['Wheat flour','Refined wheat flour maida'],['Cloves','Garlic cloves'],['Banana','Banana stem'],['Mustard greens','Terra Greens Mustard seeds'],['Dried yellow peas','Yellow pigeon peas toor dal'],['Salt','Himalayan Pink Salt'],['Cinnamon','Cinnamon capsules']])assert.equal(foodVariantAllowed(name,title),false);
const common={name:'Rank test',retailer:'BigBasket',unit:'kg',observed:'2026-11-03'};
retailerPrices.push({...common,price:10,verification:'manual_search_result'},{...common,price:20,verification:'manual_product_page'});
assert.equal(retailerQuote('BigBasket','Rank test','kg','2026-11-03').price,20);
retailerPrices.splice(retailerPrices.findIndex(q=>q.name==='Rank test'),2);
assert.equal(manualPrices.find(q=>q.name==='Bread rolls'&&q.unit==='piece').price,40/6);
