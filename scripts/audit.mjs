import fs from 'node:fs';
import path from 'node:path';
import {slogan,version,validatePng} from './residential.mjs';
const root='dist',errors=[];
const check=(ok,msg)=>{if(!ok)errors.push(msg);};
const report=JSON.parse(fs.readFileSync(path.join(root,'build-report.json'),'utf8'));
const routes=new Set(report.pages.map(p=>p.url));
const titles=new Set(),descriptions=new Set(),inbound=new Map([...routes].map(u=>[u,0]));
let links=0,stars=0,townPhotos=0,ampPages=0;
const read=p=>fs.readFileSync(path.join(root,p==='/404.html'?'404.html':p==='/'?'index.html':p.slice(1)+'index.html'),'utf8');
for(const p of report.pages){
 const html=read(p.url),ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 check(new Set(ids).size===ids.length,p.url+': IDs duplicados');
 check((html.match(/<h1\b/g)||[]).length===1,p.url+': H1 único');
 check(!titles.has(p.title),p.url+': title duplicado');titles.add(p.title);
 check(!descriptions.has(p.description),p.url+': descripción duplicada');descriptions.add(p.description);
 check(html.includes('rel="canonical" href="'+report.base+p.url+'"'),p.url+': canonical incorrecto');
 check(html.includes('name="robots" content="'+(p.noindex?'noindex,follow':'index,follow,max-image-preview:large')+'"'),p.url+': robots incoherente');
 for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){try{JSON.parse(match[1]);}catch{errors.push(p.url+': JSON-LD inválido');}}
 for(const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)){
  const target=match[1];if(target.startsWith('/assets/')){check(fs.existsSync(path.join(root,target)),p.url+': recurso roto '+target);continue;}
  check(routes.has(target),p.url+': enlace roto '+target);if(inbound.has(target))inbound.set(target,inbound.get(target)+1);links++;
 }
 for(const match of html.matchAll(/href="#([^"?]+)"/g))check(ids.includes(match[1]),p.url+': ancla ausente '+match[1]);
 if(p.type==='town'){
  for(const service of ['antenas','porteros automáticos','videoporteros'])check(html.includes('Técnico en instalación de '+service+' en '),p.url+': servicio ausente '+service);
  const central=['madrid','toledo','guadalajara','cuenca'].includes(p.province);
  check(p.phone===(central?'614 789 945':'641 589 394'),p.url+': teléfono incorrecto');
  check(html.includes('value="'+p.province+'" data-whatsapp="'+(central?'34614789945':'34641589394')+'" data-phone="'+p.phone+'" selected'),p.url+': WhatsApp provincial incorrecto');
  check(html.includes('Tu aviso, bien definido.'),p.url+': contenido municipal ausente');
  const images=[...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m=>m[1]);
  check(images.filter(src=>src==='/assets/antena-televes-dat.png').length===1,p.url+': falta una foto de antena Televés');townPhotos++;
  check(html.includes('href="#amplificacion"'),p.url+': amplificación no enlazada');
 }
 if(p.type==='home'||p.type==='town'||p.url==='/servicios/antenas/'){
  check(ids.includes('amplificacion'),p.url+': bloque de amplificación ausente');ampPages++;
  for(const text of ['Instalación nueva','Previos y fuentes de alimentación','Monocanales para comunidades','Reparación de amplificadores','/assets/amplificador-monocanal-televes.png'])check(html.includes(text),p.url+': falta '+text);
 }
 if(['home','town','service'].includes(p.type)){
  check(html.includes('id="confianza"'),p.url+': sección de confianza ausente');
  check((html.match(/class="commitment-star"/g)||[]).length===5,p.url+': deben existir cinco compromisos con estrellas');stars++;
 }
 if(['home','town','service','province'].includes(p.type)){
  check(html.includes('Servicios para viviendas y comunidades'),p.url+': destinatarios no destacados');
  check(html.includes('name="inmueble" required'),p.url+': selector vivienda/comunidad ausente');
  check(html.includes('Instalación nueva de sistemas de amplificación'),p.url+': consulta de amplificación ausente');
  check(!/negocio|NEGOCIOS/.test(html),p.url+': enfoque residual en negocios');
 }
 check(!/aggregateRating|"@type":"Review"/.test(html),p.url+': valoraciones no verificadas');
 check(!/hero-obra\.webp|btn-yellow|#ffcf35/i.test(html),p.url+': imagen o amarillo retirados siguen presentes');
 check(html.includes('styles.css?v=azul-confianza-v1'),p.url+': falta estilo base');
 check(html.includes('residential.css?v='+version),p.url+': falta versión residencial anticaché');
}
for(const p of report.pages.filter(p=>p.type==='town'))check(inbound.get(p.url)>0,p.url+': municipio huérfano');
const home=read('/');
for(const n of ['641 589 394','614 789 945'])check(home.includes(n),'Portada sin teléfono '+n);
const photos=[...home.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m=>m[1]);
check(photos.length===5&&new Set(photos).size===5,'Portada: deben ser 5 fotos distintas, sin repetir');
check(!fs.existsSync(path.join(root,'assets/hero-obra.webp')),'La foto retirada no debe publicarse');
check(!home.includes('data:image/'),'Fotos de relleno no permitidas');
const h1=(home.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
check(h1===slogan,'El eslogan debe coincidir exactamente con el solicitado');
check(!home.includes('Señal clara.'),'Eslogan antiguo presente');
for(const id of ['tipos-instalacion','galeria','presupuesto','amplificacion'])check(home.includes('id="'+id+'"'),'Sección ausente: '+id);
const css=fs.readFileSync(path.join(root,'assets/styles.css'),'utf8');
check(!/#ffcf35|#f7f5ee|btn-yellow/i.test(css),'CSS conserva amarillo o crema');
check(css.includes('--accent:#245bdb'),'Paleta azul ausente');
check(!fs.readFileSync(path.join(root,'assets/favicon.svg'),'utf8').includes('#ffcf35'),'Favicon amarillo');
for(const item of report.focus?.media||[]){try{const actual=validatePng(fs.readFileSync(path.join(root,'assets',item.name)),item.name);check(actual.sha256===item.sha256,'Imagen distinta de la validada: '+item.name);}catch(err){errors.push(String(err));}}
check(report.focus?.media?.length===2,'Faltan las dos fotos verificadas');
const sitemapFiles=fs.readdirSync(path.join(root,'sitemaps')),sitemapUrls=[];
for(const name of sitemapFiles){const xml=fs.readFileSync(path.join(root,'sitemaps',name),'utf8');for(const match of xml.matchAll(/<loc>(.*?)<\/loc>/g))sitemapUrls.push(match[1]);}
check(new Set(sitemapUrls).size===sitemapUrls.length,'URLs de sitemap duplicadas');
const expected=report.pages.filter(p=>['home','service','province','town'].includes(p.type));
check(expected.length===sitemapUrls.length,'Sitemaps incompletos');const sitemapSet=new Set(sitemapUrls);
for(const p of expected)check(sitemapSet.has(report.base+p.url),'URL ausente en sitemap '+p.url);
check(report.provinceCount===20,'Faltan provincias');if(!report.fixture)check(report.totalTowns===4035,'Censo: se esperaban 4035 municipios');
check(report.totalPages===report.totalTowns+28,'Número de páginas inesperado');
check(townPhotos===report.totalTowns,'Fotos municipales incompletas');check(ampPages===report.totalTowns+2,'Páginas de amplificación incompletas');
check(!fs.readFileSync(path.join(root,'robots.txt'),'utf8').includes('Disallow: /'),'robots.txt impide leer noindex');
check(report.presentation?.version==='azul-confianza-v1','Falta la fase editorial');check(report.focus?.version===version,'Falta la fase residencial');
check(report.focus?.slogan===slogan,'Eslogan incorrecto en informe');
if(errors.length){console.error(errors.slice(0,60).join('\n'));console.error('Errores totales: '+errors.length);process.exit(1);}
console.log(`AUDITORÍA OK: ${report.totalPages} páginas; ${links} enlaces; ${sitemapUrls.length} URLs en sitemaps; 0 municipios huérfanos; ${townPhotos} fichas con antena Televés; ${ampPages} páginas con amplificación y foto; eslogan literal; viviendas/comunidades destacadas; ${stars} secciones de confianza. Contactos y SEO conservados. ${report.fixture?'DATOS DE PRUEBA, NO PUBLICABLES.':''}`);
