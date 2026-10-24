let connection;
function db(){return connection ||= new Promise((resolve,reject)=>{const r=indexedDB.open('papertrail-projects',1);r.onupgradeneeded=()=>r.result.createObjectStore('projects');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export async function loadProject(key){const store=(await db()).transaction('projects').objectStore('projects');return new Promise((resolve,reject)=>{const r=store.get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export async function saveProject(key,value){const database=await db();return new Promise((resolve,reject)=>{const tx=database.transaction('projects','readwrite');tx.objectStore('projects').put(value,key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}
