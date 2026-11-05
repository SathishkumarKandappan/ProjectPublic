import {manualPrices,rejectedPairs} from './manual-prices.js?v=23';
import {scrapedPrices} from './retailer-data.js';
import {extraPrices} from './extra-prices.js';
// Public catalogue observations. Reference product prices, not checkout quotes.
const observed='2026-11-01';
const row=(retailer,name,price,pack,packQuantity,url,product)=>({retailer,name,price,unit:'kg',pack,packQuantity,url,product,observed,source:retailer+' public listing'});
const bb='https://www.bigbasket.com/pb/bb-super-saver/';
const im='https://instamart.in/p/supreme-harvest-masoor-dal-split-XPX3OOZX2U';
const im2='https://instamart.in/p/tata-sampann-unpolished-kali-masoor-dal-YB3813GC48';
const originalPrices=[
 row('BigBasket','Sona Masuri rice (raw)',1690/26,'26 kg',1690,bb,'bb SUPER SAVER Sona Masoori Raw Rice'),
 row('BigBasket','Sona Masuri rice (steamed)',1430/26,'26 kg',1430,bb,'bb SUPER SAVER Sona Masoori Steam Rice'),
 row('BigBasket','Toor dal',144,'1 kg',144,bb,'bb SUPER SAVER Toor/Arhar Dal'),
 row('BigBasket','Masoor dal',108,'1 kg',108,bb,'bb SUPER SAVER Masoor Dal/Mysore Bele'),
 row('BigBasket','Idli rice',578/10,'10 kg',578,bb,'bb SUPER SAVER Idli/Idly Rice'),
 row('BigBasket','Besan',98,'1 kg',98,bb,'bb SUPER SAVER Besan/Kadale Hittu'),
 row('BigBasket','Dried white peas',89,'1 kg',89,bb,'bb SUPER SAVER White Peas'),
 row('BigBasket','Kabuli channa',102,'1 kg',102,bb,'bb SUPER SAVER Kabuli Chana'),
 row('BigBasket','Ragi flour',78.4,'1 kg',78.4,bb,'bb SUPER SAVER Ragi Flour'),
 row('BigBasket','Rice flour',60,'1 kg',60,bb,'bb SUPER SAVER Rice Flour'),
 row('BigBasket','Whole green gram',128,'1 kg',128,bb,'bb SUPER SAVER Green Moong Whole'),
 row('BigBasket','Moong dal',132.3,'1 kg',132.3,bb,'bb SUPER SAVER Moong Dal'),
 row('BigBasket','Black channa',117,'1 kg',117,bb,'bb SUPER SAVER Brown Chana'),
 row('BigBasket','Urad dal (black, broken)',160,'500 g',80,bb,'bb SUPER SAVER Split Black Urad'),
 row('BigBasket','Rajma',147.2,'1 kg',147.2,bb,'bb SUPER SAVER Kashmiri Rajma'),
 row('BigBasket','Chana dal',110,'2 kg',220,bb,'bb SUPER SAVER Chana Dal'),
 row('BigBasket','Poppy seeds',1990,'100 g',199,bb,'bb SUPER SAVER Khus Khus'),
 row('BigBasket','Rava',60,'500 g',30,bb,'bb SUPER SAVER Bombay Rava'),
 row('BigBasket','White cowpeas',150,'500 g',75,bb,'bb SUPER SAVER Lobia White'),
 row('BigBasket','Whole masoor dal',100,'1 kg',100,bb,'bb SUPER SAVER Black Masoor Whole'),
 row('BigBasket','Ponni rice (boiled)',75,'1 kg',75,bb,'bb SUPER SAVER Tamil Ponni Boiled Rice'),
 row('BigBasket','Chilli powder',520,'500 g',260,bb,'bb SUPER SAVER Chilli Powder'),
 row('BigBasket','Coriander seeds',500,'500 g',250,bb,'bb SUPER SAVER Coriander Seeds'),
 row('BigBasket','Cloves',1800,'50 g',90,bb,'bb SUPER SAVER Cloves'),
 row('BigBasket','Cumin seeds',1000,'200 g',200,bb,'bb SUPER SAVER Cumin Whole'),
 row('Blinkit','Ragi flour',88,'1 kg',88,'https://blinkit.com/prn/x/prid/781030','Whole Farm Premium Ragi Flour'),
 row('Blinkit','Masoor dal',115,'1 kg',115,'https://blinkit.com/prn/whole-farm-premium-masoor-dal/prid/531200','Whole Farm Premium Masoor Dal'),
 row('Blinkit','Toor dal',154,'1 kg',154,'https://blinkit.com/prn/whole-farm-grocery-toor-dal/prid/527579','Whole Farm Grocery Toor Dal'),
 row('Blinkit','Besan',114,'1 kg',114,'https://blinkit.com/cn/atta-rice-dal/besan-sooji-maida/cid/16/1166','Rajdhani Besan'),
 row('Blinkit','All-purpose flour',79,'1 kg',79,'https://blinkit.com/cn/atta-rice-dal/besan-sooji-maida/cid/16/1166','Rajdhani Maida'),
 row('Blinkit','Wheat flour',76,'1 kg',76,'https://blinkit.com/cn/grocery-staples/atta/cid/16/1165','Organic Tattva Wheat Atta'),
 row('Instamart','Masoor dal',109,'1 kg',109,im,'Supreme Harvest Masoor Dal Split'),
 row('Instamart','Ragi flour',78,'500 g',39,'https://instamart.in/p/supreme-harvest-ragi-flour-VOF8OSL26S','Supreme Harvest Ragi Flour'),
 row('Instamart','Moong dal',138,'500 g',69,im,'Supreme Harvest Moong Dal'),
 row('Instamart','Black channa',118,'500 g',59,im,'Tata Sampann Kala Chana'),
 row('Instamart','Toor dal',178,'500 g',89,im,'Supreme Harvest Toor Dal'),
 row('Instamart','Kabuli channa',138,'500 g',69,im,'Supreme Harvest Kabuli Chana'),
 row('Instamart','Whole green gram',158,'500 g',79,im,'Supreme Harvest Green Moong Whole'),
 row('Instamart','Sugar',71,'1 kg',71,im,'Supreme Harvest Crystal Sugar'),
 {...row('Instamart','Salt',25,'1 kg',25,im,'Aashirvaad Iodised Salt'),unit:'kg'},
 row('Instamart','Cumin seeds',420,'100 g',42,im,'Supreme Harvest Cumin Whole'),
 row('Instamart','Dried white peas',92,'500 g',46,im,'Supreme Harvest White Peas Dry'),
 row('Instamart','Turmeric powder',280,'100 g',28,im,'Aashirvaad Turmeric Powder'),
 row('Instamart','Rava',58,'500 g',29,im,'Supreme Harvest Suji Rawa'),
 row('Instamart','Whole masoor dal',143,'1 kg',143,im2,'Tata Sampann Kali Masoor Whole'),
 row('Instamart','Chana dal',134,'500 g',67,im2,'Tata Sampann Chana Dal'),
 row('Instamart','Peanuts',214,'500 g',107,im2,'Supreme Harvest Raw Peanuts')
];
const rejected=new Set(rejectedPairs);
const collected=[...manualPrices,...originalPrices,...scrapedPrices.filter(q=>!(/chewy|chewable|tablet/i.test(q.product))),...extraPrices].filter(q=>!rejected.has(q.name+'|'+q.url));
// Named representative variants for unspecified PDF ingredient names.
const aliases={'Ripe banana':'Robusta banana','Cooking oil (unspecified)':'Sunflower oil','White rice (unspecified)':'Sona Masuri rice (raw)','Raw rice (unspecified)':'Sona Masuri rice (raw)','Sona Masuri rice (unspecified)':'Sona Masuri rice (raw)','Green gram dal':'Moong dal'};
export const retailerPrices=[...collected,...Object.entries(aliases).flatMap(([name,variant])=>collected.filter(q=>q.name===variant).map(q=>({...q,name,product:q.product+' · reference variant: '+variant,source:q.source+' · '+variant+' reference'})))];
// Exactly one item per retailer / ingredient; preserve named variants and pack evidence.
const dairyAllowed=q=>!['Milk','Curd'].includes(q.name)||/nandini/i.test(q.product||'');
export function retailerQuote(retailer,name,unit,date){return retailerPrices.filter(r=>dairyAllowed(r)&&r.retailer===retailer&&r.name===name&&(!unit||r.unit===unit)&&r.observed<=date).sort((a,b)=>b.observed.localeCompare(a.observed)||verificationRank(b)-verificationRank(a)||a.price-b.price)[0]||null;}

export function otherQuote(name,unit,date){return retailerPrices.filter(r=>dairyAllowed(r)&&r.name===name&&(!unit||r.unit===unit)&&r.observed<=date).sort((a,b)=>b.observed.localeCompare(a.observed)||verificationRank(b)-verificationRank(a)||a.price-b.price)[0]||null;}

function verificationRank(q){return q.verification==='manual_product_page'?2:q.verification==='manual_search_result'?1:0;}
