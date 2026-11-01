// State labels describe a culinary association, not an exclusive claim of origin.
const dish=(id,type,name,state,base,other,description)=>({id,type,name,state,base,unit:'kg',ingredients:[base,...other],description});
export const dishes=[
 dish('sambar','Curry','Vegetable sambar','Tamil Nadu','Toor dal',['Drumstick','Pumpkin'],'A tangy lentil curry with mixed vegetables.'),
 dish('rasam','Curry','Tomato rasam','Tamil Nadu','Tomato',['Tamarind'],'A light, peppery tomato-and-tamarind broth.'),
 dish('mor-kuzhambu','Curry','Mor kuzhambu','Tamil Nadu','Ash gourd',['Curd','Coconut'],'Ash gourd in a gently spiced curd and coconut gravy.'),
 dish('avial','Curry','Avial','Kerala','Carrot',['French beans','Coconut'],'Mixed vegetables with coconut, cumin and curd.'),
 dish('erissery','Curry','Pumpkin erissery','Kerala','Pumpkin',['Cowpeas','Coconut'],'Pumpkin and cowpeas finished with roasted coconut.'),
 dish('pulissery','Curry','Vellarikka pulissery','Kerala','Cucumber',['Curd','Coconut'],'Cucumber simmered in a coconut and curd sauce.'),
 dish('kadala','Curry','Kadala curry','Kerala','Black channa',['Coconut','Onion (big)'],'Black chickpeas in a roasted coconut gravy.'),
 dish('olan','Curry','Olan','Kerala','Ash gourd',['Cowpeas','Coconut milk'],'A mild ash gourd and cowpea curry with coconut milk.'),
 dish('parippu','Curry','Parippu curry','Kerala','Moong dal',['Coconut'],'Soft-cooked moong dal with a coconut and cumin paste.'),
 dish('kootu','Curry','Chow chow kootu','Tamil Nadu','Chayote',['Moong dal','Coconut'],'Chayote and dal in a mild coconut gravy.'),
 dish('palakura','Curry','Palakura pappu','Andhra Pradesh','Spinach',['Toor dal'],'Spinach and lentils cooked together with a tangy finish.'),
 dish('vankaya','Curry','Gutti vankaya','Andhra Pradesh','Brinjal',['Peanuts','Sesame seeds'],'Small brinjals stuffed with a nut-and-seed spice mixture.'),
 dish('beerakaya','Curry','Beerakaya pappu','Andhra Pradesh','Ridge gourd',['Toor dal'],'Ridge gourd and lentils, cooked until soft.'),
 dish('bendakaya','Curry','Bendakaya pulusu','Andhra Pradesh','Okra',['Tamarind','Jaggery'],'Okra in a tangy tamarind gravy.'),
 dish('gojju','Curry','Bendekayi gojju','Karnataka','Okra',['Tamarind','Coconut'],'A sweet-sour okra curry with a roasted spice paste.'),
 dish('saagu','Curry','Vegetable saagu','Karnataka','Potato',['Carrot','Green peas','Coconut'],'Mixed vegetables in a fragrant coconut-based gravy.'),
 dish('bassaru','Curry','Bassaru','Karnataka','Horse gram',['Garlic','Tamarind'],'A spiced broth traditionally made with strained pulse stock.'),
 dish('dal-tadka','Curry','Dal tadka','Punjab','Toor dal',['Tomato','Cumin seeds'],'Cooked lentils finished with a fragrant tempering.'),
 dish('palak-paneer','Curry','Palak paneer','Punjab','Spinach',['Paneer'],'Paneer cubes in a smooth spinach gravy.'),
 dish('rajma','Curry','Rajma masala','Punjab','Rajma',['Tomato','Onion (big)'],'Kidney beans simmered in an onion and tomato gravy.'),
 dish('chole','Curry','Chole masala','Punjab','Kabuli channa',['Tomato','Onion (big)'],'Chickpeas in a warmly spiced masala.'),
 dish('dahi-aloo','Curry','Dahi aloo','Uttar Pradesh','Potato',['Curd','Cumin seeds'],'Potatoes in a light, tangy curd gravy.'),
 dish('gatte','Curry','Gatte ki sabzi','Rajasthan','Besan',['Curd'],'Gram-flour dumplings served in a spiced curd gravy.'),
 dish('panchmel','Curry','Panchmel dal','Rajasthan','Chana dal',['Toor dal','Moong dal','Urad dal','Masoor dal'],'A comforting curry made with five kinds of lentils.'),
 dish('pithla','Curry','Pithla','Maharashtra','Besan',['Onion (big)','Garlic'],'A soft gram-flour preparation with a simple tempering.'),
 dish('aloo-palya','Palya','Aloo palya','Karnataka','Potato',['Mustard seeds','Curry leaves'],'Soft potato cubes tossed with a light tempering.'),
 dish('cabbage-palya','Palya','Cabbage palya','Karnataka','Cabbage',['Coconut'],'Finely chopped cabbage with grated coconut.'),
 dish('beans-palya','Palya','Beans palya','Karnataka','French beans',['Coconut'],'Tender green beans finished with coconut.'),
 dish('beet-palya','Palya','Beetroot palya','Karnataka','Beetroot',['Coconut'],'Steamed beetroot tossed with a mild tempering.'),
 dish('carrot-palya','Palya','Carrot palya','Karnataka','Carrot',['Coconut'],'A gently cooked carrot and coconut side dish.'),
 dish('cabbage-thoran','Palya','Cabbage thoran','Kerala','Cabbage',['Coconut','Cumin seeds'],'Shredded cabbage stir-fried with a coconut mixture.'),
 dish('beans-thoran','Palya','Beans thoran','Kerala','French beans',['Coconut'],'Finely cut beans cooked with coconut and curry leaves.'),
 dish('beet-thoran','Palya','Beetroot thoran','Kerala','Beetroot',['Coconut'],'A colourful beetroot and coconut dry side.'),
 dish('potato-poriyal','Palya','Urulai poriyal','Tamil Nadu','Potato',['Mustard seeds'],'Potato pieces roasted with a simple spice coating.'),
 dish('carrot-poriyal','Palya','Carrot poriyal','Tamil Nadu','Carrot',['Coconut'],'Diced carrots with a mustard tempering and coconut.'),
 dish('beet-poriyal','Palya','Beetroot poriyal','Tamil Nadu','Beetroot',['Coconut'],'A mild beetroot stir-fry finished with coconut.'),
 dish('beans-poriyal','Palya','Beans poriyal','Tamil Nadu','French beans',['Coconut'],'Chopped green beans cooked as a dry side.'),
 dish('vazhakkai','Palya','Vazhakkai poriyal','Tamil Nadu','Raw banana',['Coconut'],'Raw banana cubes with tempering and grated coconut.'),
 dish('vendakkai','Palya','Vendakkai poriyal','Tamil Nadu','Okra',['Onion (big)'],'Okra cooked until tender as a dry stir-fry.'),
 dish('aloo-posto','Palya','Aloo posto','West Bengal','Potato',['Poppy seeds'],'Potatoes cooked in a lightly spiced poppy-seed paste.'),
 dish('bandhakopi','Palya','Bandhakopir ghonto','West Bengal','Cabbage',['Potato','Green peas'],'Slow-cooked cabbage with potato and warming spices.'),
 dish('begun','Palya','Begun bhaja','West Bengal','Brinjal',['Turmeric powder'],'Brinjal slices lightly seasoned and pan-fried.'),
 dish('aloo-bhujia','Palya','Aloo bhujia','Bihar','Potato',['Cumin seeds'],'Thinly cut potatoes cooked as a simple dry side.'),
 dish('bharta','Palya','Baingan bharta','Punjab','Brinjal',['Tomato','Onion (big)'],'Roasted and mashed brinjal cooked with onion and tomato.'),
 dish('bhindi','Palya','Bhindi do pyaza','Punjab','Okra',['Onion (big)'],'A dry okra preparation with plenty of onion.'),
 dish('gawar','Palya','Gawar ki sabzi','Rajasthan','Cluster beans',['Besan'],'Cluster beans cooked with spices and a little gram flour.'),
 dish('tindora','Palya','Tindora nu shaak','Gujarat','Ivy gourd',['Mustard seeds'],'Sliced ivy gourd cooked as a lightly spiced dry shaak.'),
 dish('batata','Palya','Batata bhaji','Maharashtra','Potato',['Mustard seeds','Curry leaves'],'A mild potato bhaji with turmeric and curry leaves.'),
 dish('zunka','Palya','Zunka','Maharashtra','Besan',['Onion (big)'],'A drier, crumbly gram-flour and onion preparation.'),
 dish('aloo-methi','Palya','Aloo methi','Punjab','Potato',['Fenugreek leaves'],'Potatoes tossed with fresh fenugreek leaves.'),
 dish('avalakki','Snack','Avalakki oggarane','Karnataka','Poha',['Lemon','Mustard seeds'],'Softened flattened rice tossed with a light tempering.'),
 dish('upittu','Snack','Rave uppittu','Karnataka','Rava',['Carrot','Cabbage'],'Roasted semolina cooked with finely chopped vegetables.'),
 dish('akki','Snack','Akki rotti','Karnataka','Rice flour',['Onion (big)','Coriander leaves'],'A rice-flour flatbread shaped by hand and cooked on a griddle.'),
 dish('ragi','Snack','Ragi rotti','Karnataka','Ragi flour',['Onion (big)','Coriander leaves'],'A finger-millet flatbread with herbs and onion.'),
 dish('idli','Snack','Idli','Tamil Nadu','Idli rice',['Urad dal'],'Soft, steamed cakes made from fermented rice and lentil batter.'),
 dish('paniyaram','Snack','Kuzhi paniyaram','Tamil Nadu','Idli rice',['Urad dal','Onion (big)'],'Small savoury batter dumplings cooked in a paniyaram pan.'),
 dish('vada','Snack','Medu vada','Tamil Nadu','Urad dal',['Onion (big)','Curry leaves'],'Crisp lentil fritters with a soft centre.'),
 dish('sundal','Snack','Kondakadalai sundal','Tamil Nadu','Black channa',['Coconut'],'Well-cooked chickpeas tossed with coconut and tempering.'),
 dish('kozhukattai','Snack','Kara kozhukattai','Tamil Nadu','Rice flour',['Coconut','Mustard seeds'],'Savoury rice-flour dumplings cooked by steaming.'),
 dish('pesarattu','Snack','Pesarattu','Andhra Pradesh','Whole green gram',['Ginger'],'A savoury green-gram crepe cooked on a griddle.'),
 dish('punugulu','Snack','Punugulu','Andhra Pradesh','Idli rice',['Urad dal','Onion (big)'],'Small savoury fritters made with fermented batter.'),
 dish('dhokla','Snack','Dhokla','Gujarat','Chana dal',['Idli rice','Curd'],'Steamed savoury cakes made from a fermented grain-and-dal batter.'),
 dish('khandvi','Snack','Khandvi','Gujarat','Besan',['Curd'],'Thin gram-flour and curd rolls with a light tempering.'),
 dish('handvo','Snack','Handvo','Gujarat','Idli rice',['Chana dal','Bottle gourd'],'A savoury vegetable, rice and lentil cake.'),
 dish('kanda-poha','Snack','Kanda poha','Maharashtra','Poha',['Onion (big)','Lemon'],'Flattened rice cooked with onion and a squeeze of lemon.'),
 dish('kothimbir','Snack','Kothimbir vadi','Maharashtra','Besan',['Coriander leaves'],'Coriander and gram-flour bites, steamed then lightly pan-fried.'),
 dish('sabudana','Snack','Sabudana khichdi','Maharashtra','Sabudana',['Potato','Peanuts'],'Soaked tapioca pearls tossed with potato and roasted peanuts.'),
 dish('thalipeeth','Snack','Thalipeeth','Maharashtra','Bhajani flour',['Onion (big)'],'A savoury flatbread made from a roasted mixed-grain flour.'),
 dish('dahi-vada','Snack','Dahi vada','Uttar Pradesh','Urad dal',['Curd','Tamarind'],'Soft lentil dumplings served with curd and chutneys.'),
 dish('tikki','Snack','Aloo tikki','Delhi','Potato',['Green peas'],'Griddle-cooked potato patties, often filled with peas.'),
 dish('chana-chaat','Snack','Kala chana chaat','Uttar Pradesh','Black channa',['Tomato','Lemon'],'Cooked black chickpeas tossed with chopped vegetables and lemon.'),
 dish('mirchi','Snack','Mirchi bajji','Telangana','Besan',['Large green chillies'],'Large mild chillies coated in gram-flour batter and fried.'),
 dish('uggani','Snack','Uggani','Andhra Pradesh','Puffed rice',['Onion (big)','Tomato'],'Softened puffed rice tossed with a savoury tempering.'),
 dish('bedmi','Snack','Bedmi puri','Uttar Pradesh','Wheat flour',['Urad dal'],'Wheat puris enriched with a seasoned lentil mixture.'),
 dish('kachori','Snack','Matar kachori','Rajasthan','Wheat flour',['Green peas'],'A crisp wheat pastry filled with a spiced green-pea mixture.')
];
export function dailyIdeas(getQuote,{date,type='Curry',state='',query='',all=false}={}){
 const candidates=dishes.filter(d=>d.type===type&&(!state||d.state===state)&&(!query||[d.name,d.state,...d.ingredients].join(' ').toLowerCase().includes(query.toLowerCase()))).map(d=>{
  const quote=getQuote(d.base,d.unit);return {...d,quote,score:quote&&quote.unit==='kg'?quote.price:null};
 }).sort((a,b)=>(a.score==null)-(b.score==null)||(a.score??0)-(b.score??0)||a.name.localeCompare(b.name));
 if(all||candidates.length<=8)return candidates;
 const day=Math.floor(Date.parse(date+'T12:00:00Z')/86400000);
 const priced=candidates.filter(d=>d.score!=null);
 const pool=priced.length?priced.slice(0,15):candidates.slice(0,15);
 const offset=((day%pool.length)+pool.length)%pool.length;
 const featured=Array.from({length:Math.min(6,pool.length)},(_,i)=>pool[(offset+i)%pool.length]);
 const rest=candidates.filter(d=>!featured.some(f=>f.id===d.id));
 const exploreOffset=((day%rest.length)+rest.length)%rest.length;
 while(featured.length<8&&rest.length){const next=rest[(exploreOffset+featured.length-6+rest.length)%rest.length];if(!featured.some(d=>d.id===next.id))featured.push(next);else break;}
 return featured;
}
