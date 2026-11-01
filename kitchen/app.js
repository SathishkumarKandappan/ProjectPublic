import {defaults} from './seed.js';
import {supplierSeed} from './supplier-seed.js';
import {pdfRates} from './pdf-rates.js';
import {retailerPrices,retailerQuote} from './retailers.js';
import {todayIST,marketAsOf,comparePrices} from './model.js';
import {dailyIdeas} from './dishes.js';
import {estimateDish} from './costing.js';
import {buildMealPackages} from './packages.js';
const $=selector=>document.querySelector(selector);
const money=n=>n==null?'—':new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',minimumFractionDigits:0,maximumFractionDigits:2}).format(n);
const dateLabel=date=>new Date(date+'T12:00:00Z').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
let selectedDate=todayIST(),dishType='Curry',requestId=0;
let records=defaults.filter(x=>x.price!==null).map(x=>({...x,source:x.source||'Reference snapshot'}));
let saved={items:[],quotes:[]};try{saved=JSON.parse(localStorage.getItem('kitchen-ledger-v2'))||saved;}catch{}
const supplierQuotes=[...supplierSeed,...pdfRates];
const localQuotes=(saved.quotes||[]).filter(q=>Number.isFinite(q.price)&&q.price>=0&&q.date);
const catalog=new Map(defaults.map(x=>[x.name,{name:x.name,unit:x.unit}]));
for(const q of supplierQuotes)if(!catalog.has(q.name))catalog.set(q.name,{name:q.name,unit:q.unit});
for(const q of retailerPrices)if(!catalog.has(q.name))catalog.set(q.name,{name:q.name,unit:q.unit});
for(const x of saved.items||[])if(!catalog.has(x.name)&&x.name&&x.unit)catalog.set(x.name,{name:x.name,unit:x.unit});
function supplierFor(name,unit){const dated=localQuotes.filter(q=>q.name===name&&q.unit===unit&&q.date<=selectedDate).sort((a,b)=>a.date.localeCompare(b.date)).at(-1);return dated?{...dated,effectiveDate:dated.date}:supplierQuotes.find(q=>q.name===name&&q.unit===unit)||supplierQuotes.find(q=>q.name===name)||null;}
function quoteForDish(name,unit){const market=marketAsOf(records,name,unit,selectedDate),supplier=supplierFor(name,unit),choices=[];if(market)choices.push({...market,unit});if(supplier?.unit===unit&&(supplier.effectiveDate||selectedDate===todayIST()))choices.push({...supplier,unit});for(const retailer of ['Blinkit','BigBasket','Instamart']){const r=retailerQuote(retailer,name,unit,selectedDate);if(r)choices.push({...r,date:r.observed});}return choices.sort((a,b)=>a.price-b.price)[0]||null;}
function priceCell(quote,unit,tone,date){const cell=document.createElement('td'),price=document.createElement('b');price.textContent=money(quote?.price);price.className=tone||'neutral';cell.append(price);if(quote){const suffix=document.createElement('span');suffix.className='unit';suffix.textContent=' / '+unit;const stamp=document.createElement('small');stamp.textContent=date;cell.append(suffix,stamp);cell.title=quote.source||'';}return cell;}
function retailerCell(quote,tone){if(!quote)return priceCell(null,'kg','neutral','');const cell=priceCell(quote,quote.unit,tone,'Listed '+dateLabel(quote.observed));const value=cell.querySelector('b');const link=document.createElement('a');link.href=quote.url;link.target='_blank';link.rel='noopener';link.title=`${quote.product} · ${quote.pack} for ${money(quote.packQuantity)} · public listed reference`;value.replaceWith(link);link.append(value);return cell;}
function renderPrices(){$('#priceRows').replaceChildren(...[...catalog.values()].map(item=>{
 const market=marketAsOf(records,item.name,item.unit,selectedDate),supplier=supplierFor(item.name,item.unit),retailers=['Blinkit','BigBasket','Instamart'].map(r=>retailerQuote(r,item.name,item.unit,selectedDate));
 const quotes=[market,supplier,...retailers],comparable=quotes.filter(q=>q&&q.unit===item.unit).map(q=>q.price),low=Math.min(...comparable),high=Math.max(...comparable);
 const tone=q=>q&&q.unit===item.unit&&low!==high?(q.price===low?'cheap':q.price===high?'expensive':'neutral'):'neutral';
 const row=document.createElement('tr'),name=document.createElement('td');name.textContent=item.name;
 const supplierDate=supplier?.effectiveDate?dateLabel(supplier.effectiveDate):supplier?.basis==='Budget-derived reference'?`PDF budget · p. ${supplier.page} · undated`:'Undated';
 row.append(name,priceCell(market,item.unit,tone(market),market?dateLabel(market.date):''),priceCell(supplier,supplier?.unit,tone(supplier),supplierDate),...retailers.map(q=>retailerCell(q,tone(q))));return row;
}));}
function renderDishes(){
 const featured=dailyIdeas(quoteForDish,{date:selectedDate,type:dishType});
 const all=dailyIdeas(quoteForDish,{date:selectedDate,type:dishType,all:true});
 const ordered=[...featured,...all.filter(d=>!featured.some(f=>f.id===d.id))];
 $('#dishList').replaceChildren(...ordered.map(d=>{
   const estimate=estimateDish(d,quoteForDish),card=document.createElement('details');card.className='dish';
   const summary=document.createElement('summary');
   const identity=document.createElement('div');identity.className='dish-identity';const state=document.createElement('small');state.className='dish-state';state.textContent=d.state;const name=document.createElement('span');name.className='dish-name';name.textContent=d.name;identity.append(state,name);
   const cost=document.createElement('div');cost.className='dish-cost';const price=document.createElement('strong');price.textContent=!estimate.basePriced?'Price needed':(estimate.missing?'From ':'Est. ')+money(estimate.perPortion);const label=document.createElement('small');label.textContent=!estimate.basePriced?'main ingredient unpriced':estimate.missing?`/ portion · ${estimate.missing} quote(s) needed`:'/ portion · ingredient estimate';cost.append(price,label);summary.append(identity,cost);
   const content=document.createElement('div');content.className='dish-content';const description=document.createElement('p');description.className='dish-description';description.textContent=d.description;
   const title=document.createElement('div');title.className='ingredient-heading';title.textContent='SAMPLE INGREDIENTS · 10 PORTIONS';const list=document.createElement('div');list.className='ingredient-list';
   for(const i of estimate.ingredients){const row=document.createElement('div');row.className='ingredient-row';const ingredient=document.createElement('div');const ingredientName=document.createElement('span');ingredientName.textContent=i.name;const quantity=document.createElement('small');quantity.textContent=`${Number(i.quantity.toFixed(3))} ${i.unit}`;ingredient.append(ingredientName,quantity);
     const rate=document.createElement('div');rate.className='ingredient-rate';const amount=document.createElement('span');amount.textContent=i.quote?`${money(i.quote.price)}/${i.unit}`:'Quote needed';const source=document.createElement('small');source.textContent=i.quote?`${i.quote.source||'Price reference'} · ${i.quote.date?dateLabel(i.quote.date):i.quote.effectiveDate?dateLabel(i.quote.effectiveDate):'undated'}`:'Not included in subtotal';rate.append(amount,source);
     const total=document.createElement('span');total.className='ingredient-cost';total.textContent=money(i.cost);row.append(ingredient,rate,total);list.append(row);}
   const subtotal=document.createElement('div');subtotal.className='dish-subtotal';const subtotalLabel=document.createElement('span');subtotalLabel.textContent=estimate.missing?'Priced ingredients subtotal':'Sample ingredient subtotal';const subtotalAmount=document.createElement('strong');subtotalAmount.textContent=money(estimate.subtotal);subtotal.append(subtotalLabel,subtotalAmount);
   const note=document.createElement('p');note.className='cost-note';note.textContent='Illustrative quantities for 10 portions; adjust for recipe yield and student ages. Additional spices, toppings, fuel, labour and wastage are excluded.'+(estimate.missing?' Missing prices are excluded; this is a partial estimate.':'');
   content.append(description,title,list,subtotal,note);card.append(summary,content);return card;
 }));
}
function renderMealPackages(){
 $('#mealList').replaceChildren(...buildMealPackages(quoteForDish,selectedDate).map((pack,index)=>{
  const card=document.createElement('article');card.className='dish meal-card';const summary=document.createElement('div');summary.className='meal-card-head';
  const identity=document.createElement('div');identity.className='dish-identity';const label=document.createElement('small');label.className='dish-state';label.textContent='MORNING · LUNCH · EVENING';const name=document.createElement('span');name.className='dish-name';name.textContent='Meal package '+(index+1);identity.append(label,name);
  const cost=document.createElement('div');cost.className='dish-cost';const price=document.createElement('strong');price.textContent=!pack.basePriced?'Price needed':(pack.missing?'From ':'Est. ')+money(pack.perPortion);const perPerson=document.createElement('small');perPerson.textContent='/ person'+(pack.missing?' · partial estimate':'');cost.append(price,perPerson);summary.append(identity,cost);
  const content=document.createElement('div');content.className='dish-content';
  const menu=document.createElement('div');menu.className='meal-menu';
  const slots=[{name:'Morning snack',items:[pack.components[0]]},{name:'Lunch',items:pack.components.slice(1,4)},{name:'Evening snack',items:[pack.components[4]]}];
  for(const slot of slots){const row=document.createElement('div');row.className='meal-slot';const label=document.createElement('small');label.textContent=slot.name;const names=document.createElement('p');names.textContent=slot.items.map(i=>i.dish.name).join(' + ');const price=document.createElement('span');const complete=slot.items.every(i=>i.estimate.basePriced),partial=slot.items.some(i=>i.estimate.missing);price.textContent=complete?(partial?'From ':'')+money(slot.items.reduce((sum,i)=>sum+i.estimate.perPortion,0))+' / person':'Price needed';row.append(label,names,price);menu.append(row);}
  const detail=document.createElement('details');detail.className='package-ingredients';const triangle=document.createElement('summary');triangle.textContent='Ingredients for 10 people';const list=document.createElement('div');
  for(const ingredient of pack.ingredients){const row=document.createElement('div');row.className='ingredient-row';const name=document.createElement('div');name.textContent=ingredient.name;const qty=document.createElement('small');qty.textContent=Number(ingredient.quantity.toFixed(3))+' '+ingredient.unit;name.append(qty);const rate=document.createElement('div');rate.className='ingredient-rate';rate.textContent=ingredient.quote?money(ingredient.quote.price)+'/'+ingredient.unit:'Quote needed';const source=document.createElement('small');source.textContent=ingredient.quote?ingredient.quote.source||'Reference price':'Excluded from subtotal';rate.append(source);const value=document.createElement('span');value.className='ingredient-cost';value.textContent=money(ingredient.cost);row.append(name,rate,value);list.append(row);}
  detail.append(triangle,list);const note=document.createElement('p');note.className='cost-note';note.textContent='Illustrative portions: lunch uses 75 g dry red rice per person. Adjust quantities for students and recipe yield. Prices cover listed ingredients only; additional spices, fuel, labour and wastage are excluded.'+(pack.missing?' '+pack.missing+' ingredient price(s) are missing.':'');detail.append(note);content.append(menu,detail);card.append(summary,content);return card;
 }));
}
function render(){renderPrices();renderDishes();if(!$('#mealList').hidden)renderMealPackages();}
async function refreshPrices(){const request=++requestId;$('#priceDate').setAttribute('aria-busy','true');try{const response=await fetch('https://raw.githubusercontent.com/SathishkumarKandappan/ProjectPublic/gh-pages/kitchen/market.json?t='+Date.now(),{cache:'no-store'});if(!response.ok)throw Error('Feed unavailable');const feed=await response.json();if(!Array.isArray(feed.records))throw Error('Invalid feed');if(request!==requestId)return;records=feed.records.filter(r=>typeof r.name==='string'&&typeof r.unit==='string'&&Number.isFinite(r.price)&&r.price>=0&&/^\d{4}-\d{2}-\d{2}$/.test(r.date)&&r.date<=todayIST());for(const r of records)if(!catalog.has(r.name))catalog.set(r.name,{name:r.name,unit:r.unit});$('#error').hidden=true;}catch{if(request!==requestId)return;$('#error').textContent='Could not refresh. Showing saved prices with their recorded dates.';$('#error').hidden=false;}finally{if(request===requestId){$('#priceDate').removeAttribute('aria-busy');render();}}}
$('#priceDate').max=todayIST();$('#priceDate').value=selectedDate;$('#priceDate').addEventListener('change',()=>{const input=$('#priceDate');if(!input.value||!input.validity.valid){input.reportValidity();return;}selectedDate=input.value;render();refreshPrices();});
const tabs=[...document.querySelectorAll('[data-type]')];
function selectTab(button){const type=button.dataset.type,isPrice=type==='Price',isMeal=type==='Meal';if(!isPrice&&!isMeal)dishType=type;$('#pricePanel').hidden=!isPrice;$('#dishList').hidden=isPrice||isMeal;$('#mealList').hidden=!isMeal;for(const tab of tabs){const active=tab===button;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;}if(isMeal)renderMealPackages();else if(!isPrice){$('#dishList').setAttribute('aria-labelledby',button.id);renderDishes();}}
for(const button of tabs){button.addEventListener('click',()=>selectTab(button));button.addEventListener('keydown',event=>{const index=tabs.indexOf(button);let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();tabs[next].focus();selectTab(tabs[next]);});}
render();refreshPrices();
