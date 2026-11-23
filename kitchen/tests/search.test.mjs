import assert from 'node:assert/strict';
import {matchesDish,searchDishes} from '../search.js';
import {dishes} from '../dishes.js';
const chaat={name:'Kabuli chana chaat',state:'Delhi',type:'Snack',base:'Kabuli channa',ingredients:['Kabuli channa','Tomato','Cucumber'],noOil:true};
for(const q of ['chana','channa','chole','chickpea','chickpeas','kabuli channa','tomato cucumber','Delhi','salt'])assert.ok(matchesDish(chaat,q),q);
assert.ok(!matchesDish(chaat,'milk'));assert.ok(!matchesDish(chaat,'onion banana'));
const potato={name:'Aloo beans',state:'Punjab',type:'Palya',ingredients:['Potato','French beans']};for(const q of ['potato','potatoes','aloo','French beans','oil'])assert.ok(matchesDish(potato,q),q);
const results=searchDishes([...dishes,...dishes],'chickpea');assert.ok(results.length>10);assert.equal(new Set(results.map(d=>d.id)).size,results.length);assert.ok(results.some(d=>d.international));assert.ok(results.some(d=>!d.international));assert.equal(searchDishes(dishes,'zzzzzz').length,0);
console.log('PASS: ingredient AND search, kitchen aliases, international and Indian results, deduplication, implied oil and salt, empty results');
