import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const workflow=readFileSync('.github/workflows/kitchen-daily-prices.yml','utf8');
const inline=workflow.split("node --input-type=module <<'JS'\n")[1].split('\n          JS')[0].split('\n').map(l=>l.slice(10)).join('\n').replace("import fs from 'node:fs';",'');
async function due(now,status,event='schedule',fail=false){let output='';class FrozenDate extends Date{constructor(...args){super(...(args.length?args:[now]));}static now(){return Date.parse(now);}}
 await vm.runInNewContext('(async()=>{'+inline+'})()',{Date:FrozenDate,Intl,Number,Error,AbortSignal,console:{log(){}},fs:{appendFileSync(_,s){output+=s;}},process:{env:{EVENT_NAME:event,GITHUB_OUTPUT:'test-output'}},fetch:async()=>{if(fail)throw Error('network');return{ok:true,json:async()=>status};}});return output.trim();}
const previous={checkedAt:'2026-11-01T10:24:00Z',retailers:{unattempted:0},marketErrors:[]};
const complete={checkedAt:'2026-11-01T22:45:00Z',retailers:{unattempted:0},marketErrors:[]};
assert.equal(await due('2026-11-01T22:29:00Z',previous),'refresh=false');
assert.equal(await due('2026-11-01T22:30:00Z',previous),'refresh=true');
assert.equal(await due('2026-11-01T22:50:00Z',complete),'refresh=false');
assert.equal(await due('2026-11-01T23:20:00Z',{...complete,retailers:{unattempted:5}}),'refresh=true');
assert.equal(await due('2026-11-01T23:20:00Z',complete,'schedule',true),'refresh=true');
assert.equal(await due('2026-11-01T21:00:00Z',complete,'push'),'refresh=true');
console.log('PASS: actual workflow guard, IST cutoff, missed run, duplicate skip, incomplete run and network recovery');
