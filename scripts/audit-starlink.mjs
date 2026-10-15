import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {version,serviceUrl,serviceName,photo,fileFor,section,decode,validatePhoto} from './starlink.mjs';
const root='dist',report=JSON.parse(fs.readFileSync(path.join(root,'build-report.json'),'utf8'));
const pages=new Map(report.pages.map(p=>[p.url,p])),read=u=>fs.readFileSync(fileFor(root,u),'utf8');
assert.equal(report.starlink?.version,version);assert.equal(pages.size,report.totalPages);assert.equal(report.totalPages,report.totalTowns+50);
assert.equal(report.totalTowns,4035);assert.equal(report.totalDistricts,21);assert.equal(report.provinceCount,20);assert.equal(report.serviceFooter.services,5);
assert.equal(report.pages.filter(p=>p.type==='district').length,21);assert.equal(report.pages.filter(p=>p.type==='town').length,4035);assert.equal(report.pages.filter(p=>p.type==='town'&&p.province==='madrid').length,179);
assert(pages.has(serviceUrl));validatePhoto(fs.readFileSync(path.join(root,photo)));
const ids=new Map(),titles=new Set(),descriptions=new Set(),inbound=new Map([...pages.keys()].map(u=>[u,0]));
for(const u of pages.keys())ids.set(u,[...read(u).matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
let links=0,starlinkLocals=0,forms=0,stars=0,amplified=0;
for(const [u,p] of pages){
 const html=read(u),heading=html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)||[];
 assert.equal(heading.length,1,u+': H1');assert.equal(new Set(ids.get(u)).size,ids.get(u).length,u+': IDs duplicados');
 assert(!titles.has(p.title),u+': título duplicado');titles.add(p.title);assert(!descriptions.has(p.description),u+': descripción duplicada');descriptions.add(p.description);
 assert.equal(decode(html.match(/<title>([\s\S]*?)<\/title>/)[1]),p.title,u+': título');
 assert(html.includes('rel="canonical" href="'+report.base+u+'"'),u+': canonical');
 assert(html.includes('name="robots" content="'+(p.noindex?'noindex,follow':'index,follow,max-image-preview:large')+'"'),u+': indexación');
 assert(html.includes('starlink-norte.css?v='+version),u+': estilos nuevos');
 assert(!/hero-obra\.webp|#ffcf35|aggregateRating|"@type":"Review"/.test(html),u+': regresión');
 assert(html.includes('<dt>servicios técnicos</dt><dd>5</dd>'),u+': contador de servicios');
 const footer=section(html,'cobertura');assert(html.indexOf(footer)>html.indexOf('<footer'),u+': mapa fuera del pie');
 assert.equal((footer.match(/<li><a href="\/provincias\//g)||[]).length,20,u+': provincias en mapa');
 for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){
  const data=JSON.parse(match[1]),node=data['@graph'].find(n=>n['@type']==='WebPage');assert.equal(node.url,report.base+u,u+': WebPage');
  for(const n of data['@graph'].filter(n=>n['@type']==='Service'))assert(n.serviceType===serviceName||n.serviceType.includes(serviceName),u+': Starlink en Service');
 }
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const href=decode(m[1]);if(!href.startsWith('/')&&!href.startsWith('#'))continue;const target=new URL(href,report.base+u),pathname=decodeURIComponent(target.pathname);
  if(pathname.startsWith('/assets/')){assert(fs.existsSync(path.join(root,pathname)),u+': recurso roto '+pathname);continue;}
  assert(pages.has(pathname),u+': enlace roto '+pathname);inbound.set(pathname,inbound.get(pathname)+1);links++;
  if(target.hash)assert(ids.get(pathname).includes(decodeURIComponent(target.hash.slice(1))),u+': ancla rota '+href);
 }
 if(['town','district'].includes(p.type)){
  assert(html.includes('Instalación de antenas Starlink en '),u+': encabezado Starlink');assert(section(html,'starlink').includes(photo),u+': foto Starlink');
  assert(html.includes('href="#starlink"'),u+': enlace Starlink');
  for(const asset of ['antena-televes-dat.png','amplificador-monocanal-televes.png'])assert(html.includes('/assets/'+asset),u+': foto técnica perdida');
  for(const term of ['antenas','porteros automáticos','videoporteros'])assert(html.includes('Técnico en instalación de '+term+' en '),u+': servicio perdido');
  const central=['madrid','toledo','guadalajara','cuenca'].includes(p.province),number=central?'614 789 945':'641 589 394';
  assert.equal(p.phone,number);assert(html.includes('href="tel:+34'+number.replaceAll(' ','')+'"'),u+': llamada');
  assert(html.includes('value="'+p.province+'" data-whatsapp="34'+number.replaceAll(' ','')+'" data-phone="'+number+'" selected'),u+': formulario provincial');
  if(p.type==='district')assert(html.includes('name="distrito"')&&html.includes('value="Madrid"'),u+': distrito/municipio');
  starlinkLocals++;
 }
 if(html.includes('id="whatsapp-aviso"')){assert(html.includes('value="'+serviceName+'"'),u+': servicio en WhatsApp');forms++;}
 if(['home','service','town','district'].includes(p.type)){assert.equal((html.match(/class="commitment-star"/g)||[]).length,5,u+': estrellas');stars++;}
 if(ids.get(u).includes('amplificacion')){const amp=section(html,'amplificacion').toLowerCase();for(const term of ['previos','fuentes de alimentación','monocanal'])assert(amp.includes(term),u+': amplificación');amplified++;}
}
for(const [u,p] of pages)if(!['legal','404'].includes(p.type))assert(inbound.get(u)>0,u+': página huérfana');
const home=read('/'),cards=section(home,'servicios');assert.equal((cards.match(/class="service-card(?: [^"]*)?"/g)||[]).length,5);
assert.deepEqual([...cards.matchAll(/class="card-number">(\d\d)<\/span>/g)].map(m=>m[1]),['01','02','03','04','05']);
assert(home.includes(section(home,'tipos-instalacion')+section(home,'confianza')),'Las estrellas deben quedar después de viviendas/comunidades');
assert.equal(decode(home.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)[1].replace(/<[^>]+>/g,'')).trim(),'Profesional en antenas cerca de tu localidad');
assert(home.includes('class="contact-north"'));assert(home.includes('ZONA NORTE<span>CASTILLA Y LEÓN</span>'));assert(home.includes('tel:+34614789945'));
assert(!/La inclusión en el directorio no confirma disponibilidad|Cada provincia abre su listado completo por orden alfabético/.test(home),'No recuperar textos retirados');
const photos=[...home.split('</main>')[0].matchAll(/<img[^>]+src="([^"]+)"/g)].map(m=>m[1]);assert.equal(photos.length,6);assert.equal(new Set(photos).size,6);
assert.equal((home.match(/class="province-prefix"/g)||[]).length,20);assert(home.includes('data-location-finder'));
const index=JSON.parse(fs.readFileSync(path.join(root,'assets/location-index.json'),'utf8'));assert.equal(index.length,4056);assert.equal(new Set(index.map(x=>x.url)).size,index.length);for(const item of index)assert(pages.has(item.url));
const urls=[];for(const name of fs.readdirSync(path.join(root,'sitemaps')))for(const m of fs.readFileSync(path.join(root,'sitemaps',name),'utf8').matchAll(/<loc>(.*?)<\/loc>/g))urls.push(decode(m[1]));
const expected=report.pages.filter(p=>['home','service','province','town','district'].includes(p.type)),urlSet=new Set(urls);assert.equal(urlSet.size,urls.length);assert.equal(urls.length,expected.length);for(const p of expected)assert(urlSet.has(report.base+p.url),'Falta sitemap '+p.url);
assert.equal(starlinkLocals,4056);assert.equal(amplified,4058);assert.equal((fs.readFileSync(path.join(root,'assets/cobertura-espana.svg'),'utf8').match(/data-province=/g)||[]).length,20);
assert(read(serviceUrl).includes('value="'+serviceName+'" selected'),'Starlink preseleccionado');
const summary={version,pages:pages.size,services:5,towns:4035,districts:21,starlinkLocalPages:starlinkLocals,sitemapUrls:urls.length,searchLocations:index.length,internalLinks:links,orphans:0,forms,confidenceSections:stars,footerMaps:pages.size,northHighlighted:true,indexingChanged:false};
fs.writeFileSync(path.join(root,'starlink-audit.json'),JSON.stringify(summary,null,2));
const prior=JSON.parse(fs.readFileSync(path.join(root,'navigation-audit.json'),'utf8'));Object.assign(prior,summary,{homeOrder:['antenas','porteros','videoporteros','amplificacion','starlink']});fs.writeFileSync(path.join(root,'navigation-audit.json'),JSON.stringify(prior,null,2));
console.log('AUDITORÍA FINAL STARLINK OK: '+JSON.stringify(summary));
