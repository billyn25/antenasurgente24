import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {districts} from '../config/madrid-districts.mjs';
import {version,sectionById} from './navigation.mjs';
import {verifyHomeOrder,slogan} from './residential.mjs';
const root='dist',report=JSON.parse(fs.readFileSync(path.join(root,'build-report.json'),'utf8'));
const file=u=>path.join(root,u==='/404.html'?'404.html':u==='/'?'index.html':u.slice(1)+'index.html');
const read=u=>fs.readFileSync(file(u),'utf8');
const pages=new Map(report.pages.map(p=>[p.url,p]));
assert.equal(pages.size,report.pages.length,'Rutas duplicadas');
assert.equal(report.navigation?.version,version);
assert.equal(report.pages.filter(p=>p.type==='district').length,21);
assert.equal(report.totalDistricts,21);
assert.equal(report.totalPages,report.totalTowns+49);
assert.equal(report.provinceCount,20);
assert.equal(report.pages.filter(p=>p.type==='town').length,report.totalTowns);
assert.equal(report.pages.filter(p=>p.type==='town'&&p.province==='madrid').length,179);
const titles=new Set(),descriptions=new Set(),inbound=new Map([...pages.keys()].map(u=>[u,0]));
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const ids=new Map();
for(const url of pages.keys())ids.set(url,[...read(url).matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
let stars=0,amplified=0,photoTowns=0,internalLinks=0;
for(const [url,p] of pages){
 const html=read(url);
 assert.equal((html.match(/<h1\b/g)||[]).length,1,url+': H1');
 assert.equal(new Set(ids.get(url)).size,ids.get(url).length,url+': IDs repetidos');
 assert(!titles.has(p.title),url+': title duplicado');titles.add(p.title);
 assert(!descriptions.has(p.description),url+': descripción duplicada');descriptions.add(p.description);
 assert(html.includes('<title>'+escape(p.title)+'</title>'),url+': title distinto del informe');
 assert(html.includes('rel="canonical" href="'+report.base+url+'"'),url+': canonical');
 assert(html.includes('name="robots" content="'+(p.noindex?'noindex,follow':'index,follow,max-image-preview:large')+'"'),url+': indexación alterada');
 assert(html.includes('navigation.css?v='+version),url+': estilos nuevos ausentes');
 assert(!/hero-obra\.webp|#ffcf35|aggregateRating|"@type":"Review"/.test(html),url+': regresión visual o reseñas ficticias');
 for(const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){
  const data=JSON.parse(m[1]);const webPage=data['@graph'].find(n=>n['@type']==='WebPage');assert.equal(webPage.url,report.base+url,url+': URL en datos estructurados');
 }
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const href=decode(match[1]);if(!href.startsWith('/')&&!href.startsWith('#'))continue;
  const target=new URL(href,report.base+url),pathname=decodeURIComponent(target.pathname);
  if(pathname.startsWith('/assets/')){assert(fs.existsSync(path.join(root,pathname)),url+': recurso roto '+pathname);continue;}
  assert(pages.has(pathname),url+': enlace roto '+pathname);inbound.set(pathname,inbound.get(pathname)+1);internalLinks++;
  if(target.hash)assert(ids.get(pathname).includes(decodeURIComponent(target.hash.slice(1))),url+': ancla rota '+href);
 }
 if(['town','district'].includes(p.type)){
  assert(html.includes('/assets/antena-televes-dat.png'),url+': falta foto de antena Televés');
  assert(html.includes('/assets/amplificador-monocanal-televes.png'),url+': falta amplificador');
  for(const service of ['antenas','porteros automáticos','videoporteros'])assert(html.includes('Técnico en instalación de '+service+' en '),url+': falta servicio '+service);
  const central=['madrid','toledo','guadalajara','cuenca'].includes(p.province),num=central?'614 789 945':'641 589 394';
  assert.equal(p.phone,num,url+': teléfono del informe');assert(html.includes('href="tel:+34'+num.replaceAll(' ','')+'"'),url+': enlace llamar');
  assert(html.includes('value="'+p.province+'" data-whatsapp="34'+num.replaceAll(' ','')+'" data-phone="'+num+'" selected'),url+': provincia/WhatsApp');
  if(p.type==='town')photoTowns++;
 }
 if(['home','town','district','service'].includes(p.type)){assert.equal((html.match(/class="commitment-star"/g)||[]).length,5,url+': confianza');stars++;}
 if(ids.get(url).includes('amplificacion')){const amp=sectionById(html,'amplificacion');for(const text of ['Previos','fuentes de alimentación','monocanal'])assert(amp.toLowerCase().includes(text.toLowerCase()),url+': amplificación incompleta');amplified++;}
}
for(const [url,p] of pages)if(['town','district','province','service'].includes(p.type))assert(inbound.get(url)>0,url+': huérfana');
const home=read('/');
assert.equal(decode(home.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)[1].replace(/<[^>]+>/g,'')).trim(),slogan,'Eslogan literal');
assert(home.includes('viviendas y comunidades'),'Público objetivo');
const homePhotos=[...home.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(m=>m[1]);assert.equal(homePhotos.length,5);assert.equal(new Set(homePhotos).size,5);
assert(!home.includes('class="town-preview"'),'Selección antigua de pocos pueblos');
assert.equal((home.match(/class="province-prefix"/g)||[]).length,20,'Provincias sin Antenista en');
assert(home.includes('data-location-finder'),'Buscador global ausente');
verifyHomeOrder(home);
const index=JSON.parse(fs.readFileSync(path.join(root,'assets/location-index.json'),'utf8'));
assert.equal(index.length,report.totalTowns+21);assert.equal(new Set(index.map(r=>r.url)).size,index.length);
for(const x of index)assert(pages.has(x.url),'Buscador enlaza una página inexistente');
for(const d of districts){
 for(const u of ['/', '/provincias/madrid/','/provincias/madrid/madrid/'])assert(read(u).includes('href="'+d.url+'"'),u+': distrito no enlazado '+d.name);
 const html=read(d.url);assert(html.includes('value="'+d.name+'" readonly'),'Distrito en WhatsApp '+d.name);
 for(const barrio of d.barrios)assert(html.includes(escape(barrio)),'Barrio ausente '+barrio);
 assert(html.includes('value="Madrid"'),'Madrid debe seguir siendo el municipio');
}
const urls=[];
for(const name of fs.readdirSync(path.join(root,'sitemaps')))for(const m of fs.readFileSync(path.join(root,'sitemaps',name),'utf8').matchAll(/<loc>(.*?)<\/loc>/g))urls.push(decode(m[1]));
assert.equal(new Set(urls).size,urls.length,'Duplicados en sitemaps');
const expected=report.pages.filter(p=>['home','service','province','town','district'].includes(p.type));assert.equal(urls.length,expected.length);
const sitemapSet=new Set(urls);for(const p of expected)assert(sitemapSet.has(report.base+p.url),'Falta en sitemap '+p.url);
assert.equal(amplified,report.totalTowns+23);assert.equal(photoTowns,report.totalTowns);
const result={version,pages:pages.size,towns:photoTowns,districts:21,sitemapUrls:urls.length,searchLocations:index.length,internalLinks,orphans:0,amplificationPages:amplified,confidenceSections:stars,homeOrder:['servicios','amplificacion','tipos-instalacion'],indexingChanged:false};
fs.writeFileSync(path.join(root,'navigation-audit.json'),JSON.stringify(result,null,2));
console.log('AUDITORÍA FINAL OK: '+JSON.stringify(result));
