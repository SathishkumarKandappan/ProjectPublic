export const todayIST = () => new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export const addDays = (day,n) => new Date(Date.parse(day+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
export const dayDiff = (a,b) => Math.round((Date.parse(a+'T12:00:00Z')-Date.parse(b+'T12:00:00Z'))/86400000);
export function observations(item,records,quotes){
 const merged=new Map();
 for(const r of records.filter(r=>r.name===item.name&&r.unit===item.unit)) merged.set(r.date,r);
 for(const r of quotes.filter(r=>r.name===item.name&&r.unit===item.unit)) merged.set(r.date,r);
 return [...merged.values()].filter(r=>Number.isFinite(r.price)&&r.price>=0).sort((a,b)=>a.date.localeCompare(b.date));
}
export function latest(item,records,quotes,day){return observations(item,records,quotes).filter(r=>r.date<=day).at(-1)||null;}
export function forecast(item,records,quotes,day,today){
 const series=observations(item,records,quotes).filter(r=>r.date<=today);
 const base=series.at(-1);if(!base)return null;
 // Only compare the same source and price basis, over the last 30 days.
 const usable=series.filter(r=>r.source===base.source&&r.basis===base.basis&&dayDiff(base.date,r.date)<=30);
 const trend=usable.length>=3&&dayDiff(base.date,usable[0].date)>=2;
 let slope=0;
 if(trend){const xs=usable.map(r=>dayDiff(r.date,usable[0].date));const ys=usable.map(r=>r.price);const mx=xs.reduce((a,b)=>a+b,0)/xs.length;const my=ys.reduce((a,b)=>a+b,0)/ys.length;const den=xs.reduce((s,x)=>s+(x-mx)**2,0);slope=den?xs.reduce((s,x,i)=>s+(x-mx)*(ys[i]-my),0)/den:0;slope=Math.max(-base.price*.03,Math.min(base.price*.03,slope));}
 const price=Math.max(0,base.price+slope*Math.max(0,dayDiff(day,base.date)));
 return {...base,price:Math.round(price*100)/100,projection:true,method:trend?'Recent price trend (capped at 3% / day)':'Flat estimate · insufficient history',stale:dayDiff(today,base.date)>2};
}
export function priceOn(item,records,quotes,day,today){if(day>today)return forecast(item,records,quotes,day,today);const r=observations(item,records,quotes).find(r=>r.date===day);return r?{...r,projection:false}:null;}
export function priceTone(price,target){if(price==null||target==null||target<=0)return 'neutral';return price<target?'cheap':price>target?'expensive':'neutral';}
