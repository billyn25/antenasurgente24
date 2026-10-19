import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

export const version='starlink-norte-v1';
export const serviceUrl='/servicios/starlink/';
export const serviceName='Instalación de antenas Starlink';
export const photo='/assets/antena-starlink-standard.png';
export const photoSource='https://starlink.com/public-files/Starlink_Standard4_Hero_500x500.png';
export const supportSource='https://starlink.com/es/support/article/b9532240-605d-a5b5-4859-f558f1e0cc97';
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const decode=s=>s.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');
export const fileFor=(root,u)=>path.join(root,u==='/404.html'?'404.html':u==='/'?'index.html':u.slice(1)+'index.html');
export function one(html,old,next,label){assert.equal(html.split(old).length,2,'Plantilla inesperada: '+label);return html.replace(old,()=>next);}
export function section(html,id){
 const start=new RegExp('<section\\b[^>]*\\bid="'+id+'"[^>]*>').exec(html);assert(start,'Falta sección '+id);
 const tags=/<section\b[^>]*>|<\/section>/g;tags.lastIndex=start.index;let depth=0,m;
 while((m=tags.exec(html))){depth+=m[0].startsWith('</')?-1:1;if(!depth)return html.slice(start.index,tags.lastIndex);}
 throw Error('Sección incompleta '+id);
}
export const starlinkCard=()=>`<article class="service-card service-card-starlink" data-service="starlink"><a class="image-box" href="${serviceUrl}" aria-label="${serviceName}"><img src="${photo}" alt="Antena rectangular Starlink Standard con soporte" width="500" height="500" loading="lazy" decoding="async"></a><div class="card-body"><span class="card-number">05</span><h3>Antenas Starlink</h3><p>Instalación, montaje y puesta en marcha. Soportes, cableado y configuración Wi-Fi para viviendas y comunidades.</p><a class="text-link" href="${serviceUrl}">Instalación de Starlink ↗</a></div></article>`;
export function localStarlink(place=''){
 return `<section class="service-detail starlink-detail" id="starlink"><div><span class="kicker">05 / Internet por satélite</span><h2>${serviceName}${place?' en '+e(place):''}</h2><figure class="starlink-photo"><img src="${photo}" alt="Antena Starlink Standard para conexión a internet por satélite" width="500" height="500" loading="lazy" decoding="async"><figcaption>Starlink · Equipo de referencia</figcaption></figure><a class="text-link" href="${serviceUrl}">Ver instalación de Starlink ↗</a></div><div><p>Instalación de antenas Starlink para viviendas y comunidades: elección del emplazamiento, montaje del soporte, tendido del cable y puesta en marcha del equipo. Revisamos el kit disponible y el recorrido hasta el interior antes de preparar el trabajo.</p><p>Comprobamos la vista del cielo con la aplicación Starlink para evitar obstrucciones de árboles, edificios y otros elementos. El soporte y el procedimiento de alineación se eligen según el modelo de antena.</p><ul class="checklist"><li>Montaje en pared, mástil o cubierta con el soporte adecuado.</li><li>Paso del cable, fijación y protección de las entradas al inmueble.</li><li>Conexión del equipo, configuración Wi-Fi y comprobación de conexión.</li><li>En comunidades, coordinación del acceso y del recorrido por zonas comunes.</li></ul><p><strong>Para preparar la instalación:</strong> indica el modelo del kit, el lugar previsto y dónde necesitas la conexión. El montaje y la suscripción a internet son conceptos separados.</p></div></section>`;
}
export function prioritizeNorth(html){
 const old=/<a href="tel:\+34641589394"><small>Norte y Castilla y León<\/small><strong>641 589 394<\/strong><\/a>/;
 assert.equal((html.match(new RegExp(old.source,'g'))||[]).length,1,'Contacto Norte no reconocido');
 return html.replace(old,'<a class="contact-north" href="tel:+34641589394" aria-label="Llamar a Zona Norte y Castilla y León: 641 589 394"><small class="north-label">ZONA NORTE<span>CASTILLA Y LEÓN</span></small><strong>641 589 394</strong></a>');
}
function schema(html,mutate){return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(_,text)=>{const data=JSON.parse(text);mutate(data['@graph']||[]);return '<script type="application/ld+json">'+JSON.stringify(data).replace(/</g,'\\u003c')+'</script>';});}
export function transform(html,p){
 assert(!html.includes('name="starlink-version"'),'No ejecutar dos veces la ampliación Starlink');
 html=one(html,'</head>',`<link rel="stylesheet" href="/assets/starlink-norte.css?v=${version}"><meta name="starlink-version" content="${version}"></head>`,'estilos Starlink y Norte');
 if(p.type==='home'){
  html=prioritizeNorth(html);
  const block=section(html,'servicios');assert(block.endsWith('</div></section>'),'Cierre de las tarjetas no reconocido');
  assert.equal((block.match(/class="service-card(?: [^"]*)?"/g)||[]).length,4,'Faltan servicios de origen');
  html=one(html,block,block.slice(0,-'</div></section>'.length)+starlinkCard()+'</div></section>','quinta tarjeta');
  html=html.replace('Cuatro servicios para viviendas y comunidades','Cinco servicios para viviendas y comunidades');
  html=html.replace('Antenas, amplificación, porteros automáticos y videoporteros.<br>','Antenas, Starlink, amplificación, porteros automáticos y videoporteros.<br>');
 }
 if(['town','district'].includes(p.type)){
  const h1=html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/);assert(h1,'Falta H1 local');
  const place=decode(h1[1].replace(/<br\s*\/?\s*>/g,' ').replace(/<[^>]+>/g,'')).replace(/^Antenista en\s*/,'').replace(/\.$/,'').trim();
  const block=section(html,'videoporteros');html=one(html,block,block+localStarlink(place),'Starlink en ficha');
  const nav=html.match(/<nav class="local-nav"[\s\S]*?<\/nav>/);assert(nav,'Falta navegación local');
  html=one(html,nav[0],nav[0].replace('</nav>','<a href="#starlink">Antenas Starlink ↓</a></nav>'),'enlace local Starlink');
 }
 if(p.url==='/servicios/antenas/'){
  const marker='<section class="section wrap service-planning">';
  html=one(html,marker,'<div class="wrap">'+localStarlink()+'</div>'+marker,'Starlink en servicio de antenas');
 }
 if(html.includes('id="whatsapp-aviso"')){
  const marker='<option>Instalación de antenas</option>';
  html=one(html,marker,marker+`<option value="${serviceName}">${serviceName}</option>`,'Starlink en formulario');
 }
 html=one(html,'<dt>servicios técnicos</dt><dd>4</dd>','<dt>servicios técnicos</dt><dd>5</dd>','contador de servicios');
 const footer='<h3>Servicios</h3><div class="footer-links">';
 html=one(html,footer,footer+`<a href="${serviceUrl}">${serviceName}</a>`,'enlace del pie');
 html=html.replaceAll('Antenas, porteros, videoporteros y amplificación.','Antenas, porteros, videoporteros, amplificación y Starlink.');
 html=schema(html,graph=>{for(const n of graph)if(n['@type']==='Service'&&Array.isArray(n.serviceType)&&!n.serviceType.includes(serviceName))n.serviceType.push(serviceName);});
 return html;
}
export function servicePage(template,base){
 const title=serviceName+' para viviendas y comunidades';
 const description='Instalación de antenas Starlink: montaje, soportes, cableado y configuración Wi-Fi. Servicio técnico para viviendas y comunidades. Encuentra tu localidad.';
 const steps=[['Emplazamiento y soporte','Revisión del campo de visión y elección del punto de montaje. Comprobamos el modelo de kit y el soporte necesario para pared, mástil o cubierta.'],['Montaje y cableado','Fijación de la antena, recorrido del cable hasta el interior y protección de los pasos de entrada. El acceso y los materiales se concretan antes de instalar.'],['Configuración y comprobación','Conexión del equipo y configuración de la red Wi-Fi. Revisamos el estado y las obstrucciones en la aplicación, además de la conexión desde el dispositivo del cliente.']];
 let form=section(template,'contacto');
 form=one(form,`<option value="${serviceName}">`,`<option value="${serviceName}" selected>`,'formulario preseleccionado');
 const main=`<nav class="wrap" aria-label="Ruta de navegación"><ol class="breadcrumbs"><li><a href="/">Inicio</a></li><li> / <span aria-current="page">Antenas Starlink</span></li></ol></nav><section class="local-hero wrap starlink-hero"><div><span class="kicker">Internet por satélite · Viviendas y comunidades</span><h1>${serviceName}</h1><p class="lead">Montaje, cableado y puesta en marcha de tu equipo Starlink.</p><p>Una instalación preparada para tu vivienda: desde elegir el emplazamiento hasta configurar la conexión Wi-Fi. También coordinamos montajes en edificios y zonas comunes.</p><div class="actions"><a class="btn btn-dark" href="#contacto">Solicitar instalación ↗</a><a class="text-link" href="/#provincias">Encontrar mi localidad ↗</a></div></div><figure class="starlink-photo"><img src="${photo}" alt="Antena Starlink Standard con soporte para internet por satélite" width="500" height="500" fetchpriority="high" decoding="async"><figcaption>Starlink · Equipo de referencia</figcaption></figure></section><section class="section wrap starlink-work"><span class="kicker">Un montaje de principio a fin</span><h2>Qué incluye la instalación.</h2><div class="planning-grid">${steps.map(([h,t],i)=>`<article><span class="property-label">0${i+1}</span><h3>${h}</h3><p>${t}</p></article>`).join('')}</div></section><section class="section wrap"><div class="property-grid residential-properties"><article><h2>Para tu vivienda.</h2><p>Chalets, casas de pueblo, pisos y segundas residencias. Indica dónde tienes el kit y en qué parte de la vivienda necesitas internet para preparar el soporte y el recorrido del cable.</p></article><article><h2>Para tu comunidad.</h2><p>Coordinamos el acceso a cubierta, el punto de fijación y el recorrido por zonas comunes con el responsable de la comunidad. La distribución entre varias viviendas se estudia y presupuesta por separado.</p></article></div></section><section class="section wrap faq-wrap"><h2>Antes de instalar Starlink.</h2><div class="faq"><details><summary>¿Tengo que disponer del kit y de la suscripción?</summary><p>Indica si ya tienes el equipo y qué modelo es. El presupuesto de montaje se separa del kit y de la suscripción de internet, que se gestiona con Starlink.</p></details><details><summary>¿Puede instalarse en cualquier lugar del tejado?</summary><p>Primero revisamos las obstrucciones y la superficie de fijación. Árboles, edificios y otros obstáculos pueden afectar a la conexión; el emplazamiento se comprueba con la aplicación Starlink.</p></details><details><summary>¿También configuráis el Wi-Fi?</summary><p>La puesta en marcha incluye la configuración de la red del equipo y una comprobación de conexión. Las ampliaciones de cobertura Wi-Fi o el cableado de una red adicional se valoran según la vivienda.</p></details></div><p class="starlink-source">Información del equipo: <a href="${supportSource}" target="_blank" rel="noopener noreferrer">soportes y montaje de Starlink</a>.</p></section>`+section(template,'confianza')+form;
 let html=template.replace(/<main id="contenido">[\s\S]*?<\/main>/,()=>'<main id="contenido">'+main+'</main>');
 html=html.replace(/<title>[\s\S]*?<\/title>/,()=>'<title>'+e(title)+'</title>');
 for(const [key,value] of [['name="description"',description],['property="og:title"',title],['property="og:description"',description],['property="og:url"',base+serviceUrl],['property="og:image"',base+photo]])html=html.replace(new RegExp('<meta '+key+' content="[^"]*">'),()=>'<meta '+key+' content="'+e(value)+'">');
 html=html.replace(/<link rel="canonical" href="[^"]*">/,()=>'<link rel="canonical" href="'+base+serviceUrl+'">');
 html=schema(html,graph=>{
  for(let i=graph.length-1;i>=0;i--)if(graph[i]['@type']==='Service')graph.splice(i,1);
  for(const n of graph){if(n['@type']==='WebPage')Object.assign(n,{'@id':base+serviceUrl+'#pagina',url:base+serviceUrl,name:title,description});if(n['@type']==='BreadcrumbList')n.itemListElement=[['Inicio','/'],['Antenas Starlink',serviceUrl]].map(([name,u],i)=>({'@type':'ListItem',position:i+1,name,item:base+u}));}
  const org=graph.find(n=>n['@type']==='Organization');
  graph.push({'@type':'Service',name:serviceName,serviceType:serviceName,url:base+serviceUrl,provider:{'@id':org?.['@id']||base+'/#empresa'}});
 });
 return {html,page:{url:serviceUrl,title,description,type:'service',noindex:html.includes('name="robots" content="noindex,follow"')}};
}
export function validatePhoto(data){
 assert(data.length>1000&&data.length<4000000,'Tamaño de foto Starlink incorrecto');
 assert.equal(data.subarray(0,8).toString('hex'),'89504e470d0a1a0a','Starlink no devuelve una foto PNG');
 const width=data.readUInt32BE(16),height=data.readUInt32BE(20);assert(width>=100&&height>=100&&width<=4096&&height<=4096,'Dimensiones Starlink inválidas');
 return {width,height,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')};
}
async function preparePhoto(root){
 const local='src/media/antena-starlink-standard.png';let data,source=photoSource;
 if(fs.existsSync(local))data=fs.readFileSync(local);
 else for(const url of [photoSource,'https://starlink.com/public-files/Starlink_Standard_Hero_500x500.png']){
  try{const r=await fetch(url,{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error('HTTP '+r.status);data=Buffer.from(await r.arrayBuffer());validatePhoto(data);source=url;break;}catch(error){data=null;console.log('Foto Starlink: '+error.message);}
 }
 assert(data,'No se publicará Starlink sin fotografía válida');const meta=validatePhoto(data);
 fs.writeFileSync(path.join(root,photo),data);return {...meta,source};
}
export async function apply(root='dist'){
 const reportPath=path.join(root,'build-report.json'),report=JSON.parse(fs.readFileSync(reportPath,'utf8'));
 assert(!report.starlink,'El build ya incluye Starlink');assert(!report.pages.some(p=>p.url===serviceUrl),'La ruta Starlink ya existe');
 const baseAudit=JSON.parse(fs.readFileSync(path.join(root,'navigation-audit.json'),'utf8'));assert.equal(baseAudit.orphans,0,'La base debe superar su auditoría');
 const media=await preparePhoto(root);fs.copyFileSync('src/starlink-norte.css',path.join(root,'assets/starlink-norte.css'));
 for(const p of report.pages){const f=fileFor(root,p.url);fs.writeFileSync(f,transform(fs.readFileSync(f,'utf8'),p));}
 const service=servicePage(fs.readFileSync(fileFor(root,'/servicios/porteros/'),'utf8'),report.base);
 fs.mkdirSync(path.dirname(fileFor(root,serviceUrl)),{recursive:true});fs.writeFileSync(fileFor(root,serviceUrl),service.html);report.pages.push(service.page);report.totalPages=report.pages.length;
 const principal=path.join(root,'sitemaps/principal.xml');const xml=fs.readFileSync(principal,'utf8');assert(xml.includes('</urlset>'),'Sitemap principal no reconocido');
 fs.writeFileSync(principal,xml.replace('</urlset>','<url><loc>'+e(report.base+serviceUrl)+'</loc></url></urlset>'));
 report.serviceFooter.services=5;report.serviceFooter.serviceOrder.push('starlink');report.presentation.homePhotos=6;
 report.focus.homeSectionOrder=['servicios (cinco tarjetas)','tipos-instalacion','confianza'];
 report.starlink={version,serviceUrl,localPages:report.totalTowns+report.totalDistricts,services:5,northPhone:'641 589 394',centralPhone:'614 789 945',photo:media};
 fs.writeFileSync(reportPath,JSON.stringify(report,null,2));
 console.log('STARLINK Y NORTE OK: 5 servicios, '+report.starlink.localPages+' fichas con Starlink, página propia y foto verificada; Zona Norte y Castilla y León destacadas.');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await apply();
