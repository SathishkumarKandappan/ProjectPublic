import {defaults} from './seed.js';
import {supplierSeed} from './supplier-seed.js';
import {todayIST,dayDiff,marketAsOf,comparePrices} from './model.js';
import {dishes,dailyIdeas} from './dishes.js';
const $=selector=>document.querySelector(selector);
const money=n=>n==null?'—':new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',minimumFractionDigits:0,maximumFractionDigits:2}).format(n);
const dateLabel=date=>new Date(date+'T12:00:00Z').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
let selectedDate=todayIST(),view='prices',dishType='Curry',showAll=false,requestId=0;
let records=defaults.filter(x=>x.price!==null).map(x=>({...x,source:x.source||'Reference snapshot'}));
let cachedPlan={items:[],quotes:[]};
try{cachedPlan=JSON.parse(localStorage.getItem('kitchen-ledger-v2'))||cachedPlan;}catch{}
const localQuotes=(cachedPlan.quotes||[]).filter(q=>Number.isFinite(q.price)&&q.price>=0&&q.date);
const catalog=new Map(defaults.map(x=>[x.name,{name:x.name,unit:x.unit,cat:x.cat}]));
for(const q of supplierSeed)if(!catalog.has(q.name))catalog.set(q.name,{name:q.name,unit:q.unit,cat:['Lemon','Coconut'].includes(q.name)?'Vegetables':q.name.includes('rice')?'Rice':'Rations'});
for(const x of cachedPlan.items||[])if(!catalog.has(x.name)&&x.name&&x.unit)catalog.set(x.name,{name:x.name,unit:x.unit,cat:x.cat||'Rations'});
function supplierFor(name,unit){
 const dated=localQuotes.filter(q=>q.name===name&&q.unit===unit&&q.date<=selectedDate).sort((a,b)=>a.date.localeCompare(b.date)).at(-1);
 return dated?{...dated,effectiveDate:dated.date}:supplierSeed.find(q=>q.name===name)||null;
}
function quoteForDish(name,unit){
 const market=marketAsOf(records,name,unit,selectedDate),supplier=supplierFor(name,unit),choices=[];
 if(market)choices.push({...market,unit,kind:'Market'});
 if(supplier?.unit===unit&&(supplier.effectiveDate||selectedDate===todayIST()))choices.push({...supplier,unit,date:supplier.effectiveDate||null,kind:'Supplier'});
 return choices.sort((a,b)=>a.price-b.price)[0]||null;
}
function renderPrices(){
 const category=$('#category').value,query=$('#priceSearch').value.trim().toLowerCase();let cheaper=0,higher=0;
 const all=[...catalog.values()];
 for(const item of all){const c=comparePrices(marketAsOf(records,item.name,item.unit,selectedDate),supplierFor(item.name,item.unit),item.unit);if(c.comparable&&c.delta<0)cheaper++;if(c.comparable&&c.delta>0)higher++;}
 $('#comparisonSummary').textContent=`As of ${dateLabel(selectedDate)} · ${cheaper} supplier prices lower · ${higher} higher`;
 const shown=all.filter(x=>(category==='All'||x.cat===category)&&x.name.toLowerCase().includes(query));
 $('#priceRows').replaceChildren(...shown.map(item=>{
   const market=marketAsOf(records,item.name,item.unit,selectedDate),supplier=supplierFor(item.name,item.unit),comparison=comparePrices(market,supplier,item.unit);
   const row=document.createElement('tr'),name=document.createElement('td');name.textContent=item.name;const category=document.createElement('small');category.textContent=item.cat;name.append(category);
   const supplierCell=priceCell(supplier?.price,supplier?.unit,comparison.supplierTone,supplier?(supplier.effectiveDate?dateLabel(supplier.effectiveDate):'Undated supplier list'):'Quote needed');
   const marketCell=priceCell(market?.price,item.unit,comparison.marketTone,market?dateLabel(market.date)+(dayDiff(selectedDate,market.date)>0?' · last recorded':''):'No record by this date');
   if(market){marketCell.title=`${market.source} · ${market.basis||'reference price'}`;}
   const difference=document.createElement('td');difference.className=comparison.supplierTone||'neutral';
   difference.textContent=comparison.comparable?(comparison.delta>0?'+':'')+money(comparison.delta):comparison.reason;
   if(comparison.comparable){const percent=document.createElement('small');percent.textContent=comparison.percent==null?'No percentage comparison':`${comparison.percent>0?'+':''}${comparison.percent.toFixed(1)}%`;difference.append(percent);}
   row.append(name,supplierCell,marketCell,difference);return row;
 }));$('#priceEmpty').hidden=shown.length>0;
}
function priceCell(price,unit,tone,note){const cell=document.createElement('td'),value=document.createElement('b');value.textContent=money(price);value.className=tone||'neutral';cell.append(value);if(price!=null){const suffix=document.createElement('span');suffix.className='price-unit';suffix.textContent=' / '+unit;cell.append(suffix)}const caption=document.createElement('small');caption.textContent=note;cell.append(caption);return cell;}
function renderDishes(){
 const state=$('#stateFilter').value,query=$('#dishSearch').value.trim();
 const matches=dishes.filter(d=>d.type===dishType&&(!state||d.state===state)&&(!query||[d.name,d.state,...d.ingredients].join(' ').toLowerCase().includes(query.toLowerCase())));
 const ideas=dailyIdeas(quoteForDish,{date:selectedDate,type:dishType,state,query,all:showAll});
 $('#ideaContext').textContent=`${showAll?'Browse the collection':'A fresh selection'} · ${dateLabel(selectedDate)}`;
 $('#dishCards').replaceChildren(...ideas.map(d=>{
   const card=document.createElement('article');card.className='dish-card';
   const state=document.createElement('span');state.className='dish-state';state.textContent=d.state;
   const title=document.createElement('h3');title.textContent=d.name;const description=document.createElement('p');description.textContent=d.description;
   const price=document.createElement('div');price.className='dish-price';price.textContent=d.quote?`${d.base} · ${money(d.quote.price)}/${d.quote.unit}`:`${d.base} · quote needed`;
   const evidence=document.createElement('small');evidence.textContent=d.quote?`${d.quote.kind} · ${d.quote.date?dateLabel(d.quote.date):'undated quote'}`:'Main ingredient price unavailable; not ranked as cheap';price.append(evidence);
   const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent='Main ingredients';const list=document.createElement('div');list.textContent=d.ingredients.join(' · ');details.append(summary,list);
   card.append(state,title,description,price,details);return card;
 }));$('#dishEmpty').hidden=ideas.length>0;
 $('#dishCount').textContent=`${ideas.length} of ${matches.length} ${dishType==='Snack'?'snack':dishType.toLowerCase()} ideas${!showAll&&matches.length>8?' · date-based picks':''}`;
 $('#browseAll').hidden=matches.length<=8;
 $('#browseAll').textContent=showAll?'Back to date-based picks':`Browse all ${matches.length} dishes`;
}
function render(){renderPrices();renderDishes();}
async function refreshPrices(){
 const currentRequest=++requestId;$('#refresh').disabled=true;$('#refresh').textContent='Refreshing…';$('#status').textContent=`Refreshing prices as of ${dateLabel(selectedDate)}…`;
 try{
   const response=await fetch('https://raw.githubusercontent.com/SathishkumarKandappan/ProjectPublic/gh-pages/kitchen/market.json?t='+Date.now(),{cache:'no-store'});
   if(!response.ok)throw Error('Feed unavailable');const feed=await response.json();if(!Array.isArray(feed.records))throw Error('Invalid feed');
   if(currentRequest!==requestId)return;
   records=feed.records.filter(r=>typeof r.name==='string'&&typeof r.unit==='string'&&Number.isFinite(r.price)&&r.price>=0&&/^\d{4}-\d{2}-\d{2}$/.test(r.date)&&r.date<=todayIST());
   for(const r of records)if(!catalog.has(r.name))catalog.set(r.name,{name:r.name,unit:r.unit,cat:'Rations'});
   const checked=feed.checkedAt?new Date(feed.checkedAt).toLocaleDateString('en-IN',{timeZone:'Asia/Kolkata',day:'numeric',month:'short',year:'numeric'}):'unknown';
   $('#status').textContent=`Showing records on or before ${dateLabel(selectedDate)}. Feed checked ${checked}; actual price dates are shown below.${feed.errors?.length?' Some source updates were unavailable.':''}`;
 }catch{if(currentRequest!==requestId)return;$('#status').textContent=`Could not reload the feed. Showing available reference records as of ${dateLabel(selectedDate)}; check each price date.`;}
 finally{if(currentRequest===requestId){$('#refresh').disabled=false;$('#refresh').textContent='↻ Refresh prices';render();}}
}
$('#priceDate').max=todayIST();$('#priceDate').value=selectedDate;
$('#priceDate').addEventListener('change',()=>{const input=$('#priceDate');if(!input.value||!input.validity.valid){input.reportValidity();return;}selectedDate=input.value;showAll=false;render();refreshPrices();});
$('#refresh').addEventListener('click',refreshPrices);
for(const id of ['priceSearch','category'])$('#'+id).addEventListener(id==='priceSearch'?'input':'change',renderPrices);
for(const state of [...new Set(dishes.map(d=>d.state))].sort()){const option=document.createElement('option');option.value=state;option.textContent=state;$('#stateFilter').append(option);}
for(const id of ['stateFilter','dishSearch'])$('#'+id).addEventListener(id==='dishSearch'?'input':'change',()=>{showAll=false;renderDishes();});
for(const button of document.querySelectorAll('[data-view]'))button.addEventListener('click',()=>{view=button.dataset.view;for(const b of document.querySelectorAll('[data-view]')){const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));}$('#pricesView').hidden=view!=='prices';$('#ideasView').hidden=view!=='ideas';});
for(const button of document.querySelectorAll('[data-type]'))button.addEventListener('click',()=>{dishType=button.dataset.type;showAll=false;for(const b of document.querySelectorAll('[data-type]')){const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));}renderDishes();});
$('#browseAll').addEventListener('click',()=>{showAll=!showAll;renderDishes();});
render();refreshPrices();
