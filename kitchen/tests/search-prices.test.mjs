import assert from 'node:assert/strict';
import {allowed,packAmount,extractOffers,searchItem,today,matches,foodVariantAllowed,indexedQuote,duckResults,rssResults} from '../server/search-prices.mjs';
assert.equal(allowed('https://www.bigbasket.com/pd/1','BigBasket'),true);
for(const url of ['http://bigbasket.com/p','https://bigbasket.com.evil.example/p','https://localhost/','https://bigbasket.com:8080/','https://a:b@bigbasket.com/'])assert.equal(allowed(url,'BigBasket'),false);
assert.deepEqual(packAmount('Ragi flour 500 g'),{quantity:.5,unit:'kg',pack:'500 g'});assert.equal(packAmount('flour 500 g x 2'),null);
const html='<script type="application/ld+json">'+JSON.stringify({'@type':'Product',name:'Ragi flour 500 g',offers:{'@type':'Offer',priceCurrency:'INR',price:'40'}})+'</script>';
const input={name:'Ragi flour',provider:'BigBasket',url:'https://www.bigbasket.com/pd/1',date:today()};
assert.equal(extractOffers(html,input)[0].price,80);
assert.equal(extractOffers(html,{...input,date:'2020-01-01'}).length,0);
assert.equal(extractOffers(html.replace('Ragi flour','Ragi biscuit'),input).length,0);
assert.equal(extractOffers(html.replace('INR','USD'),input).length,0);
const calls=[];const result=await searchItem(input,async url=>{calls.push(url);return new Response(url.includes('bing.com')?'<rss><item><link>https://www.bigbasket.com/pd/1</link></item><item><link>https://localhost/private</link></item></rss>':html);});
assert.equal(calls.length,3);assert.equal(result.quotes[0].price,80);assert.equal(result.searched,true);
console.log('PASS: search discovery, primary-domain restriction, unit extraction, currency and date guards');

const indexed=indexedQuote({...input,title:'Buy Ragi flour 500 g Online at Best Price of Rs 87',snippet:'',url:input.url});assert.equal(indexed.price,174);assert.equal(indexed.basis,'Search-indexed reference');
assert.equal(indexedQuote({...input,title:'Buy Ragi biscuit 500 g at Price Rs 87',snippet:''}),null);
assert.equal(indexedQuote({...input,title:'Ragi flour 500 g',snippet:'MRP ₹87'}),null);
const duck=duckResults('<a class="result__a" href="//duckduckgo.com/l/?uddg=https%3A%2F%2Fwww.bigbasket.com%2Fpd%2F1">Buy Ragi flour 500 g Online at Best Price of Rs 87</a><a class="result__snippet">Price: ₹87</a>');assert.equal(duck[0].url,input.url);assert.equal(duck[0].snippet,'Price: ₹87');

assert.equal(matches('Milk','Coconut milk 400 ml'),false);assert.equal(matches('Red rice','Red rice flour 1 kg'),false);assert.equal(matches('Salt','Black salt 1 kg'),false);

assert.deepEqual(packAmount('Ponni Rice 5 kg (12 - 17 Months Old)'),{quantity:5,unit:'kg',pack:'5 kg'});
assert.equal(packAmount('Spinach 180 - 200 g'),null);
assert.deepEqual(packAmount('Cauliflower 1 pc (approx 400 - 600 g)'),{quantity:1,unit:'piece',pack:'1 pc'});

assert.equal(foodVariantAllowed('Milk','Amul Taaza Milk 500 ml'),false);
assert.equal(foodVariantAllowed('Curd','Nandini Curd 500 g'),true);
