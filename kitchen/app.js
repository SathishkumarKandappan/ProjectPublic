import {defaults} from './seed.js';
import {supplierSeed} from './supplier-seed.js';
import {pdfRates} from './pdf-rates.js';
import {retailerPrices,retailerQuote,otherQuote} from './retailers.js?v=23';
import {todayIST,marketAsOf,comparePrices} from './model.js';
import {dailyIdeas} from './dishes.js';
import {estimateDish} from './costing.js';
import {buildMealPackages} from './packages.js?v=23';
const $=selector=>document.querySelector(selector);
const money=n=>n==null?'—':new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',minimumFractionDigits:0,maximumFractionDigits:2}).format(n);
const quoteDate=q=>q?.date||q?.observed||q?.effectiveDate||null;
const isSelectedDate=q=>quoteDate(q)===selectedDate;
const dateLabel=date=>new Date(date+'T12:00:00Z').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
let selectedDate=todayIST(),dishType='Curry',requestId=0;
let records=defaults.filter(x=>x.price!==null).map(x=>({...x,source:x.source||'Reference snapshot'}));
let saved={items:[],quotes:[]};try{saved=JSON.parse(localStorage.getItem('kitchen-ledger-v2'))||saved;}catch{}
let supplierQuotes=[...supplierSeed,...pdfRates];
let refreshController;
const localQuotes=(saved.quotes||[]).filter(q=>Number.isFinite(q.price)&&q.price>=0&&q.date);
const catalog=new Map(defaults.map(x=>[x.name,{name:x.name,unit:x.unit}]));
for(const q of supplierQuotes)if(!catalog.has(q.name))catalog.set(q.name,{name:q.name,unit:q.unit});
for(const q of retailerPrices)if(!catalog.has(q.name))catalog.set(q.name,{name:q.name,unit:q.unit});
for(const x of saved.items||[])if(!catalog.has(x.name)&&x.name&&x.unit)catalog.set(x.name,{name:x.name,unit:x.unit});
function supplierFor(name,unit){const dated=localQuotes.filter(q=>q.name===name&&q.unit===unit&&q.date<=selectedDate).sort((a,b)=>a.date.localeCompare(b.date)).at(-1);return dated?{...dated,effectiveDate:dated.date}:supplierQuotes.find(q=>q.name===name&&q.unit===unit)||supplierQuotes.find(q=>q.name===name)||null;}
function quoteForDish(name,unit){if(name==='Curd'&&unit==='litre'&&new Date(selectedDate+'T12:00:00Z').getUTCDay()!==1){const milk=quoteForDish('Milk','litre');return milk?{...milk,source:(milk.source||'Milk price')+' · Nandini milk set as curd (estimated 1:1 yield)'}:null;}const market=marketAsOf(records,name,unit,selectedDate),supplier=supplierFor(name,unit),choices=[];if(market&&isSelectedDate(market)&&!/wholesale/i.test(market.basis||''))choices.push({...market,unit});if(supplier?.unit===unit&&(supplier.effectiveDate||selectedDate===todayIST()))choices.push({...supplier,unit});for(const retailer of ['Blinkit','BigBasket','Instamart']){const r=retailerQuote(retailer,name,unit,selectedDate);if(r&&isSelectedDate(r))choices.push({...r,date:r.observed});}const extra=otherQuote(name,unit,selectedDate);if(extra&&isSelectedDate(extra))choices.push({...extra,date:extra.observed});return choices.sort((a,b)=>a.price-b.price)[0]||null;}
function priceCell(quote,unit,tone,date,ongoingSupplier=false){const cell=document.createElement('td'),price=document.createElement('b');price.textContent=quote?money(quote.price):'No dated quote';price.className=tone||'neutral';cell.append(price);if(quote){const suffix=document.createElement('span');suffix.className='unit';suffix.textContent=' / '+unit;const stamp=document.createElement('small');stamp.textContent=date;cell.append(suffix,stamp);cell.title=quote.source||'';if(!ongoingSupplier&&quoteDate(quote)&&!isSelectedDate(quote)){cell.classList.add('stale-price');const badge=document.createElement('small');badge.className='reference-label';badge.textContent='Not verified for '+dateLabel(selectedDate)+' · last recorded '+dateLabel(quoteDate(quote));cell.prepend(badge);price.className='neutral';}}return cell;}
function retailerCell(quote,tone,requested){if(!quote)return priceCell(null,'kg','neutral','');const cell=priceCell(quote,quote.unit,tone,(quote.manualCheckedAt?'Manual reference checked ':quote.basis==='Search-indexed reference'?'Search reference checked ':'Listed ')+dateLabel(quote.observed));const value=cell.querySelector('b');const link=document.createElement('a');link.href=quote.url;link.target='_blank';link.rel='noopener';link.title=`${quote.product} · ${quote.pack} for ${money(quote.packQuantity)} · public listed reference`;value.replaceWith(link);link.append(value);const product=document.createElement('small');product.textContent=quote.retailer+' · '+quote.product+(quote.location?' · '+quote.location:'');cell.append(product);if(quote.manualCheckedAt){const note=document.createElement('small');note.textContent='Price-effective date not supplied';cell.append(note);}if(requested&&quote.retailer!==requested){const reference=document.createElement('small');reference.className='reference-label';reference.textContent=requested+' quote not verified · '+quote.retailer+' reference';cell.prepend(reference);}return cell;}
function renderPrices(){$('#priceRows').replaceChildren(...[...catalog.values()].map(item=>{
 const marketRecord=marketAsOf(records,item.name,item.unit,selectedDate),reference=otherQuote(item.name,item.unit,selectedDate)||otherQuote(item.name,null,selectedDate),market=marketRecord||reference,supplier=supplierFor(item.name,item.unit),retailers=['Blinkit','BigBasket','Instamart'].map(r=>retailerQuote(r,item.name,item.unit,selectedDate)||retailerQuote(r,item.name,null,selectedDate)||reference);
 const quotes=[market,supplier,...retailers],comparable=quotes.filter(q=>q&&q.unit===item.unit&&(q===supplier||!quoteDate(q)||isSelectedDate(q))).map(q=>q.price),low=Math.min(...comparable),high=Math.max(...comparable);
 const tone=q=>q&&q.unit===item.unit&&(q===supplier||!quoteDate(q)||isSelectedDate(q))&&low!==high?(q.price===low?'cheap':q.price===high?'expensive':'neutral'):'neutral';
 const row=document.createElement('tr'),name=document.createElement('td');name.textContent=item.name;if(['Milk','Curd'].includes(item.name)){const brand=document.createElement('small');brand.textContent='Nandini only';name.append(brand);}
 const supplierDate=supplier?.effectiveDate?dateLabel(supplier.effectiveDate):supplier?.basis==='Budget-derived reference'?`PDF budget · p. ${supplier.page} · undated`:'Undated';
 const marketCell=priceCell(market,market?.unit||item.unit,tone(market),marketRecord?(/wholesale/i.test(marketRecord.basis||'')?'Govt wholesale · '+(marketRecord.market||'')+' · ':'')+dateLabel(marketRecord.date):reference?'Online reference · '+reference.retailer+' · '+dateLabel(reference.observed):'');
 const govt=marketAsOf(records.filter(q=>/wholesale/i.test(q.basis||'')),item.name,item.unit,selectedDate);
 if(govt&&govt!==marketRecord){const detail=document.createElement('small');const link=document.createElement('a');link.href=govt.url;link.target='_blank';link.rel='noopener';link.textContent='Govt wholesale '+money(govt.price)+'/'+govt.unit+' · '+govt.market+' · '+dateLabel(govt.date);detail.append(link);marketCell.append(detail);}
 const supplierCell=priceCell(supplier,supplier?.unit,tone(supplier),supplierDate,true);if(!supplier)supplierCell.querySelector('b').textContent='Not in supplier list';
 row.append(name,marketCell,supplierCell,...retailers.map((q,i)=>retailerCell(q,tone(q),['Blinkit','BigBasket','Instamart'][i])),retailerCell(reference,null));return row;
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
  const cost=document.createElement('div');cost.className='dish-cost';const price=document.createElement('strong');price.textContent=!pack.basePriced?'Price needed':(pack.missing?'From ':'Est. ')+money(pack.perPortion);const perPerson=document.createElement('small');perPerson.textContent='/ person · '+money(pack.totalForGroup)+' / 200'+(pack.missing?' · incomplete':pack.withinBudget?' · within ₹1,900':' · over ₹1,900');price.className=pack.missing?'neutral':pack.withinBudget?'cheap':'expensive';cost.append(price,perPerson);summary.append(identity,cost);
  const content=document.createElement('div');content.className='dish-content';
  const menu=document.createElement('div');menu.className='meal-menu';
  const slots=[{name:'Morning snack',items:[pack.components[0]]},{name:'Lunch',items:pack.components.slice(1,5)},{name:'Evening snack',items:[pack.components[5]]}];
  for(const slot of slots){const row=document.createElement('div');row.className='meal-slot';const label=document.createElement('small');label.textContent=slot.name;const names=document.createElement('p');names.textContent=slot.items.map(i=>i.dish.name+(i.dish.state?' ('+i.dish.state+')':'')).join(' + ');const price=document.createElement('span');const complete=slot.items.every(i=>i.estimate.basePriced),partial=slot.items.some(i=>i.estimate.missing);price.textContent=complete?(partial?'From ':'')+money(slot.items.reduce((sum,i)=>sum+i.estimate.perPortion,0))+' / person':'Price needed';row.append(label,names,price);menu.append(row);}
  const detail=document.createElement('details');detail.className='package-ingredients';const triangle=document.createElement('summary');triangle.textContent='Ingredients for 10 people';const list=document.createElement('div');
  for(const ingredient of pack.ingredients){const row=document.createElement('div');row.className='ingredient-row';const name=document.createElement('div');name.textContent=ingredient.name;const qty=document.createElement('small');qty.textContent=Number(ingredient.quantity.toFixed(3))+' '+ingredient.unit;name.append(qty);const rate=document.createElement('div');rate.className='ingredient-rate';rate.textContent=ingredient.quote?money(ingredient.quote.price)+'/'+ingredient.unit:'Quote needed';const source=document.createElement('small');source.textContent=ingredient.quote?(ingredient.quote.source||'Reference price')+' · '+(ingredient.quote.date?dateLabel(ingredient.quote.date):ingredient.quote.effectiveDate?dateLabel(ingredient.quote.effectiveDate):'undated'):'Excluded from subtotal';rate.append(source);const value=document.createElement('span');value.className='ingredient-cost';value.textContent=money(ingredient.cost);row.append(name,rate,value);list.append(row);}
  detail.append(triangle,list);const note=document.createElement('p');note.className='cost-note';note.textContent='Illustrative portions: lunch uses 40 g dry red rice per person (PDF planning reference). Budget ₹1,900 for 200 people (₹9.50 each). Daily homemade buttermilk is included: estimated 2 × 100 ml glasses per person (40 L for 200), 1 part curd to 3 parts water. Monday uses purchased Nandini curd; other days use Nandini milk to set curd, assuming 1 L milk yields 1 L curd. Actual glass size, dilution and yield may differ. Small snack and side portions are shown below. Adjust quantities for students and recipe yield. Prices cover listed ingredients only; additional spices, fuel, labour and wastage are excluded.'+(pack.missing?' '+pack.missing+' ingredient price(s) are missing.':'');detail.append(note);content.append(menu,detail);card.append(summary,content);return card;
 }));
}
function render(){renderPrices();renderDishes();if(!$('#mealList').hidden)renderMealPackages();}
async function refreshPrices(){
 const request=++requestId,date=selectedDate;
 refreshController?.abort();const controller=new AbortController();refreshController=controller;
 const status=$('#refreshStatus');status.textContent='Refreshing prices…';
 $('#priceDate').setAttribute('aria-busy','true');
 const timeout=setTimeout(()=>controller.abort(),20000);
 const root='https://raw.githubusercontent.com/SathishkumarKandappan/ProjectPublic/gh-pages/kitchen/';
 const validQuote=r=>r&&typeof r.name==='string'&&typeof r.unit==='string'&&Number.isFinite(r.price)&&r.price>=0;
 const validDate=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d+'T12:00:00Z'))&&d<=todayIST();
 const read=async(file,field,validate)=>{
  const response=await fetch(root+file+'?date='+encodeURIComponent(date)+'&t='+Date.now(),{cache:'no-store',signal:controller.signal});
  if(!response.ok)throw Error('Feed unavailable');const feed=await response.json();
  if(!Array.isArray(feed[field])||!feed[field].length||!feed[field].every(validate))throw Error('Invalid price feed');
  return feed[field];
 };
 try{
  const results=await Promise.allSettled([
   read('market.json','records',r=>validQuote(r)&&validDate(r.date)),
   read('supplier.json','quotes',r=>validQuote(r)&&(!r.effectiveDate||validDate(r.effectiveDate))),
   read('retailer-prices.json','quotes',r=>validQuote(r)&&validDate(r.observed)&&typeof r.retailer==='string'&&typeof r.url==='string'&&r.url.startsWith('https://')),
   fetch(root+'update-status.json?t='+Date.now(),{cache:'no-store',signal:controller.signal}).then(async response=>{if(!response.ok)throw Error('Status unavailable');return response.json();})
  ]);
  if(request!==requestId)return;
  if(results[0].status==='fulfilled')records=results[0].value;
  if(results[1].status==='fulfilled')supplierQuotes=results[1].value;
  if(results[2].status==='fulfilled')retailerPrices.splice(0,retailerPrices.length,...results[2].value);
  for(const q of [...records,...supplierQuotes,...retailerPrices])if(!catalog.has(q.name))catalog.set(q.name,{name:q.name,unit:q.unit});
  const failed=results.slice(0,3).map((r,i)=>r.status==='rejected'?['Market','Supplier','Online'][i]:null).filter(Boolean);
  $('#error').hidden=!failed.length;
  $('#error').textContent=failed.length?failed.join(', ')+' refresh failed. Keeping previously loaded prices for these sources.':'';
  const time=new Date().toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit'});
  status.textContent=(failed.length===3?'Refresh failed':failed.length?'Partly refreshed':'Prices reloaded')+' · '+time+' IST · quote dates shown below';
  clearTimeout(timeout);
  const update=results[3].status==='fulfilled'?results[3].value:null;
  const lastCheck=[update?.checkedAt,update?.extraSources?.checkedAt].filter(d=>d&&!Number.isNaN(Date.parse(d))).sort().at(-1);
  const checked=lastCheck?new Date(lastCheck).toLocaleString('en-IN',{timeZone:'Asia/Kolkata',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})+' IST':null;
  const datedMarket=new Set(records.filter(q=>q.date===date).map(q=>q.name)).size;
  const datedOnline=new Set(retailerPrices.filter(q=>q.observed===date).map(q=>q.name)).size;
  status.textContent=(failed.length?'Some sources could not reload · ':checked?'Checked '+checked+' · ':'')+dateLabel(date)+': '+datedMarket+' market items, '+datedOnline+' online items dated this day. Older prices are labelled as references.';
 }finally{
  clearTimeout(timeout);
  if(request===requestId){$('#priceDate').removeAttribute('aria-busy');render();}
 }
}
$('#priceDate').max=todayIST();$('#priceDate').value=selectedDate;$('#priceDate').addEventListener('change',()=>{const input=$('#priceDate');if(!input.value||!input.validity.valid){input.reportValidity();return;}selectedDate=input.value;render();refreshPrices();});
const tabs=[...document.querySelectorAll('[data-type]')];
function selectTab(button){const type=button.dataset.type,isPrice=type==='Price',isMeal=type==='Meal';if(!isPrice&&!isMeal)dishType=type;$('#pricePanel').hidden=!isPrice;$('#dishList').hidden=isPrice||isMeal;$('#mealList').hidden=!isMeal;for(const tab of tabs){const active=tab===button;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;}if(isMeal)renderMealPackages();else if(!isPrice){$('#dishList').setAttribute('aria-labelledby',button.id);renderDishes();}}
for(const button of tabs){button.addEventListener('click',()=>selectTab(button));button.addEventListener('keydown',event=>{const index=tabs.indexOf(button);let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();tabs[next].focus();selectTab(tabs[next]);});}
render();refreshPrices();
