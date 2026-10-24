import {mkdir,copyFile,cp} from 'node:fs/promises';
await mkdir('public/vendor',{recursive:true});
for(const name of ['pdf.mjs','pdf.worker.mjs']) await copyFile(`node_modules/pdfjs-dist/build/${name}`,`public/vendor/${name}`);
console.log('Prepared browser PDF reader assets.');

for (const name of ['cmaps','standard_fonts','wasm']) await cp(`node_modules/pdfjs-dist/${name}`,`public/vendor/${name}`,{recursive:true});
