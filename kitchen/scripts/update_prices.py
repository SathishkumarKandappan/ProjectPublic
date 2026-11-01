"""Fetch dated public listings, retain actual observations, and never restamp old prices."""
import datetime as dt
import json
import re
import sys
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from zoneinfo import ZoneInfo

VEG_URL = 'https://www.vegetablemarketprice.com/market/bangalore/today'
RICE_URL = 'https://www.indiaprices.co.in/rice/bengaluru-rice-price/'
VEG_NAMES = {'onion big':'Onion (big)', 'tomato':'Tomato','potato':'Potato','green chilli':'Green chilli','beetroot':'Beetroot','ash gourd':'Ash gourd','bitter gourd':'Bitter gourd','bottle gourd':'Bottle gourd','cabbage':'Cabbage','carrot':'Carrot','cauliflower':'Cauliflower','coriander leaves':'Coriander leaves','cucumber':'Cucumber','curry leaves':'Curry leaves','drumsticks':'Drumstick','brinjal':'Brinjal','french beans':'French beans','garlic':'Garlic','ginger':'Ginger','green peas':'Green peas','ladies finger':'Okra','pumpkin':'Pumpkin','radish':'Radish','ridge gourd':'Ridge gourd','spinach':'Spinach'}
RICE_NAMES = {'sona masoori rice raw':'Sona Masuri rice (raw)','sona masoori rice steamed':'Sona Masuri rice (steamed)','red rice':'Red rice','idli rice':'Idli rice','ponni rice boiled':'Ponni rice (boiled)'}
class Tables(HTMLParser):
    def __init__(self):
        super().__init__(); self.rows=[]; self.row=None; self.cell=None; self.text=[]
    def handle_starttag(self,tag,attrs):
        if tag=='tr': self.row=[]
        if tag in ('td','th') and self.row is not None: self.cell=[]
    def handle_data(self,data):
        self.text.append(data)
        if self.cell is not None: self.cell.append(data)
    def handle_endtag(self,tag):
        if tag in ('td','th') and self.cell is not None:
            self.row.append(' '.join(' '.join(self.cell).split())); self.cell=None
        if tag=='tr' and self.row is not None:
            self.rows.append(self.row);self.row=None

def parse(html,kind):
    parser=Tables();parser.feed(html);text=' '.join(parser.text)
    if kind=='rice':
        match=re.search(r'Last\s+updated\s+on\s+(\d{1,2}-[A-Za-z]{3}-\d{4})',text,re.I)
        fmt='%d-%b-%Y';names=RICE_NAMES;url=RICE_URL;source='India Prices';basis='Listed rice retail price'
    else:
        match=re.search(r'(\d{1,2}/[A-Za-z]{3}/\d{4})',text)
        fmt='%d/%b/%Y';names=VEG_NAMES;url=VEG_URL;source='Vegetable Market Price';basis='Retail range midpoint'
    if not match: raise ValueError('No unambiguous source date found')
    day=dt.datetime.strptime(match.group(1),fmt).date()
    today=dt.datetime.now(ZoneInfo('Asia/Kolkata')).date()
    if day>today: raise ValueError('Source date is in the future')
    records=[]
    for row in parser.rows:
        for i,cell in enumerate(row):
            name=names.get(cell.strip().lower())
            if not name: continue
            if kind=='rice':
                if len(row)<i+3 or not re.fullmatch(r'1\s*kg',row[i+1],re.I): continue
                nums=re.findall(r'\d+(?:\.\d+)?',row[i+2].replace(',',''))
                if len(nums)!=1: continue
                price=float(nums[0])
            else:
                if len(row)<i+4 or not re.fullmatch(r'1\s*kg',row[i+3],re.I): continue
                nums=re.findall(r'\d+(?:\.\d+)?',row[i+2].replace(',',''))
                if len(nums)!=2: continue
                low,high=map(float,nums)
                if low>high: continue
                price=(low+high)/2
            if not 0<price<10000: continue
            records.append(dict(name=name,unit='kg',price=price,date=day.isoformat(),source=source,basis=basis,url=url))
    if len(records)<(4 if kind=='rice' else 10): raise ValueError('Too few matched rows; source format may have changed')
    return records

def fetch(url):
    request=urllib.request.Request(url,headers={'User-Agent':'KitchenLedger/1.0 (school kitchen public price monitor)'})
    with urllib.request.urlopen(request,timeout=45) as response:
        return response.read(4_000_000).decode('utf-8')

def main(path):
    target=Path(path);data=json.loads(target.read_text()) if target.exists() else {'records':[]}
    merged={(r['name'],r['unit'],r['date'],r['source']):r for r in data['records']};errors=[]
    for kind,url in [('rice',RICE_URL),('vegetables',VEG_URL)]:
        try:
            rows=parse(fetch(url),kind)
            for r in rows: merged[(r['name'],r['unit'],r['date'],r['source'])]=r
            print(f'{kind}: {len(rows)} rows, source date {rows[0]["date"]}')
        except Exception as error:
            errors.append(f'{kind}: {type(error).__name__}: {error}')
            print(errors[-1])
    data={'checkedAt':dt.datetime.now(dt.timezone.utc).isoformat(),'errors':errors,'records':sorted(merged.values(),key=lambda r:(r['date'],r['name']))}
    target.parent.mkdir(parents=True,exist_ok=True);target.write_text(json.dumps(data,indent=2)+'\n')

if __name__=='__main__': main(sys.argv[1])
