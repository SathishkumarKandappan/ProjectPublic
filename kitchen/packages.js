import {dishes} from './dishes.js?v=25';
import {estimateDish} from './costing.js';
const quantity=(quantity,unit='kg')=>({quantity,unit});
const morning=(id,name,state,ingredients,quantities)=>({id,name,state,base:ingredients[0],type:'Snack',ingredients,noOil:true,noSalt:!ingredients.includes('Salt'),quantities});
export const mornings=[
 morning('morning-sweet','Sweet ragi ganji','Karnataka',['Ragi flour','Jaggery'],{'Ragi flour':quantity(.075),Jaggery:quantity(.05)}),
 morning('morning-curd','Curd ragi ganji','Karnataka',['Ragi flour','Curd','Salt'],{'Ragi flour':quantity(.075),Curd:quantity(.25,'litre'),Salt:quantity(.003)}),
 morning('morning-pori','Pori undai','Tamil Nadu',['Puffed rice','Jaggery'],{'Puffed rice':quantity(.075),Jaggery:quantity(.05)}),
 morning('morning-salted','Salted ragi ganji','Karnataka',['Ragi flour','Salt'],{'Ragi flour':quantity(.075),Salt:quantity(.003)}),
 morning('morning-milk','Milk & jaggery ragi ganji','Karnataka',['Ragi flour','Milk','Jaggery'],{'Ragi flour':quantity(.075),Milk:quantity(.25,'litre'),Jaggery:quantity(.04)}),
 morning('morning-ragi-ladoo','Mini ragi ladoo','Karnataka',['Ragi flour','Jaggery','Coconut'],{'Ragi flour':quantity(.08),Jaggery:quantity(.05),Coconut:quantity(.05,'piece')}),
 morning('morning-rava-ladoo','Mini rava ladoo','Maharashtra',['Rava','Jaggery','Coconut'],{Rava:quantity(.1),Jaggery:quantity(.05),Coconut:quantity(.05,'piece')}),
 morning('morning-banana-shake','Banana milkshake','Across India',['Banana','Milk'],{Banana:quantity(.25),Milk:quantity(.5,'litre')}),
 morning('morning-watermelon','Watermelon juice','Across India',['Watermelon'],{Watermelon:quantity(.7)}),
 morning('morning-buttermilk','Spiced buttermilk','Karnataka',['Curd','Salt','Cumin seeds'],{Curd:quantity(.2,'litre'),Salt:quantity(.003),'Cumin seeds':quantity(.001)}),
 morning('morning-lemon','Lemon water','Across India',['Lemon','Sugar'],{Lemon:quantity(1,'piece'),Sugar:quantity(.03)}),
 morning('morning-papaya','Small papaya bowl','Across India',['Papaya'],{Papaya:quantity(.5)}),
 morning('morning-banana','Small banana portion','Across India',['Banana'],{Banana:quantity(.4)}),
 morning('morning-curd-banana','Curd & banana bowl','Across India',['Curd','Banana'],{Curd:quantity(.25,'litre'),Banana:quantity(.25)}),
 morning('morning-avalakki','Small vegetable avalakki','Karnataka',['Poha','Carrot','Salt'],{Poha:quantity(.1),Carrot:quantity(.04),Salt:quantity(.003)}),
 morning('morning-upma','Small vegetable upma','Karnataka',['Rava','Carrot','Salt'],{Rava:quantity(.1),Carrot:quantity(.04),Salt:quantity(.003)}),
 morning('morning-idli','Mini idli','Tamil Nadu',['Idli rice','Urad dal','Salt'],{'Idli rice':quantity(.12),'Urad dal':quantity(.03),Salt:quantity(.003)}),
 morning('morning-rava-idli','Mini rava idli','Karnataka',['Rava','Curd','Salt'],{Rava:quantity(.12),Curd:quantity(.1,'litre'),Salt:quantity(.003)}),
 morning('morning-dhokla','Small steamed dhokla','Gujarat',['Besan','Curd','Salt'],{Besan:quantity(.12),Curd:quantity(.1,'litre'),Salt:quantity(.003)}),
 morning('morning-sundal','Small soft sundal','Tamil Nadu',['Black channa','Coconut','Salt'],{'Black channa':quantity(.12),Coconut:quantity(.05,'piece'),Salt:quantity(.003)}),
 morning('morning-moong','Moong-dal ganji','Karnataka',['Moong dal','Salt'],{'Moong dal':quantity(.1),Salt:quantity(.003)}),
 morning('morning-rice-kanji','Red-rice kanji','Kerala',['Red rice','Salt'],{'Red rice':quantity(.1),Salt:quantity(.003)}),
 morning('morning-kozhukattai','Mini rice kozhukattai','Tamil Nadu',['Rice flour','Coconut','Salt'],{'Rice flour':quantity(.12),Coconut:quantity(.05,'piece'),Salt:quantity(.003)}),
 morning('morning-curd-poha','Curd avalakki','Karnataka',['Poha','Curd','Salt'],{Poha:quantity(.1),Curd:quantity(.1,'litre'),Salt:quantity(.003)}),
 morning('morning-rice-porridge','Light rice-flour porridge','Kerala',['Rice flour','Jaggery'],{'Rice flour':quantity(.075),Jaggery:quantity(.04)})
];
export const lunchRice={id:'red-rice-lunch',name:'Red rice',base:'Red rice',type:'Curry',ingredients:['Red rice'],noOil:true,noSalt:true,quantities:{'Red rice':quantity(.4)}};
// Adjustable planning assumptions; actual glass size, dilution and curd yield are not yet supplied.
export const dairyPlanning={brand:'Nandini',firstSchoolDay:1,glassMl:100,glasses:2,curdParts:1,waterParts:3};
export function dailyButtermilk(date){
 const purchased=new Date(date+'T12:00:00Z').getUTCDay()===dairyPlanning.firstSchoolDay;
 const base=purchased?'Curd':'Milk';
 return {id:'daily-buttermilk-'+base.toLowerCase(),name:'Homemade buttermilk · '+(purchased?'purchased Nandini curd':'curd set with Nandini milk'),state:'Karnataka',base,type:'Snack',noOil:true,ingredients:[base,'Salt','Cumin seeds'],quantities:{[base]:quantity(.5,'litre'),Salt:quantity(.005),'Cumin seeds':quantity(.001)}};
}
export const packageBudget=1900,packagePeople=200;
// School-PDF planning profile: 8 kg dry rice / 200 people; small snack quantities.
export function buildMealPackages(getQuote,date){
 const cache=new Map();const cost=d=>{if(!cache.has(d.id))cache.set(d.id,estimateDish(d,getQuote));return cache.get(d.id);};
 const sorted=type=>dishes.filter(d=>d.type===type).sort((a,b)=>Number(!cost(a).basePriced)-Number(!cost(b).basePriced)||cost(a).missing-cost(b).missing||cost(a).perPortion-cost(b).perPortion||a.name.localeCompare(b.name)).slice(0,type==='Snack'?30:25);
 const curry=sorted('Curry'),palya=sorted('Palya'),snack=sorted('Snack');
 const day=Math.floor(Date.parse(date+'T12:00:00Z')/86400000),offset=((day%5)+5)%5;
 return Array.from({length:40},(_,i)=>{
  const morning=mornings[(i+offset)%mornings.length],c=curry[(i+offset)%curry.length],p=palya[(i*3+Math.floor(i/curry.length)+offset)%palya.length],s=snack[(i*7+Math.floor(i/10)+offset)%snack.length];
  const components=[{slot:'Morning snack',dish:morning},{slot:'Lunch · red rice',dish:lunchRice},{slot:'Lunch · curry',dish:c},{slot:'Lunch · palya',dish:p},{slot:'Lunch · daily buttermilk',dish:dailyButtermilk(date)},{slot:'Evening snack',dish:s}].map(x=>({...x,estimate:cost(x.dish)}));
  const merged=new Map();for(const component of components)for(const ingredient of component.estimate.ingredients){const key=ingredient.name+'|'+ingredient.unit;if(!merged.has(key))merged.set(key,{...ingredient});else{const previous=merged.get(key);previous.quantity+=ingredient.quantity;previous.cost=previous.cost==null||ingredient.cost==null?null:previous.cost+ingredient.cost;}}
  const ingredients=[...merged.values()],subtotal=components.reduce((sum,c)=>sum+c.estimate.subtotal,0);
  const missing=ingredients.filter(i=>i.cost==null).length,basePriced=components.every(c=>c.estimate.basePriced),totalForGroup=subtotal/10*packagePeople;return {id:'package-'+(i+1),components,ingredients,subtotal,perPortion:subtotal/10,missing,basePriced,totalForGroup,withinBudget:missing===0&&basePriced&&totalForGroup<=packageBudget,budget:packageBudget,people:packagePeople};
 }).sort((a,b)=>Number(b.withinBudget)-Number(a.withinBudget)||a.missing-b.missing||a.totalForGroup-b.totalForGroup);
}

