// Illustrative quantities for ten side/snack portions, not a prescribed school menu.
const ingredient=(name,quantity,unit='kg')=>({name,quantity,unit});
export const recipes=[
 {id:'ash-kootu',type:'Curry',name:'Ash gourd & moong dal kootu',ingredients:[ingredient('Ash gourd',1),ingredient('Moong dal',.25),ingredient('Coconut',.5,'piece')],method:'Cook the dal and ash gourd until soft; finish with ground coconut and a mild tempering.',tags:['Coconut']},
 {id:'potato-curry',type:'Curry',name:'Potato & tomato curry',ingredients:[ingredient('Potato',1),ingredient('Tomato',.4)],method:'Cook potato cubes in a mild tomato gravy. Keep chilli low and serve with rice or roti.',tags:[]},
 {id:'bottle-kootu',type:'Curry',name:'Bottle gourd dal',ingredients:[ingredient('Bottle gourd',1),ingredient('Toor dal',.25)],method:'Simmer peeled bottle gourd with cooked dal; add a light tempering.',tags:[]},
 {id:'mor-kootan',type:'Curry',name:'Ash gourd mor kootan',ingredients:[ingredient('Ash gourd',1),ingredient('Curd',.4,'litre'),ingredient('Coconut',.5,'piece')],method:'Cook ash gourd, add a coconut paste, then stir in curd over gentle heat.',tags:['Milk','Coconut']},
 {id:'spinach-dal',type:'Curry',name:'Spinach dal',ingredients:[ingredient('Spinach',.6),ingredient('Toor dal',.3),ingredient('Tomato',.2)],method:'Cook washed spinach with dal and tomato until soft; finish with a mild tempering.',tags:[]},
 {id:'potato-palya',type:'Palya',name:'Simple potato palya',ingredients:[ingredient('Potato',1.2)],method:'Steam potatoes, then toss with a light mustard-and-curry-leaf tempering.',tags:[]},
 {id:'cabbage-palya',type:'Palya',name:'Cabbage & coconut palya',ingredients:[ingredient('Cabbage',1.2),ingredient('Coconut',.25,'piece')],method:'Finely shred cabbage, cook briefly until tender, and finish with grated coconut.',tags:['Coconut']},
 {id:'beet-palya',type:'Palya',name:'Beetroot palya',ingredients:[ingredient('Beetroot',1),ingredient('Coconut',.25,'piece')],method:'Steam diced beetroot, then toss with tempering and a little grated coconut.',tags:['Coconut']},
 {id:'carrot-cabbage',type:'Palya',name:'Carrot & cabbage palya',ingredients:[ingredient('Carrot',.5),ingredient('Cabbage',.8),ingredient('Coconut',.25,'piece')],method:'Cook finely chopped carrot and cabbage together; finish with coconut.',tags:['Coconut']},
 {id:'beans-potato',type:'Palya',name:'Beans & potato palya',ingredients:[ingredient('French beans',.8),ingredient('Potato',.4),ingredient('Coconut',.25,'piece')],method:'Steam chopped beans and potato, then toss with a mild tempering and coconut.',tags:['Coconut']},
 {id:'upma',type:'Snack',name:'Vegetable rava upma',ingredients:[ingredient('Rava',.6),ingredient('Carrot',.2),ingredient('Cabbage',.2)],method:'Roast rava, soften finely chopped vegetables, and cook together with hot water.',tags:['Wheat']},
 {id:'avalakki',type:'Snack',name:'Lemon avalakki',ingredients:[ingredient('Poha',.5),ingredient('Lemon',1,'piece')],method:'Soften poha and toss with a light tempering; add lemon juice at the end.',tags:[]},
 {id:'sundal',type:'Snack',name:'Black channa sundal',ingredients:[ingredient('Black channa',.5),ingredient('Coconut',.25,'piece')],method:'Soak channa ahead, cook until very soft, then toss with coconut and a mild tempering.',tags:['Coconut']},
 {id:'dhokla',type:'Snack',name:'Steamed rava dhokla',ingredients:[ingredient('Rava',.5),ingredient('Curd',.2,'litre'),ingredient('ENO',.5,'packet')],method:'Mix rava and curd with water, rest, add fruit salt just before steaming, and steam until cooked.',tags:['Wheat','Milk']},
 {id:'red-idli',type:'Snack',name:'Red rice vegetable idli',ingredients:[ingredient('Red rice',.4),ingredient('Urad dal',.1),ingredient('Carrot',.1)],method:'Soak, grind and ferment rice-and-urad batter ahead; fold in grated carrot and steam.',tags:[]}
];
export function recommendRecipes(getPrice,{portions=10,type='All',exclude=''}={}){
 const excluded=exclude.toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);
 const scored=recipes.filter(r=>(type==='All'||r.type===type)&&!excluded.some(token=>[r.name,...r.tags,...r.ingredients.map(i=>i.name)].some(s=>s.toLowerCase().includes(token)))).map(r=>{
   const ingredients=r.ingredients.map(i=>{const quote=getPrice(i);const quantity=i.quantity*portions/10;return {...i,quantity,quote,cost:quote?quantity*quote.price:null};});
   const missing=ingredients.filter(i=>i.cost===null).length;const subtotal=ingredients.reduce((s,i)=>s+(i.cost??0),0);
   return {...r,ingredients,missing,subtotal,perPortion:subtotal/portions,portions,projected:ingredients.some(i=>i.quote?.projection),undated:ingredients.some(i=>i.quote&&!i.quote.date),old:ingredients.some(i=>i.quote?.old)};
 });
 for(const category of ['Curry','Palya','Snack']){
   const group=scored.filter(r=>r.type===category).sort((a,b)=>a.missing-b.missing||a.perPortion-b.perPortion);
   const complete=group.filter(r=>r.missing===0);group.forEach((r,i)=>{r.rank=i+1;r.groupSize=group.length;r.tone=r.missing?'neutral':r===complete[0]?'cheap':r===complete.at(-1)&&complete.length>1?'expensive':'neutral';});
 }
 return scored.sort((a,b)=>['Curry','Palya','Snack'].indexOf(a.type)-['Curry','Palya','Snack'].indexOf(b.type)||a.rank-b.rank);
}
