import assert from 'node:assert/strict';
import {dishes,dailyIdeas} from '../dishes.js';
import {estimateDish} from '../costing.js';
import {supplierSeed} from '../supplier-seed.js';
import {pdfRates} from '../pdf-rates.js';
import fs from 'node:fs';
const types=['Curry','Palya','Snack','International Curry/Main Course','International Palya','International Snacks'];
assert.equal(dishes.length,300);assert.equal(new Set(dishes.map(d=>d.id)).size,300);assert.equal(new Set(dishes.map(d=>d.name)).size,300);
for(const type of types)assert.equal(dishes.filter(d=>d.type===type).length,50);
assert.ok(dishes.every(d=>d.state&&d.base&&d.ingredients.length>=2&&d.description));
const indian=dishes.filter(d=>!d.international),world=dishes.filter(d=>d.international);
const states=['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];
assert.ok(states.every(state=>indian.some(d=>d.state.startsWith(state))));assert.ok(new Set(world.map(d=>d.country)).size>=30);
const quote=(name,unit)=>({price:name==='Potato'?25:60,unit});
for(const type of types){const a=dailyIdeas(quote,{type,date:'2026-11-14'}),b=dailyIdeas(quote,{type,date:'2026-11-15'});assert.equal(a.length,8);assert.equal(new Set(a.map(d=>d.id)).size,8);assert.notDeepEqual(a.map(d=>d.id),b.map(d=>d.id));assert.deepEqual(a,dailyIdeas(quote,{type,date:'2026-11-14'}));assert.equal(dailyIdeas(quote,{type,all:true}).length,50);assert.ok(new Set(a.map(d=>d.state)).size>=4);}
const first=dailyIdeas(quote,{type:'Palya',all:true})[0].id;
assert.notEqual(first,dailyIdeas((name,unit)=>({price:name==='Potato'?1000:1,unit}),{type:'Palya',all:true})[0].id);
assert.ok(dailyIdeas(()=>null,{type:'Curry',date:'2026-11-14'}).every(d=>d.score===null));
assert.equal(dailyIdeas(quote,{query:'DOES NOT EXIST',all:true}).length,0);
for(const name of ['Kabuli chana chaat','Aloo chole chaat','Dahi chana chaat','Mixed chana chaat','Chana bhel','Imli chole chaat'])assert.ok(indian.some(d=>d.name===name));
const latest=JSON.parse(fs.readFileSync('kitchen/manual-latest.json')).quotes.filter(q=>q.observed==='2026-11-14');const quotes=[...supplierSeed,...pdfRates,...latest];
for(const d of dishes){const e=estimateDish(d,(n,u)=>quotes.find(q=>q.name===n&&q.unit===u));assert.equal(e.missing,0,d.name+' has an unpriced ingredient');assert.ok(e.perPortion>0);for(const i of e.ingredients)assert.ok(i.quantity>0&&i.quantity<11,d.name+' '+i.name);}
console.log('PASS: 300 distinct dishes; 50 per category; all 28 Indian states; 30+ international associations; price/date rotation; all ingredients have matching-unit references');
