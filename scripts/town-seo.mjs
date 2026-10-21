/** Final local-service improvements. Same routes, titles, photos and regional contacts. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {section,decode,fileFor} from './starlink.mjs';
import {localProfiles,localContentFor} from './local-content.mjs';
export const VERSION='pueblos-servicios-breves-v2';
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=v=>JSON.stringify(v).replace(/</g,'\\u003c');
const digest=s=>createHash('sha256').update(s).digest('hex');
const marker=`data-town-seo="${VERSION}"`;
export const repairs=[
 {id:'antenas',request:'Reparación de antenas TDT y parabólicas',guide:'/servicios/antenas/#diagnostico-senal',label:'Diagnóstico de antenas sin señal'},
 {id:'amplificacion',request:'Reparación de previos y fuentes de alimentación',guide:'/servicios/antenas/#amplificacion',label:'Revisión de amplificadores y cabeceras'},
 {id:'porteros',request:'Reparación de porteros automáticos',guide:'/servicios/porteros/#diagnostico-portero',label:'Portero sin llamada, audio o apertura'},
 {id:'videoporteros',request:'Reparación de videoporteros',guide:'/servicios/videoporteros/#diagnostico-videoportero',label:'Videoportero sin imagen o con averías'}
];
export const CSS=`
/* Local service actions are normal document content, never fixed-height masthead navigation. */
.local-service-brief .actions.town-seo-actions{display:flex;flex-wrap:wrap;align-items:flex-start;align-content:flex-start;justify-content:flex-start;gap:12px 20px;width:100%;height:auto;min-height:0;position:static;margin:18px 0 0;padding:0}
.local-service-brief .town-seo-actions>a{display:inline-flex;align-items:center;min-height:44px;max-width:100%;min-width:0;line-height:1.5;white-space:normal;overflow-wrap:anywhere;padding:7px 0}
.local-service-brief .town-seo-actions>.local-guide-link{flex-basis:100%;font-size:.9rem}
.town-seo-guide{scroll-margin-top:130px}.town-seo-guide .property-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.town-seo-guide article{min-width:0;overflow-wrap:anywhere}.town-seo-guide h3{font-size:1.12rem;line-height:1.4;margin:0 0 12px}.town-seo-guide article p{font-size:.95rem;line-height:1.65}
@media(max-width:760px){.town-seo-guide .property-grid{grid-template-columns:minmax(0,1fr)}.local-service-brief .town-seo-actions{column-gap:18px}}
`;
const guide=(id,title,items,closing)=>`<section class="section wrap town-seo-guide" id="${id}" data-town-guide="${VERSION}"><span class="kicker">Diagnóstico antes de sustituir</span><h2>${title}</h2><div class="property-grid">${items.map(([h,p])=>`<article><h3>${h}</h3><p>${p}</p></article>`).join('')}</div><p>${closing}</p></section>`;
export const guides={
 '/servicios/antenas/':guide('diagnostico-senal','Reparación de antenas TDT: falta de señal y canales que se cortan',[
  ['Solo falla un televisor o una vivienda','Indica qué tomas funcionan y cuáles no, sin desmontarlas. La revisión distingue el receptor y sus conexiones de la distribución de la vivienda. Este dato ayuda a preparar el diagnóstico, pero no permite asegurar la causa por teléfono.'],
  ['El problema afecta a varios vecinos','Comunica cuántas viviendas están afectadas y quién puede facilitar acceso a los equipos comunes. El técnico revisa recepción, alimentación, amplificación y distribución antes de proponer una reparación de la antena colectiva.'],
  ['Faltan algunos canales o hay pixelaciones','Anota los canales afectados y cuándo empezó. Medir nivel y calidad permite orientar la revisión; aumentar la amplificación sin diagnóstico no es una solución universal. Si sospechas interferencias móviles, consulta también los recursos oficiales de esta página.']
 ],'Antes de aceptar la visita, concreta desplazamiento, diagnóstico, materiales, mano de obra e impuestos. No subas al tejado ni abras fuentes o equipos alimentados para preparar el aviso. <a class="text-link" href="https://www.televes.com/es/soporte/faqs/?cat%5B%5D=5" target="_blank" rel="noopener noreferrer">Referencia técnica de Televés sobre amplificación</a>.'),
 '/servicios/porteros/':guide('diagnostico-portero','Reparación de porteros automáticos: distinguir qué función falla',[
  ['No llama o no se oye','Describe por separado la llamada y la conversación en ambos sentidos. Indica si el problema ocurre en un solo telefonillo o en varios; no es necesario abrir el equipo para comunicarlo.'],
  ['No abre la puerta','Explica si se recibe llamada y si se escucha conversación aunque no abra. La apertura, la placa, la alimentación y el terminal se revisan según los síntomas, sin atribuir siempre el fallo al telefonillo.'],
  ['Sustituir un telefonillo antiguo','La elección depende del sistema, no solo de la apariencia. Fermax advierte que un terminal digital VDS no se sustituye por un universal analógico 4+N. El profesional debe verificar compatibilidad antes de instalar el recambio.']
 ],'Indica marca y referencia únicamente si puedes verlas sin desmontar nada. <a class="text-link" href="https://soporte.fermax.com/portal/es/kb/articles/como-conecto-mi-tel%C3%A9fono-de-3-hilos-al-tel%C3%A9fono-universal" target="_blank" rel="noopener noreferrer">Información de compatibilidad del fabricante Fermax</a>. Consulta el alcance de la reparación antes de aceptar la sustitución de toda la instalación.'),
 '/servicios/videoporteros/':guide('diagnostico-videoportero','Reparación de videoporteros: imagen, llamada, sonido y apertura',[
  ['Se recibe llamada, pero no hay imagen','Indica si la pantalla se enciende, si se oye y si permite abrir. Separar las funciones ayuda a preparar la revisión de monitor, placa, alimentación y conexiones. No demuestra por sí solo que haya que sustituir la cámara.'],
  ['Solo falla un monitor','Aclara si hay otros monitores y si también fallan. No compres un recambio por su aspecto: hay que comprobar la referencia y la compatibilidad con el sistema compartido.'],
  ['Renovar la instalación de una comunidad','Distingue entre reparar un terminal y renovar placa y monitores. El presupuesto debe aclarar los equipos, trabajos de cableado, alimentación y puesta en funcionamiento que incluye.']
 ],'Para preparar la consulta, facilita el número de viviendas y la marca visible del equipo. No se puede prometer conservar el cableado o mezclar modelos sin revisar la instalación. <a class="text-link" href="/#provincias">Encuentra tu pueblo y el contacto de su zona</a>.')
};
function updateDescription(html,p,description){
 html=html.replace(/<meta name="description" content="[^"]*">/,()=>`<meta name="description" content="${escape(description)}">`);
 html=html.replace(/<meta property="og:description" content="[^"]*">/,()=>`<meta property="og:description" content="${escape(description)}">`);
 return html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,(_,a,b,c)=>{
  const data=JSON.parse(b);for(const node of data['@graph']||[]){if(node['@type']==='WebPage')node.description=description;if(node['@type']==='Service'&&node.url?.endsWith(p.url))node.serviceType=['Instalación y reparación de antenas TDT y parabólicas','Amplificadores y cabeceras','Porteros automáticos','Videoporteros','Instalación de Starlink',...localContentFor(p.url).specialties.map(s=>s.request)];}return a+json(data)+c;
 });
}
export function transform(html,p,provinceName){
 const local=['town','district'].includes(p.type);
 if(!local&&!guides[p.url])return {html,description:p.description};
 if(html.includes(marker))return {html,description:p.description};
 const before=html;
 let description=p.description;
 if(local){
  const name=decode(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<br\s*\/?>/gi,' ').replace(/<[^>]+>/g,'')||'').replace(/^Antenista en\s*/,'').replace(/\.$/,'').trim();
  assert(name&&provinceName&&p.phone,'Identificación local incompleta');
  description=`Instalación y reparación de antenas, porteros y videoporteros en ${name}${p.type==='district'?'':', '+provinceName}. Viviendas, comunidades y locales. Consulta: ${p.phone}.`;
  html=updateDescription(html,p,description);
  for(const service of repairs){
   const old=section(html,service.id);assert(old.includes('local-service-brief'));
   assert.equal((old.match(/data-request-service=/g)||[]).length,1);
   const updated=old.replace('class="actions"','class="actions town-seo-actions"')
    .replace('Consultar este servicio ↗','Consultar instalación ↗')
    .replace(/(<a class="local-guide-link" href=")[^"]*(">)[\s\S]*?(<\/a>)/,()=>`<a class="text-link" href="#contacto" data-request-service="${service.request}">Consultar reparación ↗</a><a class="local-guide-link" href="${service.guide}">${service.label} ↗</a>`);
   assert.equal((updated.match(/data-request-service=/g)||[]).length,2);html=html.replace(old,()=>updated);
  }
  const budget=/<summary>¿Qué incluye el presupuesto\?<\/summary><p>[\s\S]*?<\/p>/;
  if(!html.includes('data-local-faq')){
   if(p.type==='town')assert(budget.test(html),'Falta respuesta de presupuesto '+p.url);
   html=html.replace(budget,'<summary>¿Qué incluye el presupuesto?</summary><p>Solicita que se concreten diagnóstico, materiales, mano de obra, desplazamiento, impuestos y posibles suplementos. El precio depende de la instalación y del trabajo acordado. Confirma las condiciones antes de aceptar la visita y cualquier reparación adicional.</p>');
  }
 }else{
  const contact=section(html,'contacto');html=html.replace(contact,()=>guides[p.url]+contact);
 }
 html=html.replace('<main ',`<main ${marker} `);
 for(const re of [/<title>[\s\S]*?<\/title>/g,/<h1\b[^>]*>[\s\S]*?<\/h1>/g,/<link rel="canonical"[^>]*>/g,/<meta name="robots"[^>]*>/g,/<img\b[^>]*>/g,/<header\b[^>]*>[\s\S]*?<\/header>/g,/<footer\b[^>]*>[\s\S]*?<\/footer>/g,/<form\b[^>]*>[\s\S]*?<\/form>/g,/<script src=[^>]*>[\s\S]*?<\/script>/g,/<a\b[^>]*href="(?:tel:|https:\/\/wa.me\/)[^"]*"[^>]*>[\s\S]*?<\/a>/g])assert.deepEqual([...html.matchAll(re)].map(m=>m[0]),[...before.matchAll(re)].map(m=>m[0]),p.url+': cambio fuera de alcance');
 if(localProfiles[p.url])assert(html.includes(section(before,'direccion-local')),p.url+': contexto documentado alterado');
 return {html,description};
}
function allFiles(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?allFiles(path.join(dir,e.name)):[path.join(dir,e.name)]);}
export function audit(root='dist',requireBoost=true){
 const report=JSON.parse(fs.readFileSync(root+'/build-report.json','utf8'));
 const byRoute=new Map(report.pages.map(p=>[p.url,p]));const titleMap=new Map(),descriptionMap=new Map(),ids=new Map(),adj=new Map(),read=u=>fs.readFileSync(fileFor(root,u),'utf8');
 for(const p of report.pages)ids.set(p.url,new Set([...read(p.url).matchAll(/\bid="([^"]*)"/g)].map(m=>m[1])));
 const summary={version:VERSION,mode:report.publicBuild?'production':'preview',generatedPages:byRoute.size,towns:0,districts:0,serviceGuides:0,duplicateTitles:0,duplicateDescriptions:0,brokenLinks:0,orphanTowns:0,repairSelections:0,documentedLocalProfiles:Object.keys(localProfiles).length,ok:false};
 let links=0;
 for(const p of report.pages){
  const html=read(p.url),title=decode(html.match(/<title>([\s\S]*?)<\/title>/)[1]),desc=decode(html.match(/name="description" content="([^"]*)"/)[1]);
  assert(!titleMap.has(title),'Título duplicado '+p.url);titleMap.set(title,p.url);assert(!descriptionMap.has(desc),'Descripción duplicada '+p.url);descriptionMap.set(desc,p.url);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.equal(decode(html.match(/rel="canonical" href="([^"]*)"/)[1]),report.base+p.url);
  assert.equal(html.match(/name="robots" content="([^"]*)"/)[1],p.noindex?'noindex,follow':'index,follow,max-image-preview:large');
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  if(requireBoost)assert.equal(graph.find(n=>n['@type']==='WebPage').description,desc,'Descripción schema '+p.url);
  const edges=new Set();for(const [,link] of html.matchAll(/href="([^"<>]*)"/g)){
   const href=decode(link);if(!href.startsWith('/')&&!href.startsWith('#'))continue;const target=new URL(href,report.base+p.url),route=decodeURIComponent(target.pathname);
   if(route.startsWith('/assets/')){assert(fs.existsSync(path.join(root,route)),route);continue;}
   assert(byRoute.has(route),p.url+': enlace roto '+href);if(target.hash)assert(ids.get(route).has(decodeURIComponent(target.hash.slice(1))),p.url+': ancla rota '+href);edges.add(route);links++;
  }adj.set(p.url,edges);
  if(['town','district'].includes(p.type)){
   summary[p.type==='town'?'towns':'districts']++;
   const num=['madrid','guadalajara','toledo','cuenca'].includes(p.province)?'34614789945':'34641589394';
   assert.equal(p.phone.replaceAll(' ',''),num.slice(2));assert(html.includes(`href="tel:+${num}"`));
   for(const s of ['antenas','amplificacion','porteros','videoporteros','starlink'])assert(ids.get(p.url).has(s));
   if(requireBoost){assert(html.includes(marker));assert.equal((html.match(/data-request-service=/g)||[]).length,11);for(const s of repairs){assert(html.includes(`data-request-service="${s.request}"`));assert(html.includes(`href="${s.guide}"`));summary.repairSelections++;}assert(!html.includes('trabajo acordado; </p>'));}
  }
  if(guides[p.url]&&requireBoost){summary.serviceGuides++;assert(html.includes('data-town-guide="'+VERSION+'"'));}
 }
 const depth=new Map([['/',0]]),queue=['/'];for(let i=0;i<queue.length;i++)for(const target of adj.get(queue[i])||[]){if(!depth.has(target)){depth.set(target,depth.get(queue[i])+1);queue.push(target);}}
 const towns=report.pages.filter(p=>p.type==='town');summary.maxTownClicks=Math.max(...towns.map(p=>depth.get(p.url)??Infinity));assert(summary.maxTownClicks<=2,'Municipios sin acceso en dos clics');
 const urls=[];for(const file of allFiles(root+'/sitemaps'))for(const [,u] of fs.readFileSync(file,'utf8').matchAll(/<loc>([^<]+)<\/loc>/g))urls.push(decode(u));
 assert.equal(urls.length,4081);assert.equal(new Set(urls).size,urls.length);for(const p of report.pages.filter(p=>!['legal','404'].includes(p.type)))assert(urls.includes(report.base+p.url));
 assert.equal(summary.towns,4035);assert.equal(summary.districts,21);assert.equal(summary.generatedPages,4085);
 summary.sitemapUrls=urls.length;summary.internalLinks=links;summary.townsWithoutDocumentedLocalProfile=summary.towns-summary.documentedLocalProfiles;summary.ok=true;return summary;
}
export function build(root='dist'){
 const reportPath=root+'/build-report.json',report=JSON.parse(fs.readFileSync(reportPath,'utf8'));if(report.townSEO){assert.equal(report.townSEO.version,VERSION);return audit(root);}
 const provinces=new Map(report.counts.map(p=>[p.province.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-'),p.province]));
 const protectedFiles=allFiles(root).filter(f=>/\.xml$|\/(robots\.txt|_headers|_redirects)$/.test(f));const hashes=new Map(protectedFiles.map(f=>[f,digest(fs.readFileSync(f))]));
 const oldCSS=report.closure.css,styles=fs.readFileSync(root+'/assets/'+oldCSS,'utf8')+'\n'+CSS,newCSS='site-'+digest(styles).slice(0,12)+'.css';
 const results=report.pages.map(p=>({p,...transform(fs.readFileSync(fileFor(root,p.url),'utf8'),p,provinces.get(p.province))}));
 fs.writeFileSync(root+'/assets/'+newCSS,styles);
 for(const result of results){result.p.description=result.description;fs.writeFileSync(fileFor(root,result.p.url),result.html.replaceAll('/assets/'+oldCSS,'/assets/'+newCSS));}
 report.closure.css=newCSS;report.townSEO={version:VERSION,towns:4035,districts:21,repairActions:16224,guides:3,urlsChanged:false};fs.writeFileSync(reportPath,JSON.stringify(report,null,2));
 for(const [f,h] of hashes)assert.equal(digest(fs.readFileSync(f)),h,'Rastreo modificado '+f);
 const summary=audit(root);summary.crawlFilesUnchanged=hashes.size;summary.checkedAt=new Date().toISOString();fs.mkdirSync('browser-artifacts',{recursive:true});fs.writeFileSync('browser-artifacts/town-seo-build-'+summary.mode+'.json',JSON.stringify(summary,null,2));console.log('SEO PUEBLOS OK:',JSON.stringify(summary));return summary;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){if(process.argv.includes('--audit'))console.log(JSON.stringify(audit(),null,2));else build();}
