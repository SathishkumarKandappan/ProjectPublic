import assert from 'node:assert/strict';
import fs from 'node:fs';
import {manualPrices} from '../manual-prices.js';
import {retailerPrices,retailerQuote} from '../retailers.js';
import {foodVariantAllowed,packAmount} from '../server/search-prices.mjs';
const review=JSON.parse(fs.readFileSync('kitchen/manual-review.json'));
assert.equal(new Set(manualPrices.map(q=>q.name)).size,review.ingredients);
const latest=JSON.parse(fs.readFileSync('kitchen/manual-latest.json')).quotes.filter(q=>q.observed===review.checkedAt);
assert.equal(latest.length,review.references);
assert.equal(new Set(latest.map(q=>q.name)).size,review.ingredients);
for(const q of [...manualPrices,...latest]){
 assert.equal(q.sourcePriceDate,null);
 assert.ok(/^2026-11-\d{2}$/.test(q.observed)&&q.observed<=review.checkedAt);
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

assert.ok(manualPrices.filter(q=>['Milk','Curd'].includes(q.name)).every(q=>/nandini/i.test(q.product)));
assert.equal(retailerQuote('BigBasket','Milk','litre',review.checkedAt)?.product?.includes('Amul')||false,false);
assert.ok(retailerQuote('Instamart','Curd','kg',review.checkedAt).product.includes('Nandini'));

