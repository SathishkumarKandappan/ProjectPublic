import http from 'node:http';
import {searchItem,today} from './search-prices.mjs';
import {defaults} from '../seed.js';import {supplierSeed} from '../supplier-seed.js';import {pdfRates} from '../pdf-rates.js';import {retailerPrices} from '../retailers.js';
const catalog=new Set([...defaults,...supplierSeed,...pdfRates,...retailerPrices].map(q=>q.name));
const origins=new Set((process.env.ALLOWED_ORIGINS||'https://sathishkumarkandappan.github.io').split(','));
let active=0;const windowUsage=new Map();
export const server=http.createServer(async(req,res)=>{
 const origin=req.headers.origin;if(origin&&!origins.has(origin)){res.writeHead(403);return res.end();}
 res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json');res.setHeader('Vary','Origin');if(origin)res.setHeader('Access-Control-Allow-Origin',origin);
 const reply=(code,body)=>{res.writeHead(code);res.end(JSON.stringify(body));};
 const u=new URL(req.url,'http://localhost');if(req.method==='GET'&&u.pathname==='/health')return reply(200,{ok:true});
 if(req.method!=='GET'||u.pathname!=='/api/search-prices')return reply(404,{error:'Not found'});
 const name=u.searchParams.get('name'),date=u.searchParams.get('date'),provider=u.searchParams.get('provider');
 if(!catalog.has(name)||!/^\d{4}-\d{2}-\d{2}$/.test(date||'')||Number.isNaN(Date.parse(date+'T12:00:00Z'))||date>today()||!['Blinkit','BigBasket','Instamart','Other'].includes(provider))return reply(400,{error:'Invalid ingredient, date or provider'});
 const now=Date.now(),ip=req.socket.remoteAddress;for(const [k,v]of windowUsage)if(v.reset<now)windowUsage.delete(k);
 const usage=windowUsage.get(ip)||{count:0,reset:now+60000};usage.count++;windowUsage.set(ip,usage);
 if(active>=8||usage.count>600){res.setHeader('Retry-After','30');return reply(429,{error:'Search busy; retry later'});}
 active++;try{reply(200,await searchItem({name,date,provider}));}catch{reply(502,{error:'Search/source request failed. Previously recorded prices remain unchanged.'});}finally{active--;}
});
if(process.env.NODE_ENV!=='test')server.listen(Number(process.env.PORT)||3000,'0.0.0.0');
