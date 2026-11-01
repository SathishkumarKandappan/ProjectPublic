// Publicly listed pack prices observed 1 November 2026. Regional references
// retain their actual retailer and product; these are not Bangalore checkout quotes.
const quote=(retailer,name,unit,price,pack,packQuantity,url,product)=>({retailer,name,unit,price,pack,packQuantity,url,product,observed:'2026-11-01',source:retailer+' public listing'});
export const extraPrices=[
quote('BigBasket','Banana stem','piece',21.6,'1 piece',21.6,'https://www.bigbasket.com/pd/10000028/fresho-banana-stem-1-pc/','Fresho banana stem'),
quote('Thulam Foods','Sundakkai','packet',61.9,'100 g packet',61.9,'https://www.thulamfoods.com/products/tfg-sundakkai-vathal-100-gms/956287000005657305','Sundakkai Vathal · dried 100 g packet'),
quote('BigBasket','Taro leaves','piece',2.3,'10 leaves',23,'https://bbnow.bigbasket.com/pd/30002250/fresho-colocasia-leaf-10-pcs/','Fresho colocasia leaves'),
quote('Organic Mandya','Hyacinth beans','kg',135,'1 kg',135,'https://organicmandya.com/products/avarekai','Fresh Avarekai / Hyacinth beans'),
quote('BigBasket','Sev mixture','packet',46.75,'200 g packet',46.75,'https://bbsaathi.bigbasket.com/pd/263120/haldirams-namkeen-mixture-150-g-pouch/','Haldiram Mixture Namkeen · page shows 200 g'),
quote('Organic Grocer','Salem rice','kg',138,'1 kg',138,'https://www.organicgrocer.co.in/products/salem-sanna-boiled-rice','Salem Sanna boiled rice'),
quote('Saalas','Collard greens','kg',60,'500 g',30,'https://salasdaily.com/products/haakh','Haakh (backordered listing)'),
quote('Abhath Cart','Radish greens','kg',64,'250 g',16,'https://abhathcartindia.com/product/radish-leaves-250-g/','Radish leaves'),
quote('Pahadi Rasyan','Black soybeans','kg',350,'500 g',175,'https://www.pahadirasyan.com/category/Pulses%20And%20Lentils','Pahadi black beans / Kale Bhatt'),
quote('Zepto','Chickpea greens','kg',150,'1 kg',150,'https://www.zepto.com/pn/chana-saag-loose/pvid/195d45dd-69f5-4779-9db4-e308f8b752a8','Chana saag loose'),
quote('Zepto','Dried yellow peas','kg',70,'500 g',35,'https://www.zepto.com/pn/angur-yellow-peas/pvid/c09ba448-feeb-4df4-bcf7-8bbfdeb48d77','Angur yellow peas'),
quote('Gaavik','Ker berries','kg',1500,'100 g',150,'https://www.gaavik.com/products/dried-ker-or-authentic-rajasthani-desert-berry?variant=500g','Dried ker · displayed ₹150/100g'),
quote('Flipkart','Sangri beans','kg',2328,'250 g equivalent',582,'https://www.flipkart.com/brcart-sangri-dry-rajasthani-homemade-beans-thin-sangri-sukha-sabji/p/itm458512c04558f','BR CART dried sangri · displayed ₹582/250g'),
quote('1mg','Khar','kg',1790,'50 g',89.5,'https://www.1mg.com/otc/pro-to-grow-kola-khar-50gm-each-otc909292','Pro To Grow Kola Khar'),
quote('BigBasket','Ripe plantain','kg',127,'1 kg',127,'https://www.bigbasket.com/pd/10000346/fresho-banana-nendran-1-kg/','Fresho Nendran banana'),
quote('Blinkit','Bread rolls','piece',40/6,'6 pieces',40,'https://blinkit.com/prn/modern-wow-pav---6-pieces/prid/426652','Modern Wow Pav'),
quote('BigBasket','Bhajani flour','kg',196,'500 g',98,'https://www.bigbasket.com/pd/50000272/sakas-bhajni-thalipeeth-500-g-carton/','Sakas Thalipeeth Bhajni'),
quote('Zepto','Sattu','kg',140,'500 g',70,'https://www.zepto.com/pn/desi-choice-sattu-flour/pvid/e13d4312-dd80-4873-a7d6-74db0f13b5b3','Desi Choice Sattu flour')
];
