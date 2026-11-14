import {estimateDish} from './costing.js';
const q=(quantity,unit='kg')=>({quantity,unit});
const tender=['Pumpkin','Bottle gourd','Carrot','Beetroot','Chayote'];
const firm=['Potato','Sweet potato','Pumpkin','Carrot','Beetroot'];
const sides=['Cabbage','Carrot','Beetroot','French beans','Ivy gourd','Chayote'];
// Original kitchen concepts. State labels describe flavour inspiration, not origin.
export const creativeTemplates=[
 {id:'rice-cups',name:'moong rice cups',type:'Snack',state:'Karnataka',pool:tender,ingredients:['Rice flour','Moong dal','Coconut'],quantities:{'Rice flour':q(.3),'Moong dal':q(.1),Coconut:q(.2,'piece')},steps:['Cook the moong dal until tender; grate or finely chop the vegetable.','Mix with rice flour, coconut, salt and enough water for a thick batter.','Spoon into lightly greased cups and steam until fully cooked.']},
 {id:'dal-rolls',name:'steamed dal rolls',type:'Snack',state:'Gujarat',pool:tender,ingredients:['Chana dal','Rice flour','Cumin seeds'],quantities:{'Chana dal':q(.25),'Rice flour':q(.15)},steps:['Soak and grind the chana dal; finely grate the vegetable.','Combine with rice flour, cumin and salt to form soft rolls.','Steam until cooked through, then slice into small rounds.']},
 {id:'poha-patties',name:'poha griddle patties',type:'Snack',state:'Maharashtra',pool:firm,ingredients:['Poha','Besan','Cumin seeds'],quantities:{Poha:q(.3),Besan:q(.1)},steps:['Soften the poha; cook and mash the vegetable.','Bind with besan, cumin and salt; shape small patties.','Cook on a lightly oiled griddle until both sides are set.']},
 {id:'ragi-rolls',name:'ragi pinwheels',type:'Snack',state:'Karnataka',pool:tender,ingredients:['Ragi flour','Wheat flour','Curd'],quantities:{'Ragi flour':q(.2),'Wheat flour':q(.15),Curd:q(.1,'litre')},steps:['Make a soft dough with ragi flour, wheat flour, curd and water.','Cook the grated vegetable into a dry filling, spread on rolled dough and roll up.','Slice carefully and steam until the dough is fully cooked.']},
 {id:'rice-bowl',name:'red-rice kootu bowl',type:'Curry',state:'Tamil Nadu',pool:tender,ingredients:['Red rice','Moong dal','Coconut'],quantities:{'Red rice':q(.4),'Moong dal':q(.15),Coconut:q(.2,'piece')},steps:['Wash red rice and moong dal; chop the vegetable.','Cook together with enough water until the rice and dal are soft.','Stir in coconut and a mild tempering; serve as a soft one-pot bowl.']},
 {id:'curd-dumplings',name:'curd-gravy dumplings',type:'Curry',state:'Rajasthan',pool:tender,ingredients:['Besan','Wheat flour','Curd','Cumin seeds'],quantities:{Besan:q(.2),'Wheat flour':q(.1),Curd:q(.3,'litre')},steps:['Mix finely grated vegetable with besan, wheat flour and salt; shape and steam small dumplings.','Whisk curd with water and a little of the measured besan.','Warm the gravy gently with cumin, add the cooked dumplings and avoid a rapid boil.']},
 {id:'coconut-ragout',name:'coconut cowpea ragout',type:'Curry',state:'Goa',pool:tender,ingredients:['Cowpeas','Coconut milk','Ginger'],quantities:{Cowpeas:q(.2),'Coconut milk':q(.2,'litre'),Ginger:q(.01)},steps:['Soak and fully cook the dried cowpeas.','Cook the vegetable with ginger until tender.','Combine with cowpeas and coconut milk, then simmer gently.']},
 {id:'wheat-pockets',name:'peanut wheat pockets',type:'Snack',state:'Maharashtra',pool:firm,ingredients:['Wheat flour','Peanuts','Cumin seeds'],quantities:{'Wheat flour':q(.35),Peanuts:q(.08)},steps:['Cook and mash the vegetable; mix with crushed peanuts and cumin.','Enclose a small spoonful in thin wheat dough and seal well.','Cook the pockets on a griddle until the dough and filling are hot throughout.']},
 {id:'sesame-coins',name:'sesame vegetable coins',type:'Snack',state:'Telangana',pool:firm,ingredients:['Besan','Rice flour','Sesame seeds'],quantities:{Besan:q(.2),'Rice flour':q(.1),'Sesame seeds':q(.03)},steps:['Cook and mash the vegetable, then combine with both flours and salt.','Shape small flat coins and press a little sesame on each.','Pan-cook with the measured oil until firm and cooked through.']},
 {id:'tangy-dal',name:'tangy moong mash',type:'Curry',state:'Andhra Pradesh',pool:tender,ingredients:['Moong dal','Tamarind','Coconut'],quantities:{'Moong dal':q(.2),Tamarind:q(.025),Coconut:q(.2,'piece')},steps:['Cook moong dal and chopped vegetable until soft.','Add diluted tamarind and simmer until its raw taste is gone.','Finish with coconut and a mild tempering; keep the texture spoonable.']},
 {id:'lemon-crumble',name:'lemon dal crumble',type:'Palya',state:'Tamil Nadu',pool:sides,ingredients:['Chana dal','Lemon','Coconut','Mustard seeds'],quantities:{'Chana dal':q(.12),Lemon:q(.5,'piece'),Coconut:q(.2,'piece')},steps:['Soak, cook and drain the chana dal; finely chop the vegetable.','Cook the vegetable with mustard and the measured oil, then add dal and coconut.','Reduce excess moisture and finish with lemon after switching off the heat.']},
 {id:'mini-pudding',name:'mini ragi pudding cups',type:'Snack',state:'Karnataka',pool:['Pumpkin','Carrot','Beetroot','Sweet potato'],ingredients:['Ragi flour','Jaggery','Milk'],quantities:{'Ragi flour':q(.2),Jaggery:q(.1),Milk:q(.5,'litre')},noOil:true,noSalt:true,steps:['Cook and puree the vegetable; dissolve the jaggery separately and strain if needed.','Mix ragi flour with milk and water, then cook while stirring until smooth and fully cooked.','Fold in the puree and jaggery, portion into small cups and serve warm.']}
];
const label=name=>name.toLowerCase();
export function buildCreativeIdeas(getQuote,{date,limit=36}={}){
 const day=Math.floor(Date.parse(date+'T12:00:00Z')/86400000),ideas=[];
 for(const [index,t] of creativeTemplates.entries()){
  const ranked=t.pool.map(name=>({name,quote:getQuote(name,'kg')})).filter(x=>x.quote&&Number.isFinite(x.quote.price)&&x.quote.price>0&&x.quote.unit==='kg').sort((a,b)=>a.quote.price-b.quote.price||a.name.localeCompare(b.name));
  const pool=ranked.slice(0,Math.min(4,ranked.length>3?ranked.length-1:ranked.length));
  if(!pool.length)continue;
  const start=((day+index)%pool.length+pool.length)%pool.length;
  for(let i=0;i<Math.min(3,pool.length);i++){
   const base=pool[(start+i)%pool.length],ingredients=[base.name,...t.ingredients];
   const quantities={...t.quantities,[base.name]:q(t.id==='mini-pudding'?.4:.6),'Cooking oil (unspecified)':q(.02,'litre'),Salt:q(.01),'Cumin seeds':q(.005),'Mustard seeds':q(.005)};
   const d={id:'creative-'+t.id+'-'+base.name.toLowerCase().replace(/[^a-z]+/g,'-'),name:base.name+' '+t.name,type:t.type,state:t.state,base:base.name,unit:'kg',ingredients,quantities,noOil:!!t.noOil,noSalt:!!t.noSalt,creative:true,basePrice:base.quote.price,steps:t.steps,description:'An original '+t.type.toLowerCase()+' idea using '+label(base.name)+'.',reason:'Budget pick: '+base.name+' is one of the '+pool.length+' lowest-priced suitable ingredients checked for this recipe.'};
   ideas.push({...d,estimate:estimateDish(d,getQuote)});
  }
 }
 return ideas.sort((a,b)=>a.estimate.missing-b.estimate.missing||a.estimate.perPortion-b.estimate.perPortion||a.id.localeCompare(b.id)).slice(0,limit);
}
