import {JSDOM} from 'jsdom';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {defaults} from '../seed.js';
import {supplierSeed} from '../supplier-seed.js';
import * as model from '../model.js';
import * as dishModule from '../dishes.js';
import {estimateDish} from '../costing.js';
import {pdfRates} from '../pdf-rates.js';
import {retailerPrices,retailerQuote,otherQuote} from '../retailers.js';
import {buildMealPackages} from '../packages.js';
const dom=new JSDOM(readFileSync('kitchen/index.html','utf8'),{url:'https://example.org',runScripts:'outside-only'}),w=dom.window;
Object.assign(w,model,dishModule,{searchEndpoint:'',defaults,supplierSeed,estimateDish,pdfRates,retailerPrices,retailerQuote,otherQuote,buildMealPackages});let fetches=0;
const feed=JSON.parse(readFileSync('kitchen/market.json','utf8'));
// Pin one historical market quote so freshness checks do not depend on changing live data.
feed.records=feed.records.filter(r=>r.name!=='Red rice');feed.records.push({name:'Red rice',unit:'kg',price:80,date:'2026-11-01',source:'Historical test fixture'});
w.fetch=async url=>{fetches++;return{ok:true,json:async()=>url.includes('supplier.json')?{quotes:[...supplierSeed,...pdfRates]}:url.includes('retailer-prices.json')?{quotes:[...retailerPrices]}:feed}};
w.eval(readFileSync('kitchen/app.js','utf8').replace(/^import .*;\n/gm,''));await new Promise(r=>setTimeout(r,0));
const $=s=>w.document.querySelector(s);
assert.equal(w.document.querySelectorAll('input').length,1);assert.equal(w.document.querySelectorAll('button').length,5);assert.equal(w.document.querySelectorAll('th').length,7);assert.equal(w.document.querySelectorAll('header,footer,nav,select,h1,h2').length,0);
const red=[...w.document.querySelectorAll('#priceRows tr')].find(r=>r.firstChild.textContent==='Red rice');assert.match(red.children[1].textContent,/₹80/);assert.match(red.children[2].textContent,/₹55/);assert.ok(red.children[1].classList.contains('stale-price'));assert.equal(red.children[2].classList.contains('stale-price'),false);
assert.equal(w.document.querySelectorAll('#dishList .dish').length,50);assert.ok([...w.document.querySelectorAll('#dishList small')].every(e=>e.textContent.length>2));
assert.equal($('#pricePanel').hidden,false);assert.equal($('#dishList').hidden,true);
$('[data-type="Snack"]').click();assert.equal($('#pricePanel').hidden,true);assert.equal($('#dishList').hidden,false);assert.equal(w.document.querySelectorAll('#dishList .dish').length,50);assert.match($('#dishList').textContent,/Dhokla/);
const previous=$('#dishList').textContent;$('#priceDate').value='2026-10-30';$('#priceDate').dispatchEvent(new w.Event('change'));await new Promise(r=>setTimeout(r,0));assert.equal(fetches,8);assert.notEqual($('#dishList').textContent,previous);
$('#priceDate').value='2020-01-01';$('#priceDate').dispatchEvent(new w.Event('change'));await new Promise(r=>setTimeout(r,0));assert.ok([...w.document.querySelectorAll('#priceRows tr')].every(r=>r.children[1].textContent==='No dated quote'));
$('[data-type="Curry"]').dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight'}));assert.equal($('[data-type="Palya"]').getAttribute('aria-selected'),'true');
const card=w.document.querySelector('.dish');assert.equal(card.open,false);card.querySelector('summary').click();assert.equal(card.open,true);assert.match(card.textContent,/10 PORTIONS/);assert.ok(card.querySelectorAll('.ingredient-row').length>=3);assert.ok(card.querySelector('.dish-cost strong').textContent.length>0);
$('#priceDate').value=model.todayIST();$('#priceDate').dispatchEvent(new w.Event('change'));await new Promise(r=>setTimeout(r,0));
const ragi=[...w.document.querySelectorAll('#priceRows tr')].find(r=>r.firstChild.textContent==='Ragi flour');assert.match(ragi.children[2].textContent,/₹100/);assert.ok([...ragi.children].slice(3).every(c=>c.textContent.includes('₹')));
const masoor=[...w.document.querySelectorAll('#priceRows tr')].find(r=>r.firstChild.textContent==='Masoor dal');assert.match(masoor.children[2].textContent,/₹110/);
$('[data-type="Meal"]').click();assert.equal($('#mealList').hidden,false);assert.equal($('#dishList').hidden,true);assert.equal(w.document.querySelectorAll('#mealList .meal-card').length,40);assert.ok([...w.document.querySelectorAll('.meal-menu')].every(menu=>menu.textContent.includes('Red rice')));
assert.equal($('#error').hidden,true);
console.log('PASS: date-only control, three-column prices, four tabs, state labels, automatic date refresh, rotating dishes and missing history');

assert.ok([...w.document.querySelectorAll('#priceRows td')].every(c=>c.textContent.trim().length>0));

for(const row of w.document.querySelectorAll('#priceRows tr'))for(const i of [1,3,4,5,6])assert.match(row.children[i].textContent,/₹/,row.firstChild.textContent+' price column '+i);
const salem=[...w.document.querySelectorAll('#priceRows tr')].find(r=>r.firstChild.textContent==='Salem rice');assert.match(salem.children[3].textContent,/Blinkit quote not verified/);assert.match(salem.children[3].textContent,/Organic Grocer reference/);

// A refresh on a later day must never present an older retailer quote as that day's price.
$('#priceDate').value='2026-11-02';$('#priceDate').dispatchEvent(new w.Event('change'));await new Promise(r=>setTimeout(r,0));
const oldRagi=[...w.document.querySelectorAll('#priceRows tr')].find(r=>r.firstChild.textContent==='Ragi flour');
assert.ok(oldRagi.children[3].classList.contains('stale-price'));assert.match(oldRagi.children[3].textContent,/Not verified for 2 Nov 2026/);assert.match(oldRagi.children[3].textContent,/last recorded 1 Nov 2026/);assert.ok(oldRagi.children[3].querySelector('b').classList.contains('neutral'));
assert.equal(oldRagi.children[2].classList.contains('stale-price'),false);
$('#priceDate').value='2026-11-01';$('#priceDate').dispatchEvent(new w.Event('change'));await new Promise(r=>setTimeout(r,0));
const historicalRagi=[...w.document.querySelectorAll('#priceRows tr')].find(r=>r.firstChild.textContent==='Ragi flour');assert.equal(historicalRagi.children[3].classList.contains('stale-price'),false);

const currentMilk=retailerQuote('BigBasket','Milk','litre','2026-11-05');assert.ok(!currentMilk||/nandini/i.test(currentMilk.product));
