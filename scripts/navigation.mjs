import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import site from '../config/site.json' with {type:'json'};
import {districts,source} from '../config/madrid-districts.mjs';

export const version='movil-directorio-madrid-v1';
const cityUrl='/provincias/madrid/madrid/';
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=s=>s.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const phone=central=>{const number=central?site.centralPhone:site.primaryPhone;return {number,tel:'+34'+number.replace(/\D/g,''),wa:'34'+number.replace(/\D/g,'')};};
const north=phone(false),center=phone(true);
function one(html,old,next,label){if(html.split(old).length!==2)throw Error('Plantilla inesperada: '+label);return html.replace(old,next);}
// Extract a complete section, respecting nested sections instead of cutting at the first closing tag.
export function sectionById(html,id){
 const start=new RegExp('<section\\b[^>]*\\bid="'+id+'"[^>]*>').exec(html);
 if(!start)throw Error('Sección ausente: '+id);
 const tags=/<section\b[^>]*>|<\/section>/g;tags.lastIndex=start.index;let depth=0,match;
 while((match=tags.exec(html))){depth+=match[0].startsWith('</')?-1:1;if(depth===0)return html.slice(start.index,tags.lastIndex);}
 throw Error('Sección sin cierre: '+id);
}
export function districtDirectory(compact=false,exclude=''){
 const rows=districts.filter(d=>d.slug!==exclude);
 const listing='<ul class="district-grid">'+rows.map(d=>`<li><a href="${d.url}">Antenista en ${e(d.name)} ↗</a></li>`).join('')+'</ul>';
 const title=exclude?'Otros distritos de Madrid capital':'Madrid capital: sus 21 distritos';
 return `<section class="madrid-districts" id="distritos-madrid">${compact?`<details><summary>${title} · Ver todos</summary><p>Son distritos de la ciudad, no municipios de la provincia.</p>${listing}</details>`:`<h2>${title}</h2><p>Antenas, amplificación, porteros y videoporteros para viviendas y comunidades. Selecciona el distrito de tu dirección en Madrid capital.</p>${listing}`}</section>`;
}
export function homeHero(){
 return `<section class="intro-home wrap" aria-labelledby="home-heading"><div class="intro-copy"><span class="kicker">Servicio técnico · Viviendas y comunidades</span><h1 class="residential-slogan" id="home-heading">Profesional en antenas <span class="highlight">cerca de tu localidad</span></h1><p class="lead">Antenas, amplificación, porteros y videoporteros.<br>Instalación y reparación para <strong>viviendas y comunidades</strong>.</p></div><figure class="intro-visual"><img src="/assets/antena-televes-dat.png" alt="Antena Televés DAT BOSS para recepción de televisión TDT" width="800" height="800" fetchpriority="high" decoding="async"><span class="intro-badge">24 horas · 365 días</span><figcaption>Antena Televés · Imagen de catálogo</figcaption></figure><div class="intro-contacts" id="telefonos-zonas"><p>Habla con el contacto de tu zona</p><div class="intro-phone-grid"><a href="tel:${north.tel}"><small>Norte y otras provincias</small><strong>${e(north.number)}</strong></a><a href="tel:${center.tel}"><small>Madrid y zona centro</small><strong>${e(center.number)}</strong></a></div><p class="contact-fineprint">Centro: Madrid, Toledo, Guadalajara y Cuenca. Disponibilidad y desplazamiento a confirmar.</p></div><div class="intro-actions"><a class="btn btn-dark" href="#provincias">Buscar mi pueblo ↗</a><a class="text-link" href="#servicios">Ver servicios ↓</a></div></section>`;
}
function finder(report){
 return `<div class="location-finder" data-location-finder><h3>Busca un municipio o un distrito de Madrid</h3><p>El buscador consulta el directorio completo, no una selección de pueblos destacados.</p><div class="finder-fields"><label>Provincia<select name="zona"><option value="">Todas las provincias</option>${report.counts.map(p=>`<option value="${slug(p.province)}">${e(p.province)}</option>`).join('')}</select></label><label>Nombre del pueblo o distrito<input type="search" name="localidad" placeholder="Escribe tu localidad" autocomplete="off" aria-describedby="location-status"></label></div><div class="finder-help"><p id="location-status" class="finder-status" role="status">${report.totalTowns.toLocaleString('es-ES')} municipios y ${districts.length} distritos de Madrid. Escribe al menos dos letras.</p><a data-browse-province href="/#provincias">Ver todas las provincias ↓</a></div><ul class="finder-results" hidden></ul><noscript><p>Entra en tu provincia para ver todos sus municipios. Los distritos de Madrid también están enlazados debajo.</p></noscript></div>`;
}
export function enhanceDirectory(html,report){
 if(!html.includes('<div class="province-grid">'))return html;
 let count=0;
 html=html.replace(/(<a href="\/provincias\/([a-z-]+)\/">)<strong>([^<]+)<\/strong><small>([^<]+)<\/small>/g,(_,a,id,name,total)=>{
  count++;return `${a}<strong><span class="province-prefix">Antenista en</span> ${name}</strong><small>${total}${id==='madrid'?' · 21 distritos':' · Ver pueblos'}</small>`;
 });
 if(count!==report.provinceCount)throw Error('No se han etiquetado todas las provincias: '+count);
 html=one(html,'<div class="province-grid">',finder(report)+'<div class="province-grid">','buscador territorial');
 const samples=/<div class="town-preview">[\s\S]*?<\/div>/g;
 if([...html.matchAll(samples)].length!==1)throw Error('La selección antigua de pueblos no es única');
 html=html.replace(samples,'<p class="directory-note">Cada provincia abre su listado completo por orden alfabético. Madrid capital tiene, además, su propio directorio de distritos.</p>'+districtDirectory(true));
 return html.replace('Tu servicio empieza en tu pueblo.','Encuentra tu pueblo.');
}
function districtHero(d){
 return `<section class="local-hero wrap"><p class="residential-badge"><strong>Servicios para viviendas y comunidades</strong><span>Instalación nueva · Reparación · Renovación</span></p><div class="local-hero-grid"><div><span class="kicker">Madrid capital / Distrito ${d.code}</span><h1>Antenista en<br>${e(d.name)}, Madrid.</h1><p class="lead">Instalación y reparación de antenas, amplificación, porteros automáticos y videoporteros para viviendas y comunidades del distrito de ${e(d.name)}.</p></div><aside class="local-contact"><span class="kicker">Contacto de Madrid</span><a class="phone-number" href="tel:${center.tel}">${e(center.number)}</a><div class="actions"><a class="btn btn-primary" href="tel:${center.tel}">Llamar ↗</a><a class="btn btn-green" href="https://wa.me/${center.wa}?text=${encodeURIComponent('Consulta para '+d.name+', Madrid.')}" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a></div><small>Urgencias 24 horas · 365 días. Confirma disponibilidad y condiciones para tu dirección antes de concertar la visita.</small></aside></div></section>`;
}
export function districtPage(template,d,base){
 const title=`Antenista en ${d.name}, Madrid | ${center.number}`;
 const description=`Antenas, amplificación, porteros y videoporteros en ${d.name}, Madrid capital. Instalación y reparación para viviendas y comunidades. ${center.number}.`;
 const breadcrumb=`<nav aria-label="Ruta de navegación" class="wrap"><ol class="breadcrumbs"><li><a href="/">Inicio</a></li><li> / <a href="/provincias/madrid/">Comunidad de Madrid</a></li><li> / <a href="${cityUrl}">Madrid capital</a></li><li> / <span aria-current="page">${e(d.name)}</span></li></ol></nav>`;
 const contextual=d.slug==='salamanca'?'<p>Esta página corresponde al distrito de Salamanca de Madrid capital, no a la provincia de Salamanca.</p>':d.slug==='latina'?'<p>Latina es el distrito administrativo de Madrid. Indica tu dirección completa para no confundirlo con otras denominaciones de zonas de la ciudad.</p>':'';
 const context=`<section class="context-box district-context"><span class="kicker">Tu dirección dentro de Madrid</span><h2>Consulta el servicio en ${e(d.name)}</h2><p class="neighborhoods">El distrito ${d.code}, ${e(d.name)}, reúne estos barrios: <strong>${d.barrios.map(e).join(' · ')}</strong>.</p><p>Al preparar el aviso, indica el barrio, la calle y si la instalación es individual o comunitaria. El contacto de esta ficha es el de Madrid: <a href="tel:${center.tel}">${e(center.number)}</a>. Los barrios identifican la zona de la consulta; la disponibilidad se confirma para cada dirección.</p>${contextual}<p class="source-note">División territorial: <a href="${e(source)}" target="_blank" rel="noopener noreferrer">Ayuntamiento de Madrid, distritos y barrios</a>. No se anuncia una sede física en cada distrito.</p></section>`;
 const details=['antenas','amplificacion','porteros','videoporteros'].map(id=>sectionById(template,id).replaceAll(' en Madrid',' en '+e(d.name)+', Madrid')).join('');
 let form=sectionById(template,'contacto');
 form=one(form,'<label>Municipio<input name="municipio"',`<label class="district-form-field">Distrito de Madrid<input name="distrito" value="${e(d.name)}" readonly></label><label>Municipio<input name="municipio"`,'distrito en formulario');
 const faq=`<section class="section wrap faq-wrap"><h2>Tu aviso en ${e(d.name)}, bien preparado.</h2><div class="faq"><details><summary>¿Qué debo indicar para una avería de antena?</summary><p>Facilita tu dirección en ${e(d.name)} y explica si fallan todos los canales, una sola toma o también los televisores de otros vecinos. Para una comunidad, coordina el acceso a los elementos comunes con su responsable.</p></details><details><summary>¿Puedo pedir una instalación nueva de portero o videoportero?</summary><p>Sí, puedes consultar instalación, renovación o reparación. Indica el sistema actual, el número de viviendas y qué funciones necesitas: llamada, conversación, imagen y apertura. La compatibilidad y el alcance se revisan antes de elegir los equipos.</p></details><details><summary>¿El teléfono es el mismo que para Madrid capital?</summary><p>Esta ficha utiliza ${e(center.number)}, el contacto de Madrid. El formulario mantiene Madrid como municipio e incluye ${e(d.name)} como distrito para preparar correctamente la consulta.</p></details></div></section>`;
 const main=breadcrumb+districtHero(d)+`<div class="wrap"><nav class="local-nav" aria-label="Servicios del distrito"><a href="#antenas">Antenas ↓</a><a href="#amplificacion">Amplificación ↓</a><a href="#porteros">Porteros ↓</a><a href="#videoporteros">Videoporteros ↓</a><a href="#contacto">Pedir asistencia ↓</a></nav>${context}${details}</div>`+faq+sectionById(template,'confianza')+form+`<div class="wrap">${districtDirectory(false,d.slug)}</div>`;
 let html=template.replace(/<main id="contenido">[\s\S]*?<\/main>/,`<main id="contenido">${main}</main>`);
 html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${e(title)}</title>`)
  .replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${e(description)}">`)
  .replace(/<link rel="canonical" href="[^"]*">/,`<link rel="canonical" href="${base+d.url}">`)
  .replace(/<meta property="og:title" content="[^"]*">/,`<meta property="og:title" content="${e(title)}">`)
  .replace(/<meta property="og:description" content="[^"]*">/,`<meta property="og:description" content="${e(description)}">`)
  .replace(/<meta property="og:url" content="[^"]*">/,`<meta property="og:url" content="${base+d.url}">`);
 html=html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(_,text)=>{
  const data=JSON.parse(text);
  for(const node of data['@graph']||[]){
   if(node['@type']==='WebPage'){node['@id']=base+d.url+'#pagina';node.url=base+d.url;node.name=title;node.description=description;}
   if(node['@type']==='Service'){node.url=base+d.url;node.name='Antenas, amplificación, porteros y videoporteros en '+d.name+', Madrid';node.areaServed={'@type':'AdministrativeArea',name:d.name,containedInPlace:{'@type':'City',name:'Madrid'}};}
   if(node['@type']==='BreadcrumbList')node.itemListElement=[['Inicio','/'],['Comunidad de Madrid','/provincias/madrid/'],['Madrid capital',cityUrl],[d.name,d.url]].map(([name,url],i)=>({'@type':'ListItem',position:i+1,name,item:base+url}));
  }
  return '<script type="application/ld+json">'+JSON.stringify(data).replace(/</g,'\\u003c')+'</script>';
 });
 return {html,page:{url:d.url,title,description,type:'district',province:'madrid',town:'madrid',district:d.slug,phone:center.number,noindex:template.includes('name="robots" content="noindex,follow"')}};
}
export function improvePage(html,page,report){
 html=one(html,'</head>',`<link rel="stylesheet" href="/assets/navigation.css?v=${version}"><script src="/assets/location-finder.js?v=${version}" defer></script><meta name="navigation-version" content="${version}"></head>`,'recursos de navegación');
 html=html.replace('<body>',`<body class="page-${page.type}">`).replaceAll('Teléfonos por zona ↗','Teléfonos ↗').replaceAll('Consultar por WhatsApp ↗','WhatsApp ↗');
 html=html.replace('/assets/whatsapp-form.js?v=amplificacion-debajo-servicios-v2','/assets/whatsapp-form.js?v='+version);
 if(page.type==='home'){
  const old=/<section class="hero wrap">[\s\S]*?<\/section>/;
  if(!old.test(html))throw Error('No se reconoce la portada actual');
  html=html.replace(old,homeHero());
  const zones=/<section class="contact-zones wrap" id="telefonos-zonas">[\s\S]*?<\/section>/;
  if(!zones.test(html))throw Error('No se reconoce el bloque antiguo de teléfonos');
  html=html.replace(zones,'');
 }
 html=enhanceDirectory(html,report);
 if(page.url==='/provincias/madrid/')html=one(html,'<section class="section wrap" id="municipios">',`<div class="wrap">${districtDirectory()}</div><section class="section wrap" id="municipios">`,'distritos en provincia');
 if(page.url===cityUrl){
  const marker='<div class="wrap"><nav class="local-nav"';
  html=one(html,marker,`<div class="wrap">${districtDirectory()}</div>`+marker,'distritos en Madrid capital');
 }
 return html;
}
export function applyNavigation(root='dist'){
 const reportFile=path.join(root,'build-report.json'),report=JSON.parse(fs.readFileSync(reportFile,'utf8'));
 if(report.navigation)throw Error('No aplicar navegación dos veces; ejecutar el build completo');
 if(districts.length!==21||new Set(districts.map(d=>d.url)).size!==21)throw Error('Inventario distrital incorrecto');
 const file=url=>path.join(root,url==='/404.html'?'404.html':url==='/'?'index.html':url.slice(1)+'index.html');
 const template=fs.readFileSync(file(cityUrl),'utf8'),basePages=report.totalPages;
 for(const d of districts){
  if(report.pages.some(p=>p.url===d.url))throw Error('Ruta distrital existente: '+d.url);
  const built=districtPage(template,d,report.base);fs.mkdirSync(path.dirname(file(d.url)),{recursive:true});fs.writeFileSync(file(d.url),built.html);report.pages.push(built.page);
 }
 report.totalDistricts=districts.length;report.totalPages=report.pages.length;
 for(const page of report.pages)fs.writeFileSync(file(page.url),improvePage(fs.readFileSync(file(page.url),'utf8'),page,report));
 const provinceNames=new Map(report.counts.map(p=>[slug(p.province),p.province]));
 const locations=report.pages.filter(p=>p.type==='town').map(p=>{
  const provinceName=provinceNames.get(p.province),suffix=', '+provinceName+' | '+p.phone;
  if(!p.title.startsWith('Antenista en ')||!p.title.endsWith(suffix))throw Error('No se puede identificar municipio: '+p.url);
  return {name:p.title.slice('Antenista en '.length,-suffix.length),province:p.province,provinceName,type:'town',url:p.url};
 });
 locations.push(...districts.map(d=>({name:d.name,province:'madrid',provinceName:'Madrid',type:'district',url:d.url,barrios:d.barrios})));
 fs.writeFileSync(path.join(root,'assets/location-index.json'),JSON.stringify(locations));
 for(const name of ['navigation.css','location-finder.js'])fs.copyFileSync('src/'+name,path.join(root,'assets',name));
 const sitemap=path.join(root,'sitemaps/madrid.xml');
 fs.writeFileSync(sitemap,one(fs.readFileSync(sitemap,'utf8'),'</urlset>',districts.map(d=>`<url><loc>${e(report.base+d.url)}</loc></url>`).join('')+'</urlset>','sitemap de Madrid'));
 report.navigation={version,basePages,municipalities:report.totalTowns,districts:districts.length,searchLocations:locations.length,districtSource:source,homeSampleRemoved:true,heroPhoneNumbers:[north.number,center.number],districtPhone:center.number};
 report.focus.amplificationPages+=districts.length;
 fs.writeFileSync(reportFile,JSON.stringify(report,null,2));
 console.log(`NAVEGACIÓN OK: ${report.totalTowns} municipios + ${districts.length} distritos; ${report.totalPages} páginas; ${locations.length} ubicaciones en el buscador. Provincias rotuladas; portada con foto y dos contactos; selección de ocho pueblos retirada.`);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))applyNavigation();
