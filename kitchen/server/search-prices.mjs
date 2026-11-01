// Server-only search and extraction. No search credentials are sent to browsers.
const providers={BigBasket:['bigbasket.com'],Blinkit:['blinkit.com'],Instamart:['instamart.in','swiggy.com'],Other:['zepto.com','organicmandya.com','thulamfoods.com','jiomart.com']};
export const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const decode=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'");
const words=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,' ').split(' ').filter(Boolean);
const names={'Onion (big)':['onion'],'Cooking oil (unspecified)':['sunflower oil'],'Sona Masuri rice (raw)':['sona masoori raw rice','sona masuri raw rice'],'Sona Masuri rice (steamed)':['sona masoori steam rice'],'Ragi flour':['ragi flour','nachni flour'],'Masoor dal':['masoor dal','masoor split'],'Taro leaves':['colocasia leaf','taro leaves'],'Hyacinth beans':['avarekai','hyacinth beans']};
export function matches(name,title){return (names[name]||[name]).some(n=>words(n).every(w=>words(title).includes(w)));}
export function allowed(url,provider){try{const u=new URL(url);return u.protocol==='https:'&&!u.username&&!u.password&&(!u.port||u.port==='443')&&providers[provider]?.some(h=>u.hostname===h||u.hostname.endsWith('.'+h));}catch{return false;}}
export function packAmount(text){
 const match=text.match(/(?:^|\s|\()(\d+(?:\.\d+)?)\s*(kg|g|gm|ml|litres?|liters?|ltr|l|pcs?|pieces?)\b/i);if(!match)return null;
 let quantity=Number(match[1]),unit=match[2].toLowerCase();if(!(quantity>0))return null;
 if(['g','gm','ml'].includes(unit)){quantity/=1000;unit=unit==='ml'?'litre':'kg';}else unit=unit==='kg'?'kg':unit.startsWith('l')?'litre':'piece';
 // Ambiguous multi-packs and weight ranges must be reviewed rather than guessed.
 if(/\d\s*(?:-|–)\s*\d|\bpack of\s*[2-9]|\bx\s*\d/i.test(text))return null;
 return {quantity,unit,pack:match[0].trim()};
}
export function extractOffers(html,{name,provider,url,date}){
 const out=[];const visit=node=>{
  if(!node||typeof node!=='object')return;if(Array.isArray(node)){node.forEach(visit);return;}
  if([node['@type']].flat().includes('Product')&&typeof node.name==='string'&&matches(name,node.name)){
   const size=packAmount(node.name+' '+(typeof node.size==='string'?node.size:''));
   if(size){for(const offer of [node.offers].flat().filter(Boolean)){
    if(offer.priceCurrency!=='INR'||!/^\d+(?:\.\d+)?$/.test(String(offer.price)))continue;
    const packPrice=Number(offer.price);if(!(packPrice>0)||packPrice>100000)continue;
    // A current offer never becomes a historical quote just because a date was selected.
    if(date!==today())continue;
    out.push({retailer:provider,name,unit:size.unit,price:packPrice/size.quantity,pack:size.pack,packQuantity:packPrice,product:node.name,url,observed:today(),source:provider+' · search / product structured offer'});
   }}
  }
  if(node['@graph'])visit(node['@graph']);
 };
 for(const match of html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){try{visit(JSON.parse(match[1]));}catch{}}
 return out;
}
async function get(url,fetcher){const r=await fetcher(url,{redirect:'error',signal:AbortSignal.timeout(10000),headers:{'User-Agent':'KitchenLedger/1.0 (public grocery price comparison)'}});if(!r.ok)throw Error('Source returned '+r.status);const length=Number(r.headers.get('content-length')||0);if(length>2000000)throw Error('Source too large');const text=await r.text();if(text.length>2000000)throw Error('Source too large');return text;}
export async function searchItem({name,date,provider},fetcher=fetch){
 if(!providers[provider])throw Error('Unknown provider');
 const query=(names[name]?.[0]||name)+' price Bangalore INR '+date+' ('+providers[provider].map(h=>'site:'+h).join(' OR ')+')';
 const rss=await get('https://www.bing.com/search?format=rss&q='+encodeURIComponent(query),fetcher);
 const urls=[...rss.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/g)].map(m=>m[1].match(/<link>([\s\S]*?)<\/link>/)?.[1]).filter(Boolean).map(decode).filter(u=>allowed(u,provider)).slice(0,3);
 const results=await Promise.allSettled(urls.map(async url=>extractOffers(await get(url,fetcher),{name,date,provider,url})));
 return {name,provider,quotes:results.flatMap(r=>r.status==='fulfilled'?r.value:[]),searchedAt:new Date().toISOString(),searched:true,warning:date!==today()?'Search completed; current offers cannot verify historical prices.':!urls.length?'Search returned no matching primary product pages.':undefined};
}
