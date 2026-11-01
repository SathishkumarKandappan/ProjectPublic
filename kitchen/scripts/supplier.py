"""Normalize only the supplier's price table, not menus or personal information."""
import re
MAPPING={'potato':'Potato','cabbage':'Cabbage','toor dal':'Toor dal','moong dal':'Moong dal','urad dal':'Urad dal','channa dal':'Chana dal','red rice':'Red rice','tamarind':'Tamarind','salt':'Salt','jeera':'Cumin seeds','mustard seeds':'Mustard seeds','green chillie':'Green chilli','ginger':'Ginger','curry leaves':'Curry leaves','tomato':'Tomato','bottle guard':'Bottle gourd','cauliflower':'Cauliflower','cucumber':'Cucumber','dhaniya seeds':'Coriander seeds','oil':'Cooking oil (unspecified)','white rice':'White rice (unspecified)'}
def normalize(rows):
    result=[]
    for row in rows:
        if len(row)<3:continue
        name=str(row[0] or '').strip();q=str(row[1] or '').strip().lower().replace(' ','')
        match=re.fullmatch(r'(\d+(?:\.\d+)?)(kg|g|l|pc|pkt|bunch)',q)
        if not name or not match:continue
        try: amount=float(match[1]);cost=float(str(row[2]).replace(',',''))
        except (TypeError,ValueError):continue
        if amount<=0 or cost<0:continue
        unit={'kg':'kg','g':'kg','l':'litre','pc':'piece','pkt':'packet','bunch':'bunch'}[match[2]]
        if match[2]=='g':amount/=1000
        result.append({'name':MAPPING.get(name.lower(),name),'originalName':name,'unit':unit,'price':round(cost/amount,4),'effectiveDate':None,'source':'Supplier price list','note':f'{row[1]} for ₹{cost:g}; date not supplied'})
    return result
