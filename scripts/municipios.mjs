import fs from 'node:fs';

// Fuente versionada: el listado administrativo no es prueba de cobertura comercial.
export const source='https://raw.githubusercontent.com/codeforspain/ds-organizacion-administrativa/1e9c99280ef4d7a12def33cafc3df59d9fc1f688/data/municipios.json';
export const specs=[
 ['01','alava','Álava',51],['33','asturias','Asturias',78],['05','avila','Ávila',248],['48','bizkaia','Bizkaia',113],
 ['09','burgos','Burgos',371],['39','cantabria','Cantabria',102],['16','cuenca','Cuenca',238],['20','gipuzkoa','Gipuzkoa',88],
 ['19','guadalajara','Guadalajara',288],['26','la-rioja','La Rioja',174],['24','leon','León',211],['28','madrid','Madrid',179],
 ['31','navarra','Navarra',272],['34','palencia','Palencia',191],['37','salamanca','Salamanca',362],['40','segovia','Segovia',209],
 ['42','soria','Soria',183],['45','toledo','Toledo',204],['47','valladolid','Valladolid',225],['49','zamora','Zamora',248]
];
export const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function displayName(s){return s.replace(/\\\//g,'/').replace(/^(.+), (El|La|Los|Las)$/,'$2 $1').replace(/\//g,' / ');}
export async function loadTowns(){
 let rows;
 if(process.env.MUNICIPIOS_FILE){rows=JSON.parse(fs.readFileSync(process.env.MUNICIPIOS_FILE,'utf8'));}
 else {
  let failure;
  for(let attempt=0;attempt<3;attempt++){
   try{const response=await fetch(source,{signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error('HTTP '+response.status);rows=await response.json();break;}
   catch(e){failure=e;await new Promise(r=>setTimeout(r,500*(attempt+1)));}
  }
  if(!rows)throw Error('No se pudo descargar el censo fijado. Se cancela el build sin publicar una web incompleta: '+failure);
 }
 if(!Array.isArray(rows))throw Error('Formato de censo incorrecto');
 const fixture=process.env.LOCAL_FIXTURE==='1';
 if(fixture&&(process.env.NETLIFY||process.env.GITHUB_ACTIONS))throw Error('Los datos de prueba nunca se publican');
 const provinces=specs.map(([code,id,name,expected])=>{
  const towns=rows.filter(x=>x.provincia_id===code).map(x=>({code:x.municipio_id,name:displayName(x.nombre),slug:slug(displayName(x.nombre))})).sort((a,b)=>a.name.localeCompare(b.name,'es'));
  if(!fixture&&towns.length!==expected)throw Error(`${name}: ${towns.length} municipios, se esperaban ${expected}; revisar el censo antes de publicar`);
  if(!towns.length)throw Error('Provincia vacía: '+name);
  if(new Set(towns.map(t=>t.slug)).size!==towns.length)throw Error('URL municipal duplicada: '+name);
  return {code,id,name,expected,towns};
 });
 return {provinces,fixture};
}
