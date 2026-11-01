import {dishes} from './dishes.js';
import {estimateDish} from './costing.js';
const quantity=(quantity,unit='kg')=>({quantity,unit});
export const mornings=[
 {id:'morning-sweet',name:'Sweet ragi ganji',base:'Ragi flour',type:'Snack',ingredients:['Ragi flour','Jaggery'],noOil:true,noSalt:true,quantities:{'Ragi flour':quantity(.25),Jaggery:quantity(.12)}},
 {id:'morning-curd',name:'Curd ragi ganji',base:'Ragi flour',type:'Snack',ingredients:['Ragi flour','Curd','Salt'],noOil:true,quantities:{'Ragi flour':quantity(.25),Curd:quantity(.5,'litre'),Salt:quantity(.01)}},
 {id:'morning-pori',name:'Pori undai',base:'Puffed rice',type:'Snack',ingredients:['Puffed rice','Jaggery'],noOil:true,noSalt:true,quantities:{'Puffed rice':quantity(.25),Jaggery:quantity(.15)}},
 {id:'morning-salted',name:'Salted ragi ganji',base:'Ragi flour',type:'Snack',ingredients:['Ragi flour','Salt'],noOil:true,quantities:{'Ragi flour':quantity(.25),Salt:quantity(.01)}},
 {id:'morning-milk',name:'Milk & jaggery ragi ganji',base:'Ragi flour',type:'Snack',ingredients:['Ragi flour','Milk','Jaggery'],noOil:true,noSalt:true,quantities:{'Ragi flour':quantity(.25),Milk:quantity(.5,'litre'),Jaggery:quantity(.08)}}
];
export const lunchRice={id:'red-rice-lunch',name:'Red rice',base:'Red rice',type:'Curry',ingredients:['Red rice'],noOil:true,noSalt:true,quantities:{'Red rice':quantity(.75)}};
export function buildMealPackages(getQuote,date){
 const cache=new Map();const cost=d=>{if(!cache.has(d.id))cache.set(d.id,estimateDish(d,getQuote));return cache.get(d.id);};
 const sorted=type=>dishes.filter(d=>d.type===type).sort((a,b)=>Number(!cost(a).basePriced)-Number(!cost(b).basePriced)||cost(a).missing-cost(b).missing||cost(a).perPortion-cost(b).perPortion||a.name.localeCompare(b.name)).slice(0,type==='Snack'?30:25);
 const curry=sorted('Curry'),palya=sorted('Palya'),snack=sorted('Snack');
 const day=Math.floor(Date.parse(date+'T12:00:00Z')/86400000),offset=((day%5)+5)%5;
 return Array.from({length:40},(_,i)=>{
  const morning=mornings[(i+offset)%mornings.length],c=curry[(i+offset)%curry.length],p=palya[(i*3+Math.floor(i/curry.length)+offset)%palya.length],s=snack[(i*7+Math.floor(i/10)+offset)%snack.length];
  const components=[{slot:'Morning snack',dish:morning},{slot:'Lunch · red rice',dish:lunchRice},{slot:'Lunch · curry',dish:c},{slot:'Lunch · palya',dish:p},{slot:'Evening snack',dish:s}].map(x=>({...x,estimate:cost(x.dish)}));
  const merged=new Map();for(const component of components)for(const ingredient of component.estimate.ingredients){const key=ingredient.name+'|'+ingredient.unit;if(!merged.has(key))merged.set(key,{...ingredient});else{const previous=merged.get(key);previous.quantity+=ingredient.quantity;previous.cost=previous.cost==null||ingredient.cost==null?null:previous.cost+ingredient.cost;}}
  const ingredients=[...merged.values()],subtotal=components.reduce((sum,c)=>sum+c.estimate.subtotal,0);
  return {id:'package-'+(i+1),components,ingredients,subtotal,perPortion:subtotal/10,missing:ingredients.filter(i=>i.cost==null).length,basePriced:components.every(c=>c.estimate.basePriced)};
 });
}
