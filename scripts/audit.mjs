import fs from 'node:fs';
import path from 'node:path';
const root='dist',errors=[];
const check=(ok,msg)=>{if(!ok)errors.push(msg);};
const report=JSON.parse(fs.readFileSync(path.join(root,'build-report.json'),'utf8'));
const routes=new Set(report.pages.map(p=>p.url));
const titles=new Set();const descriptions=new Set();let links=0;const inbound=new Map([...routes].map(u=>[u,0]));
const read=p=>fs.readFileSync(path.join(root,p==='/404.html'?'404.html':p==='/'?'index.html':p.slice(1)+'index.html'),'utf8');
for(const p of report.pages){
 const html=read(p.url);
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
 if(p.type==='town'){
  check(html.includes('Técnico en instalación de antenas en '),p.url+': servicio de antenas ausente');
  check(html.includes('Técnico en instalación de porteros automáticos en '),p.url+': servicio de porteros ausente');
  check(html.includes('Técnico en instalación de videoporteros en '),p.url+': servicio de videoporteros ausente');
  const central=['madrid','toledo','guadalajara','cuenca'].includes(p.province);check(p.phone===(central?'614 789 945':'641 589 394'),p.url+': teléfono incorrecto');
  check(html.includes('value="'+p.province+'" data-whatsapp="'+(central?'34614789945':'34641589394')+'" data-phone="'+p.phone+'" selected'),p.url+': WhatsApp provincial incorrecto');
 }
 check(!html.includes('aggregateRating'),p.url+': valoraciones no verificadas');
}
for(const p of report.pages.filter(p=>p.type==='town'))check(inbound.get(p.url)>0,p.url+': municipio huérfano');
const home=read('/');
for(const n of ['641 589 394','614 789 945'])check(home.includes(n),'Portada sin teléfono '+n);
const photos=[...home.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m=>m[1]);check(photos.length===5&&new Set(photos).size===5,'Portada: deben ser 5 fotos distintas, sin repetir');
check(!home.includes('data:image/'),'Fotos de relleno no permitidas');
const sitemapFiles=fs.readdirSync(path.join(root,'sitemaps'));const sitemapUrls=[];
for(const name of sitemapFiles){const xml=fs.readFileSync(path.join(root,'sitemaps',name),'utf8');for(const match of xml.matchAll(/<loc>(.*?)<\/loc>/g))sitemapUrls.push(match[1]);}
check(new Set(sitemapUrls).size===sitemapUrls.length,'URLs de sitemap duplicadas');
const expected=report.pages.filter(p=>['home','service','province','town'].includes(p.type));
check(expected.length===sitemapUrls.length,'Sitemaps incompletos');
for(const p of expected)check(sitemapUrls.includes(report.base+p.url),'URL ausente en sitemap '+p.url);
check(report.provinceCount===20,'Faltan provincias');
if(!report.fixture)check(report.totalTowns===4035,'Censo completo: se esperaban 4035 municipios');
check(report.totalPages===report.totalTowns+28,'Número de páginas inesperado');
check(!fs.readFileSync(path.join(root,'robots.txt'),'utf8').includes('Disallow: /'),'robots.txt impide leer noindex');
if(errors.length){console.error(errors.slice(0,60).join('\n'));console.error('Errores totales: '+errors.length);process.exit(1);}
console.log(`AUDITORÍA OK: ${report.totalPages} páginas, ${links} enlaces, ${sitemapUrls.length} URLs en sitemaps, 0 municipios huérfanos; teléfonos, 3 servicios locales, JSON-LD, canonicals e imágenes comprobados. ${report.fixture?'DATOS DE PRUEBA LOCALES, NO PUBLICABLES.':''}`);
