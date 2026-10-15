import fs from 'node:fs';
import path from 'node:path';
import {slogan} from './presentation.mjs';
const root='dist',errors=[];
const check=(ok,msg)=>{if(!ok)errors.push(msg);};
const report=JSON.parse(fs.readFileSync(path.join(root,'build-report.json'),'utf8'));
const routes=new Set(report.pages.map(p=>p.url));
const titles=new Set(),descriptions=new Set(),inbound=new Map([...routes].map(u=>[u,0]));
let links=0,stars=0;
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
  check(html.includes('Tu aviso, bien definido.'),p.url+': contenido municipal nuevo ausente');
 }
 if(['home','town','service'].includes(p.type)){
  check(html.includes('id="confianza"'),p.url+': sección de confianza ausente');
  check((html.match(/class="commitment-star"/g)||[]).length===5,p.url+': deben existir cinco compromisos con estrellas');stars++;
 }
 check(!/aggregateRating|"@type":"Review"/.test(html),p.url+': valoraciones no verificadas');
 check(!/hero-obra\.webp|btn-yellow|#ffcf35/i.test(html),p.url+': imagen o amarillo retirados siguen presentes');
 check(html.includes('styles.css?v=azul-confianza-v1'),p.url+': falta versión CSS anticaché');
}
for(const p of report.pages.filter(p=>p.type==='town'))check(inbound.get(p.url)>0,p.url+': municipio huérfano');
const home=read('/');
for(const n of ['641 589 394','614 789 945'])check(home.includes(n),'Portada sin teléfono '+n);
const photos=[...home.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m=>m[1]);
check(photos.length===4&&new Set(photos).size===4,'Portada: deben ser 4 fotos distintas, sin repetir');
check(!fs.existsSync(path.join(root,'assets/hero-obra.webp')),'La foto retirada no debe publicarse');
check(!home.includes('data:image/'),'Fotos de relleno no permitidas');
const homeHeading=home.match(/<h1>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
check(homeHeading===slogan,'Eslogan solicitado ausente o alterado');
check(report.presentation?.slogan===slogan,'El informe no coincide con el eslogan publicado');
check(home.includes('<p class="lead">Antenas, porteros automáticos<br>y videoporteros.</p>'),'Los tres servicios bajo el eslogan deben conservarse');
for(const id of ['tipos-instalacion','galeria','presupuesto'])check(home.includes('id="'+id+'"'),'Sección nueva ausente: '+id);
const css=fs.readFileSync(path.join(root,'assets/styles.css'),'utf8');
check(!/#ffcf35|#f7f5ee|btn-yellow/i.test(css),'CSS conserva amarillo o crema');
check(css.includes('--accent:#245bdb'),'Paleta azul ausente');
check(!fs.readFileSync(path.join(root,'assets/favicon.svg'),'utf8').includes('#ffcf35'),'Favicon amarillo');
const sitemapFiles=fs.readdirSync(path.join(root,'sitemaps')),sitemapUrls=[];
for(const name of sitemapFiles){const xml=fs.readFileSync(path.join(root,'sitemaps',name),'utf8');for(const match of xml.matchAll(/<loc>(.*?)<\/loc>/g))sitemapUrls.push(match[1]);}
check(new Set(sitemapUrls).size===sitemapUrls.length,'URLs de sitemap duplicadas');
const expected=report.pages.filter(p=>['home','service','province','town'].includes(p.type));
check(expected.length===sitemapUrls.length,'Sitemaps incompletos');
const sitemapSet=new Set(sitemapUrls);
for(const p of expected)check(sitemapSet.has(report.base+p.url),'URL ausente en sitemap '+p.url);
check(report.provinceCount===20,'Faltan provincias');
if(!report.fixture)check(report.totalTowns===4035,'Censo: se esperaban 4035 municipios');
check(report.totalPages===report.totalTowns+28,'Número de páginas inesperado');
check(!fs.readFileSync(path.join(root,'robots.txt'),'utf8').includes('Disallow: /'),'robots.txt impide leer noindex');
check(report.presentation?.version==='azul-confianza-v1','Falta la fase editorial');
if(errors.length){console.error(errors.slice(0,60).join('\n'));console.error('Errores totales: '+errors.length);process.exit(1);}
console.log(`AUDITORÍA OK: ${report.totalPages} páginas, ${links} enlaces, ${sitemapUrls.length} URLs en sitemaps, 0 municipios huérfanos. ${stars} páginas con 5 compromisos, 4 fotos distintas en portada, foto rechazada eliminada, paleta azul, eslogan nuevo y contactos/SEO conservados. ${report.fixture?'DATOS DE PRUEBA, NO PUBLICABLES.':''}`);
