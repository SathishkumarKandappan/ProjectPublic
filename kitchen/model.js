export const todayIST=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export const dayDiff=(a,b)=>Math.round((Date.parse(a+'T12:00:00Z')-Date.parse(b+'T12:00:00Z'))/86400000);
export function marketAsOf(records,name,unit,date){return records.filter(r=>r.name===name&&r.unit===unit&&r.date<=date&&Number.isFinite(r.price)&&r.price>=0).sort((a,b)=>a.date.localeCompare(b.date)).at(-1)||null;}
export function comparePrices(market,supplier,unit){
 if(!market||!supplier||supplier.unit!==unit)return {comparable:false,reason:!supplier?'No supplier quote':!market?'No market record':'Different units'};
 const delta=supplier.price-market.price;
 return {comparable:true,delta,percent:market.price>0?delta/market.price*100:null,supplierTone:delta<0?'cheap':delta>0?'expensive':'neutral',marketTone:delta>0?'cheap':delta<0?'expensive':'neutral'};
}
