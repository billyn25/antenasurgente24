import fs from 'node:fs';
import path from 'node:path';
import site from '../config/site.json' with {type:'json'};
const out='dist',errors=[];
const assert=(ok,msg)=>{if(!ok)errors.push(msg)};
const pages=['/','/servicios/antenas/','/servicios/porteros/','/servicios/videoporteros/'];
for(const url of pages){
 const file=path.join(out,url==='/'?'index.html':url.slice(1)+'index.html');
 assert(fs.existsSync(file),'Página ausente: '+url);
 if(!fs.existsSync(file))continue;
 const html=fs.readFileSync(file,'utf8');
 assert((html.match(/<h1\b/g)||[]).length===1,url+': debe tener un H1');
 assert(html.includes('name="robots" content="noindex,nofollow"'),url+': noindex de prepublicación');
 assert(html.includes('href="/assets/styles.css"'),url+': CSS ausente');
 assert(html.includes('tel:+34641589394'),url+': teléfono habitual ausente');
 assert(html.includes('Urgencias 24'),url+': urgencias ausentes');
}
const home=fs.readFileSync(path.join(out,'index.html'),'utf8');
for(const s of site.services)assert(home.includes('href="/servicios/'+s.id+'/"'),'Servicio no enlazado: '+s.id);
for(const brand of [...site.antennaBrands,...site.doorphoneBrands])assert(home.includes(brand),'Marca ausente: '+brand);
assert(!site.launchReady,'No activar indexación antes de completar datos de producción');
assert(fs.readFileSync(path.join(out,'robots.txt'),'utf8').includes('Disallow: /'),'Prepublicación sin bloqueo');
assert(fs.existsSync(path.join(out,'assets/styles.css')),'CSS no generado');
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('AUDITORÍA OK: 4 páginas, 3 servicios, marcas, enlaces, responsive CSS y protección noindex.');
