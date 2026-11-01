import {matches,packAmount,allowed,today as todayIST,indexedQuote} from '../../server/search-prices.mjs';
const providerNames={blinkit:'Blinkit',BlinkIt:'Blinkit',bigbasket:'BigBasket',BigBasket:'BigBasket',instamart:'Instamart',swiggy:'Instamart',Swiggy:'Instamart',zepto:'Other',Zepto:'Other'};
export function dateIST(value){if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}(?:T|$)/.test(value))return null;const d=new Date(value.length===10?value+'T12:00:00Z':value);return Number.isNaN(d.getTime())?null:new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(d);}
function quote({name,title,packText,packPrice,url,provider,observed,via,basis='API product reading',location}){
 if(typeof title!=='string'||!matches(name,title)||!allowed(url,provider)||!observed||observed>todayIST()||!Number.isFinite(packPrice)||packPrice<=0)return null;
 const pack=packAmount(packText||title);if(!pack)return null;
 return {retailer:provider,name,unit:pack.unit,price:packPrice/pack.quantity,pack:pack.pack,packQuantity:packPrice,product:title,url,observed,source:provider+' via '+via,basis,...(location?{location}:{}),checkedAt:new Date().toISOString()};
}
export function rewaltoQuotes(data,name){
 if(!Array.isArray(data.data))return [];
 return data.data.flatMap(row=>{const latest=row.latest;if(!latest||latest.currency!=='INR'||!Number.isSafeInteger(latest.priceMinor))return [];
  const provider=providerNames[row.retailer];if(!provider)return [];
  const q=quote({name,title:row.title,packText:row.packSizeRaw,packPrice:latest.priceMinor/100,url:row.url,provider,observed:dateIST(latest.observedAt),via:'Rewalto',location:latest.pincode||'API location not specified'});return q?[q]:[];
 });
}
export function quickQuotes(data,name,provider,observed){
 if(data.status!=='success'||!Array.isArray(data.data?.products))return [];
 return data.data.products.flatMap(row=>{if(row.currency&&row.currency!=='INR')return [];if(row.available===false)return [];
  const q=quote({name,title:row.name,packText:row.quantity,packPrice:row.offer_price,url:row.deeplink,provider,observed,via:'QuickCommerceAPI',location:'Bengaluru city reference'});return q?[q]:[];
 });
}
export function serpQuotes(data,name,provider,date){return (data.organic_results||[]).map(r=>indexedQuote({title:r.title||'',snippet:r.snippet||'',url:r.link,name,provider,date})).filter(Boolean).map(q=>({...q,source:provider+' search-indexed reference via SerpApi'}));}
const policies={Rewalto:{secret:'REWALTO_API_KEY',day:32,month:1000},QuickCommerceAPI:{secret:'QUICKCOMMERCE_API_KEY',day:3,lifetime:100},SerpApi:{secret:'SERPAPI_API_KEY',day:8,month:250}};
// Reserve before calling; failed/empty requests still count conservatively.
export function reserve(ledger,provider,date){const rule=policies[provider];const record=ledger[provider]||={days:{},months:{},total:0};const month=date.slice(0,7);if((record.days[date]||0)>=rule.day||(rule.month&&(record.months[month]||0)>=rule.month)||(rule.lifetime&&record.total>=rule.lifetime))return false;record.days[date]=(record.days[date]||0)+1;record.months[month]=(record.months[month]||0)+1;record.total++;return true;}
async function api(url,headers,fetcher){const r=await fetcher(url,{headers,signal:AbortSignal.timeout(20000)});if(!r.ok){const error=Error('API HTTP '+r.status);error.stop=[401,402,403,429].includes(r.status);throw error;}const body=await r.json();if(body.error){const e=Error('API rejected request');e.stop=true;throw e;}return body;}
export async function collectFreeAPIs({items,ledger={},env=process.env,fetcher=fetch,date=todayIST(),saveLedger=()=>{}}){
 const quotes=[],sources=[];const sorted=[...new Set(items)].sort();const start=Math.floor(Date.parse(date+'T12:00:00Z')/86400000)%Math.max(1,sorted.length);const names=[...sorted.slice(start),...sorted.slice(0,start)];
 for(const [provider,policy]of Object.entries(policies)){
  if(!env[policy.secret]){sources.push({provider,status:'key_required',secret:policy.secret});continue;}
  const status={provider,status:'checked',requests:0,quotes:0,failures:0};
  for(let i=0;i<names.length;i++){
   if(!reserve(ledger,provider,date)){status.status='free_budget_reached';break;}saveLedger(ledger);status.requests++;
   const name=names[i],retailer=['Blinkit','BigBasket','Instamart'][i%3];let rows=[];
   try{
    if(provider==='Rewalto'){
     // No location form is added. National/other-city readings retain their location.
     const u=new URL('https://api.rewalto.com/v1/data/listings/search');u.search=new URLSearchParams({q:name,include:'latest',limit:'10'});
     rows=rewaltoQuotes(await api(u,{Authorization:'Bearer '+env.REWALTO_API_KEY},fetcher),name);
    }else if(provider==='QuickCommerceAPI'){
     const u=new URL('https://api.quickcommerceapi.com/v1/search');u.search=new URLSearchParams({q:name,platform:{Blinkit:'BlinkIt',BigBasket:'BigBasket',Instamart:'Swiggy'}[retailer],lat:'12.9716',lon:'77.5946'});
     rows=quickQuotes(await api(u,{'X-API-Key':env.QUICKCOMMERCE_API_KEY},fetcher),name,retailer,date);
    }else{
     const u=new URL('https://serpapi.com/search.json');u.search=new URLSearchParams({engine:'google',q:name+' price site:'+{Blinkit:'blinkit.com',BigBasket:'bigbasket.com',Instamart:'instamart.in'}[retailer],gl:'in',hl:'en',num:'10',api_key:env.SERPAPI_API_KEY});
     rows=serpQuotes(await api(u,{},fetcher),name,retailer,date);
    }
    quotes.push(...rows);status.quotes+=rows.length;
   }catch(e){status.failures++;if(e.stop){status.status='provider_unavailable';break;}}
  }sources.push(status);
 }return {quotes,sources,ledger};
}
