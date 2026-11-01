// Government wholesale benchmarks: keep the source date, market and unit.
const normal=s=>String(s??'').toLowerCase().replace(/[^a-z0-9]/g,'');
export const govNames={'onion':'Onion (big)','tomato':'Tomato','potato':'Potato','carrot':'Carrot','beetroot':'Beetroot','cabbage':'Cabbage','cauliflower':'Cauliflower','brinjal':'Brinjal','bhindi':'Okra','ladiesfinger':'Okra','bottlegourd':'Bottle gourd','ashgourd':'Ash gourd','bittergourd':'Bitter gourd','ridgegourd':'Ridge gourd','snakegourd':'Snake gourd','pumpkin':'Pumpkin','cucumber':'Cucumber','greenchilli':'Green chilli','garlic':'Garlic','gingergreen':'Ginger','ginger':'Ginger','greenpeas':'Green peas','beans':'French beans','frenchbeans':'French beans','radish':'Radish','sweetpotato':'Sweet potato','arhardaltur':'Toor dal','arhardalturdal':'Toor dal','bengalgramdalchanadal':'Chana dal','greengramdalmoongdal':'Moong dal','lentilmasurwhole':'Whole masoor dal','blackgramdalurd':'Urad dal','jaggery':'Jaggery','groundnut':'Peanuts'};
const field=(row,...names)=>{const entries=Object.entries(row);for(const n of names){const entry=entries.find(([k])=>normal(k)===normal(n));if(entry)return entry[1];}};
export function sourceDate(value){const s=String(value??'');let date;if(/^\d{4}-\d{2}-\d{2}$/.test(s))date=s;else{const m=s.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);if(m)date=m[3]+'-'+m[2]+'-'+m[1];}if(!date)return null;const parsed=new Date(date+'T12:00:00Z');return !Number.isNaN(parsed.getTime())&&parsed.toISOString().slice(0,10)===date?date:null;}
export function objects(data){const out=[];const visit=(v,depth=0)=>{if(!v||typeof v!=='object'||depth>12)return;if(!Array.isArray(v))out.push(v);for(const child of Object.values(v))if(child&&typeof child==='object')visit(child,depth+1);};visit(data);return out;}
export function governmentRows(data,{source,url,today,unitDefault='quintal'}){
 const records=[];for(const row of objects(data)){
  const commodity=field(row,'commodity','commodity_name','commodityName');const name=govNames[normal(commodity)];if(!name)continue;
  const district=String(field(row,'district','district_name','districtName')||'');const market=String(field(row,'market','market_name','marketName')||'');
  // Do not silently substitute all-Karnataka or another city's prices for Bengaluru.
  if(!/bangalore|bengaluru|yashwantpur|yeshwanthpur|yelahanka|krishnarajapura/i.test(district+' '+market))continue;
  const date=sourceDate(field(row,'arrival_date','arrivalDate','date','report_date'));if(!date||date>today)continue;
  const raw=field(row,'modal_price','modalPrice','modal');if(raw===null||raw===''||raw===undefined)continue;
  const modal=Number(String(raw).replace(/,/g,''));if(!Number.isFinite(modal)||modal<=0)continue;
  const unit=normal(field(row,'unit','price_unit','priceUnit')||unitDefault);const divisor=['quintal','rsquintal','rsperquintal','100kg'].includes(unit)?100:unit==='kg'?1:null;if(!divisor)continue;
  const variety=String(field(row,'variety','variety_name')||'');
  records.push({name,unit:'kg',price:modal/divisor,date,source,basis:'Wholesale modal benchmark',market,district,variety,url,originalPrice:modal,originalUnit:unit});
 }return records;
}
export async function fetchJSON(url,fetcher=fetch){const r=await fetcher(url,{signal:AbortSignal.timeout(15000),headers:{Accept:'application/json','User-Agent':'KitchenLedger/1.0 (school kitchen public market reference)'}});if(!r.ok)throw Error('HTTP '+r.status);return r.json();}
export async function collectGovernment({env=process.env,fetcher=fetch,today}){
 const records=[],sources=[];
 if(env.DATA_GOV_IN_API_KEY){
  try{let offset=0;for(let page=0;page<5;page++){
   const url=new URL('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070');url.search=new URLSearchParams({'api-key':env.DATA_GOV_IN_API_KEY,format:'json','filters[state]':'Karnataka',limit:'1000',offset:String(offset)});
   const data=await fetchJSON(url,fetcher);if(!Array.isArray(data.records))throw Error('Unexpected dataset schema');
   const rows=governmentRows(data.records,{source:'AGMARKNET / data.gov.in',url:'https://data.gov.in/catalog/current-daily-price-various-commodities-various-markets-mandi',today});records.push(...rows);offset+=data.records.length;if(data.records.length<1000||offset>=Number(data.total))break;
  }sources.push({provider:'data.gov.in',status:records.length?'updated':'no_matching_records',records:records.length});}
  catch{sources.push({provider:'data.gov.in',status:'request_failed',message:'Government API request failed; previous dated prices retained.'});}
 }else sources.push({provider:'data.gov.in',status:'key_required',secret:'DATA_GOV_IN_API_KEY'});
 // The public Agmarknet 2.0 report is attempted without fabricated credentials.
 try{
  const base='https://api.agmarknet.gov.in/v1';const filters=await fetchJSON(base+'/daily-price-arrival/filters',fetcher);
  const state=objects(filters).find(r=>normal(field(r,'name','state_name','stateName'))==='karnataka');
  const id=state&&field(state,'id','state_id','stateId','code');if(id==null)throw Error('Karnataka identifier unavailable');
  let count=0;for(let days=0;days<3;days++){
   const date=new Date(Date.parse(today+'T12:00:00Z')-days*86400000).toISOString().slice(0,10);
   const u=new URL(base+'/prices-and-arrivals/commodity-market/daily-report-state');u.search=new URLSearchParams({date,state:String(id),includeExcel:'false'});
   const data=await fetchJSON(u,fetcher);const rows=governmentRows(data,{source:'AGMARKNET public report',url:'https://agmarknet.gov.in/home',today,unitDefault:''});records.push(...rows);count+=rows.length;if(count)break;
  }sources.push({provider:'AGMARKNET public report',status:count?'updated':'no_matching_records',records:count});
 }catch{sources.push({provider:'AGMARKNET public report',status:'request_failed',message:'Public report unavailable or schema not verified; previous prices retained.'});}
 return {records,sources};
}
