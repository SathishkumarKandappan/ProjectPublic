import {writeFileSync} from 'node:fs';
import {supplierSeed} from '../supplier-seed.js';
import {pdfRates} from '../pdf-rates.js';
import {retailerPrices} from '../retailers.js';
// Keep source observation dates. Exporting/reloading never makes a quote newer.
for(const [file,quotes] of [['supplier.json',[...supplierSeed,...pdfRates]],['retailer-prices.json',retailerPrices]]){
 writeFileSync(new URL('../'+file,import.meta.url),JSON.stringify({quotes},null,2)+'\n');
}
