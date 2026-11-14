import assert from 'node:assert/strict';
import {buildMealPackages,mornings,lunchRice} from '../packages.js';
import {pdfRates} from '../pdf-rates.js';
import {supplierSeed} from '../supplier-seed.js';
import {retailerPrices,retailerQuote} from '../retailers.js';
const quotes=[...supplierSeed,...pdfRates];
const getQuote=(name,unit)=>quotes.find(q=>q.name===name&&q.unit===unit)||null;
const packages=buildMealPackages(getQuote,'2026-11-01');assert.equal(packages.length,40);
assert.equal(new Set(packages.map(p=>p.components.map(c=>c.dish.id).join('|'))).size,40);
assert.ok(packages.every(p=>p.components[1].dish.name==='Red rice'&&p.components[1].estimate.ingredients[0].quantity===.4));
assert.ok(packages.every(p=>p.components[0].slot==='Morning snack'&&p.components.at(-1).slot==='Evening snack'));
assert.deepEqual(new Set(packages.map(p=>p.components[0].dish.name)),new Set(mornings.map(m=>m.name)));
assert.equal(lunchRice.ingredients[0],'Red rice');assert.equal(getQuote('Ragi flour','kg').price,100);assert.equal(getQuote('Masoor dal','kg').price,110);assert.equal(getQuote('Salem rice','kg').price,44);assert.equal(getQuote('Red rice','kg').price,55);
assert.ok(pdfRates.every(r=>Number.isFinite(r.price)&&r.price>0&&r.page>=1&&r.page<=92));
assert.ok(retailerQuote('Instamart','Ragi flour','kg','2026-11-01').price>0);assert.ok(retailerQuote('BigBasket','Sona Masuri rice (raw)','kg','2026-11-01').price>0);assert.equal(retailerQuote('Blinkit','Ragi flour','kg','2026-10-30'),null);
assert.ok(retailerPrices.every(r=>r.url.startsWith('https://')&&r.pack&&r.product&&r.observed));
assert.ok(buildMealPackages(()=>null,'2026-11-01').every(p=>!p.basePriced&&p.missing>0));
console.log('PASS: 40 distinct packages, fixed red-rice lunch, morning options, PDF rates, unit conversions and dated retailer references');

assert.ok(packages.every(p=>p.people===200&&p.budget===1900&&Math.abs(p.totalForGroup-p.perPortion*200)<1e-6));assert.ok(buildMealPackages(()=>null,'2026-11-01').every(p=>!p.withinBudget));

const monday=buildMealPackages(getQuote,'2026-11-09'),tuesday=buildMealPackages(getQuote,'2026-11-10');
assert.ok(monday.every(p=>p.components.length===6&&p.components[4].dish.base==='Curd'));
assert.ok(tuesday.every(p=>p.components.length===6&&p.components[4].dish.base==='Milk'));
assert.equal(monday[0].components[4].estimate.ingredients.find(i=>i.name==='Curd').quantity,.5);
assert.equal(tuesday[0].components[4].estimate.ingredients.find(i=>i.name==='Milk').quantity,.5);
assert.ok(tuesday[0].components[4].estimate.subtotal>=27);


assert.equal(packages.filter(p=>p.components.some(c=>c.dish.international)).length,30);
assert.equal(packages.filter(p=>p.components.every(c=>!c.dish.international)).length,10);
assert.ok(packages.some(p=>p.components.some(c=>c.dish.international)&&p.components.some(c=>!c.dish.international&&['Curry','Palya','Snack'].includes(c.dish.type))));
