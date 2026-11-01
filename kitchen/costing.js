// Illustrative ingredient baskets for ten portions. Not validated recipe yields.
const pulses=new Set(['Toor dal','Moong dal','Chana dal','Urad dal','Masoor dal','Black channa','Kabuli channa','Rajma','Horse gram','Black soybeans','Dried yellow peas','Whole green gram','Cowpeas']);
const flours=new Set(['Besan','Wheat flour','Rice flour','Ragi flour','All-purpose flour','Bhajani flour','Sattu']);
const grains=new Set(['Idli rice','Sona Masuri rice (raw)','Red rice','Poha','Rava','Sabudana']);
const spices=new Set(['Cumin seeds','Mustard seeds','Carom seeds','Turmeric powder','Pepper','Khar']);
export function sampleQuantity(name,type,base=false){
 if(name==='Taro leaves')return {quantity:10,unit:'piece'};
 if(name==='Coconut')return {quantity:.5,unit:'piece'};
 if(name==='Curd'||name==='Coconut milk')return {quantity:.4,unit:'litre'};
 if(name==='Cooking oil (unspecified)'||name==='Mustard oil')return {quantity:.05,unit:'litre'};
 if(name==='Lemon')return {quantity:1,unit:'piece'};
 if(name==='Bread rolls')return {quantity:10,unit:'piece'};
 if(name==='Salt')return {quantity:.02,unit:'kg'};
 if(spices.has(name))return {quantity:.01,unit:'kg'};
 if(name==='Garlic'||name==='Ginger')return {quantity:.03,unit:'kg'};
 if(name==='Coriander leaves'||name==='Curry leaves')return {quantity:.02,unit:'kg'};
 if(name==='Green chilli')return {quantity:.01,unit:'kg'};
 if(name==='Tamarind')return {quantity:.05,unit:'kg'};
 if(name==='Jaggery')return {quantity:type==='Snack'?.15:.03,unit:'kg'};
 if(name==='Yeast')return {quantity:.005,unit:'kg'};
 if(['Peanuts','Sesame seeds','Poppy seeds'].includes(name))return {quantity:.1,unit:'kg'};
 if(pulses.has(name))return {quantity:base?(type==='Snack'?.5:.3):.2,unit:'kg'};
 if(flours.has(name))return {quantity:base?(type==='Snack'?.5:.25):.2,unit:'kg'};
 if(grains.has(name))return {quantity:base?.5:.2,unit:'kg'};
 if(name==='Onion (big)')return {quantity:.2,unit:'kg'};
 return {quantity:base?1:.3,unit:'kg'};
}
export function estimateDish(dish,getQuote){
 const names=[...new Set([...dish.ingredients,...(dish.noOil||dish.ingredients.includes('Mustard oil')?[]:['Cooking oil (unspecified)']),...(dish.noSalt?[]:['Salt'])])];
 const ingredients=names.map(name=>{const amount=dish.quantities?.[name]||sampleQuantity(name,dish.type,name===dish.base);const quote=getQuote(name,amount.unit);return {name,...amount,quote,cost:quote?quote.price*amount.quantity:null};});
 const missing=ingredients.filter(i=>i.cost===null).length;
 const subtotal=ingredients.reduce((sum,i)=>sum+(i.cost??0),0);
 return {ingredients,missing,subtotal,perPortion:subtotal/10,portions:10,basePriced:ingredients.some(i=>i.name===dish.base&&i.cost!==null)};
}
