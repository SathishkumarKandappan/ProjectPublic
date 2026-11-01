import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {defaults} from '../seed.js';
import {supplierSeed} from '../supplier-seed.js';
import {pdfRates} from '../pdf-rates.js';
import {retailerPrices} from '../retailers.js';
import {searchItem,extractOffers,allowed,today} from '../server/search-prices.mjs';
const providers=['BigBasket','Blinkit','Instamart','Other'];
export function mergeQuotes(previous,incoming){
 const rows=new Map(previous.map(q=>[[q.retailer,q.name,q.unit,q.observed,q.url].join('|'),q]));
 for(const q of incoming){if(!Number.isFinite(q.price)||q.price<=0||q.observed!==today()||!q.name||!q.unit||!q.url?.startsWith('https://'))continue;rows.set([q.retailer,q.name,q.unit,q.observed,q.url].join('|'),q);}
 return [...rows.values()].sort((a,b)=>a.observed.localeCompare(b.observed)||a.name.localeCompare(b.name)||a.retailer.localeCompare(b.retailer));
}
export async function collect({previous,items,search=searchItem,fetcher=fetch,concurrency=8,onProgress=()=>{},budgetMs=1080000}){
 const names=[...new Set(items)],jobs=names.flatMap(name=>providers.map(provider=>({name,date:today(),provider})));
 const started=Date.now(),fresh=[],stats=Object.fromEntries(providers.map(p=>[p,{searched:0,verified:0,failed:0,noQuote:0,blocked:0}]));let cursor=0,completed=0;
 const worker=async()=>{while(cursor<jobs.length&&Date.now()-started<budgetMs){
  const job=jobs[cursor++],stat=stats[job.provider];
  try{
   stat.searched++;let result;try{result=await search(job,fetcher);}catch{stat.failed++;result={quotes:[]};}
   const before=stat.verified;fresh.push(...result.quotes);stat.verified+=result.quotes.length;
   // Recheck previously verified primary product URLs when search offers no quote.
   if(!result.quotes.length){const known=previous.filter(q=>q.name===job.name&&allowed(q.url,job.provider)&&/\/(pd|prn|pn|p)\//.test(new URL(q.url).pathname)).sort((a,b)=>b.observed.localeCompare(a.observed));
    const urls=[...new Set(known.map(q=>q.url))].slice(0,2);
    for(const url of urls){try{const r=await fetcher(url,{signal:AbortSignal.timeout(8000),redirect:'error'});if(!r.ok){stat.blocked++;continue;}const text=await r.text();if(text.length>2000000)continue;const found=extractOffers(text,{...job,url});fresh.push(...found);stat.verified+=found.length;}catch{}}
    if(stat.verified===before)stat.noQuote++;
   }
  }catch{stat.failed++;}
  completed++;if(completed%25===0)onProgress({completed,total:jobs.length,verified:fresh.length});
 }};
 await Promise.all(Array.from({length:concurrency},worker));
 return {quotes:mergeQuotes(previous,fresh),checkedAt:new Date().toISOString(),collection:{date:today(),total:jobs.length,completed,unattempted:jobs.length-completed,verified:fresh.length,providers:stats}};
}
async function main(){
 const dir=process.argv[2]||'kitchen';mkdirSync(dir,{recursive:true});const path=join(dir,'retailer-prices.json');
 let previous=retailerPrices;try{previous=JSON.parse(readFileSync(path,'utf8')).quotes;}catch{}
 const items=[...defaults,...supplierSeed,...pdfRates,...retailerPrices].map(q=>q.name);
 const result=await collect({previous,items,onProgress:p=>console.log(JSON.stringify(p))});
 writeFileSync(path,JSON.stringify(result,null,2)+'\n');
 // Supplier rates are managed only from a new user-provided list. Never write supplier.json here.
 const market=JSON.parse(readFileSync(join(dir,'market.json'),'utf8'));
 const status={checkedAt:result.checkedAt,retailers:result.collection,marketErrors:market.errors||[]};
 writeFileSync(join(dir,'update-status.json'),JSON.stringify(status,null,2)+'\n');
 console.log(JSON.stringify(status));
 if(!result.collection.verified)console.log('::warning::No newly verified retailer prices. Retailer quotes retain their previous observation dates.');
 const report=`## Daily kitchen price update\n\n- Search checks completed: ${result.collection.completed}/${result.collection.total}\n- Verified product offers: ${result.collection.verified}\n- Market source errors: ${status.marketErrors.length}\n\nPreviously recorded prices retain their original dates when a source fails. Supplier prices are never changed by market searches.\n`;
 if(process.env.GITHUB_STEP_SUMMARY)writeFileSync(process.env.GITHUB_STEP_SUMMARY,report,{flag:'a'});
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await main();
