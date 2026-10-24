// Fixed public APIs only; a supplied DOI must never become an arbitrary fetch destination.
async function getJSON(url,fetcher){const r=await fetcher(url,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(8000)});if(r.status===404)return null;if(!r.ok)throw Error('Source unavailable');return r.json();}
export async function checkPublication(record,fetcher=fetch){
 const doi=record.doi,issns=(record.issn||[]).filter(x=>/^\d{4}-\d{3}[\dX]$/i.test(x)).slice(0,2);
 const tasks=[
 {source:'DOAJ',url:'https://doaj.org/',scope:'Open-access journal directory. Absence does not imply predatory publishing.',run:async()=>{
  if(!issns.length)return {status:'insufficient_data',summary:'No ISSN supplied by Crossref; journal identity cannot be checked in DOAJ.'};
  const results=await Promise.all(issns.map(issn=>getJSON('https://doaj.org/api/search/journals/'+encodeURIComponent('issn:'+issn),fetcher)));
  const hits=results.flatMap(d=>d?.results||[]).filter(r=>[r.bibjson?.pissn,r.bibjson?.eissn,...(r.bibjson?.issn||[]).map(i=>i.value)].some(i=>issns.includes(i)));
  if(!hits.length)return {status:'not_found',summary:'No matching ISSN record returned by DOAJ. Subscription journals and journals outside DOAJ coverage may be legitimate.'};
  return {status:'found',summary:'An ISSN-matched journal record was found in DOAJ. Directory inclusion supports further review; it does not certify this paper.',journals:hits.slice(0,2).map(r=>({title:r.bibjson?.title||'Not supplied',publisher:r.bibjson?.publisher?.name||'Not supplied',reviewProcess:r.bibjson?.editorial?.review_process||r.bibjson?.editorial_review?.process||null,url:r.bibjson?.editorial?.review_process_url||r.bibjson?.editorial_review?.url||null}))};
 }},
 {source:'OpenAlex',url:'https://openalex.org/',scope:'Scholarly discovery index; indexing is not a quality or peer-review certification.',run:async()=>{
  const d=await getJSON('https://api.openalex.org/works/'+encodeURIComponent('https://doi.org/'+doi),fetcher);
  if(!d)return {status:'not_found',summary:'No work record returned by OpenAlex. This does not establish that the journal is unindexed elsewhere.'};
  if(String(d.doi||'').toLowerCase()!=='https://doi.org/'+doi.toLowerCase())return {status:'insufficient_data',summary:'The returned record could not be matched to this DOI.'};
  return {status:'found',summary:'A DOI-matched work record was found in OpenAlex.',recordURL:/^https:\/\/openalex\.org\//.test(d.id||'')?d.id:null,retractionFlag:d.is_retracted===true?'flagged':d.is_retracted===false?'not_flagged':'not_supplied',journal:d.primary_location?.source?.display_name||null};
 }},
 {source:'Europe PMC',url:'https://europepmc.org/',scope:'Biomedical and life-science literature only. Other disciplines may not be covered. Notices can be delayed or missing.',run:async()=>{
  const query='DOI:"'+doi.replace(/["\\]/g,'')+'"';
  const d=await getJSON('https://www.ebi.ac.uk/europepmc/webservices/rest/search?format=json&resultType=core&pageSize=10&query='+encodeURIComponent(query),fetcher);
  const matches=(d?.resultList?.result||[]).filter(r=>String(r.doi||'').toLowerCase()===doi.toLowerCase());
  if(!matches.length)return {status:'not_found',summary:'No DOI-matched record found in Europe PMC. No retraction conclusion can be drawn.'};
  const flags=matches.flatMap(r=>r.pubTypeList?.pubType||[]).filter(t=>/retract|expression of concern|erratum|correction/i.test(t));
  return {status:'found',summary:flags.length?'Publication-type notices are present; inspect the original records.':'Matched records contain no retraction/correction publication-type flags. This does not prove that no notices exist.',notices:[...new Set(flags)]};
 }}
 ];
 const checks=await Promise.all(tasks.map(async t=>{try{return {source:t.source,url:t.url,scope:t.scope,...await t.run()};}catch{return {source:t.source,url:t.url,scope:t.scope,status:'unavailable',summary:'This source could not be checked. It may require access credentials, be rate limited, or be temporarily unavailable.'};}}));
 const reportedRetraction=(record.updates||[]).some(u=>/retract|concern/i.test(u.type||''))||checks.some(c=>c.retractionFlag==='flagged'||c.notices?.some(n=>/retract|expression of concern/i.test(n)));
 return {checkedAt:new Date().toISOString(),checks,attentionRequired:reportedRetraction,peerReview:'Actual peer review of this paper is not independently verified. A directory may report the journal’s declared review process.',conduct:'Editorial conduct and predatory practices cannot be established from directory inclusion alone. Check publisher identity, transparent fees, board affiliations, and review policies.',publisherNotices:'Crossref update links and database flags are checked when supplied. Publisher websites are not crawled; review the current publisher page for notices.',conclusion:reportedRetraction?'A retraction or concern signal was found. Inspect the source notices before relying on this paper.':'No overall safety verdict. Missing records or absent flags do not prove authenticity or absence of retractions.'};
}
