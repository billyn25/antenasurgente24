import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';

export const slogan='Profesional en antenas cerca de tu localidad';
export const version='viviendas-amplificacion-v1';
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Fotografías de catálogo del fabricante, nunca presentadas como trabajos locales.
export const media=[
 {name:'antena-televes-dat.png',url:'https://www.televes.com/pub/media/catalog/category/seccion_pequena_CATALOGO_PRODUCTO_code_3001.png',source:'https://www.televes.com/es/distribucion-tv/antenas-terrestres/inteligentes-con-bosstech/serie-dat.html',alt:'Antena Televés DAT BOSS para recepción de televisión TDT'},
 {name:'amplificador-monocanal-televes.png',url:'https://www.televes.com/pub/media/catalog/category/seccion_pequena_CATALOGO_PRODUCTO_code_3108.png',source:'https://www.televes.com/es/distribucion-tv/filtrado-y-amplificacion/amplificacion-monocanal/serie-t12.html',alt:'Amplificador monocanal Televés de la serie T12 para cabeceras comunitarias'}
];
export function validatePng(data,label){
 if(data.length<1000||data.length>5000000||data.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Fotografía PNG inválida: '+label);
 const width=data.readUInt32BE(16),height=data.readUInt32BE(20);
 if(width<100||height<100||width>4096||height>4096)throw Error('Dimensiones de fotografía inválidas: '+label);
 return {width,height,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')};
}
async function prepareMedia(root){
 return Promise.all(media.map(async item=>{
  const local=path.join('src/media',item.name);let data;
  if(fs.existsSync(local))data=fs.readFileSync(local);
  else {
   let last;
   for(let attempt=0;attempt<2;attempt++){
    try{
     const response=await fetch(item.url,{signal:AbortSignal.timeout(15000),headers:{'User-Agent':'AntenistaUrgente24-media-build/1.0','Accept':'image/png'}});
     if(!response.ok)throw Error('HTTP '+response.status);
     if(Number(response.headers.get('content-length')||0)>5000000)throw Error('Fotografía demasiado grande');
     data=Buffer.from(await response.arrayBuffer());validatePng(data,item.name);break;
    }catch(err){last=err;data=null;}
   }
   if(!data)throw Error('No se publica una imagen rota: '+item.url+'; '+last);
  }
  const meta=validatePng(data,item.name);
  fs.writeFileSync(path.join(root,'assets',item.name),data);
  return {...item,...meta};
 }));
}
function one(html,old,next,label){
 if(html.split(old).length!==2)throw Error('No se reconoce la plantilla: '+label);
 return html.replace(old,next);
}
const propertySection=`<section class="section wrap property-section" id="tipos-instalacion"><div class="section-head"><div><span class="kicker">Servicios para viviendas y comunidades</span><h2>Tu vivienda.<br>Tu comunidad.<br>Una instalación bien atendida.</h2></div><p>Instalación nueva, reparación y renovación. Diferenciamos los equipos de una vivienda de los elementos comunes que dan servicio a todos los vecinos.</p></div><div class="property-grid residential-properties"><article><span class="property-label">01 / VIVIENDAS</span><h3>Antenas y accesos para tu hogar.</h3><p>Antenas TDT y parabólicas, previos, fuentes de alimentación, amplificadores y tomas de televisión. Instalación y reparación de porteros automáticos y videoporteros para pisos y viviendas unifamiliares.</p><p class="property-note">Antena individual · Amplificación · Telefonillo · Monitor</p><a class="text-link" href="#contacto">Solicitar servicio para mi vivienda ↗</a></article><article><span class="property-label">02 / COMUNIDADES DE PROPIETARIOS</span><h3>La instalación común, de principio a fin.</h3><p>Antenas colectivas, cabeceras y sistemas monocanal, fuentes comunitarias y distribución de televisión. Renovación y reparación de placas de portero, telefonillos y videoporteros, coordinando el alcance con la comunidad.</p><p class="property-note">Antena colectiva · Monocanales · Placas y accesos comunes</p><a class="text-link" href="#contacto">Solicitar servicio para mi comunidad ↗</a></article></div></section>`;
const badge='<p class="residential-badge"><strong>Servicios para viviendas y comunidades</strong><span>Instalación nueva · Reparación · Renovación</span></p>';
function productFigure(item,cls=''){
 return `<figure class="equipment-photo ${cls}"><img src="/assets/${item.name}" alt="${e(item.alt)}" width="600" height="600" loading="lazy" decoding="async"><figcaption>Equipo de referencia · <a href="${item.source}" target="_blank" rel="noopener noreferrer">Catálogo Televés</a>. No corresponde a una intervención local.</figcaption></figure>`;
}
export function amplification(place='',nested=false){
 const location=place?' en '+place:'';
 return `<section class="${nested?'':'section wrap '}amplification-section" id="amplificacion"><div class="amplification-layout"><div><span class="kicker">Señal para viviendas y comunidades</span><h2>Instalación y reparación de sistemas de amplificación${location}</h2><p class="amplification-lead">Previos de antena, fuentes de alimentación, amplificadores y sistemas monocanal para comunidades de propietarios.</p><div class="amplification-grid"><article><h3>Instalación nueva</h3><p>Estudio de la recepción, el recorrido del cable y las tomas que deben recibir señal. Selección y ajuste de los equipos de amplificación según la instalación, tanto individual como colectiva.</p></article><article><h3>Previos y fuentes de alimentación</h3><p>Revisión, reparación o sustitución del previo y de la fuente compatible. Se comprueba la alimentación que necesita el sistema antes de cambiar componentes.</p></article><article><h3>Monocanales para comunidades</h3><p>Instalación, sustitución y ajuste de módulos de amplificación monocanal y de su fuente. Revisión de la cabecera y la distribución para delimitar fallos que afectan a varios vecinos.</p></article><article><h3>Reparación de amplificadores</h3><p>Diagnóstico de alimentación, conexiones y señal para decidir el alcance de la reparación o sustitución. Aumentar la ganancia sin comprobar la instalación no sustituye la revisión de la avería.</p></article></div><p class="amplification-note"><strong>Al solicitar el servicio:</strong> indica si necesitas una instalación nueva o una reparación, cuántas viviendas están afectadas y qué canales fallan. No abras fuentes ni equipos de cabecera.</p><a class="btn btn-dark" href="#contacto">Consultar amplificación para mi instalación ↗</a></div>${productFigure(media[1],'amplifier-photo')}</div></section>`;
}
export function residentialTransform(html,page){
 if(!html.includes('content="azul-confianza-v1"'))throw Error('Falta la composición previa: '+page.url);
 html=html.replace('content="azul-confianza-v1"',`content="${version}"`)
  .replace('</head>',`<link rel="stylesheet" href="/assets/residential.css?v=${version}"></head>`)
  .replace('/assets/whatsapp-form.js"',`/assets/whatsapp-form.js?v=${version}"`)
  .replace('Antenas · Porteros · Videoporteros</span>','Viviendas y comunidades</span>')
  .replaceAll('Cinco compromisos para cuidar de tu instalación.','Cinco compromisos para cuidar la instalación de tu vivienda o comunidad.')
  .replaceAll('para tu vivienda, comunidad o negocio.','para tu vivienda o comunidad de propietarios.')
  .replaceAll('a una vivienda, a toda la comunidad o a un negocio.','a una vivienda o a toda la comunidad.')
  .replaceAll('Viviendas y comunidades de propietarios de propietarios','Viviendas y comunidades de propietarios');
 if(page.type==='home'){
  html=one(html,'<h1>Señal clara.<br><span class="highlight">Puertas que<br>responden.</span></h1>',`<h1 class="residential-slogan">Profesional en antenas <span class="highlight">cerca de tu localidad</span></h1>`,'eslogan exacto');
  html=one(html,'<p class="lead">Antenas, porteros automáticos<br>y videoporteros.</p>','<p class="lead">Instalación y reparación de antenas, amplificación, porteros y videoporteros para <strong>viviendas y comunidades</strong>.</p>','destinatarios en portada');
  html=one(html,'Antenista en tu pueblo para instalar, reparar y renovar. Televisión, porteros y videoporteros: tres especialidades, un contacto para tu zona.','Desde la antena de tu vivienda hasta la cabecera de toda la comunidad. Consulta el servicio técnico de tu localidad, con atención directa y condiciones claras.','introducción residencial');
  const property=/<section class="section wrap property-section" id="tipos-instalacion">[\s\S]*?<\/section>/g;
  if([...html.matchAll(property)].length!==1)throw Error('Falta el bloque de inmuebles');
  html=html.replace(property,amplification()+propertySection);
  html=one(html,'<div class="service-tags">',badge+'<div class="service-tags">','destacado residencial');
 }
 if(['service','province','town'].includes(page.type)){
  const marker='<section class="local-hero wrap">';
  html=one(html,marker,marker+badge,'destacado en ficha');
 }
 if(page.type==='town'){
  const match=html.match(/<h1>Antenista en<br>([\s\S]*?)\.<\/h1>/);
  if(!match)throw Error('No se reconoce el pueblo');
  // El nombre ya está escapado por el generador. No se atribuye la foto a ese lugar.
  const anchor='Ver el servicio de antenas tdt y parabólicas ↗</a>';
  html=one(html,anchor,anchor+productFigure(media[0],'local-antenna'),'fotografía Televés en municipio');
  const porteros='<section class="service-detail" id="porteros">';
  html=one(html,porteros,amplification(match[1],true)+porteros,'amplificación municipal');
  html=one(html,'<a href="#porteros">Porteros automáticos ↓</a>','<a href="#amplificacion">Amplificación y monocanales ↓</a><a href="#porteros">Porteros automáticos ↓</a>','enlace local amplificación');
 }
 if(page.url==='/servicios/antenas/'){
  const marker='<section class="section wrap service-planning">';
  html=one(html,marker,amplification()+marker,'amplificación en servicio de antenas');
 }
 if(html.includes('id="whatsapp-aviso"')){
  html=one(html,'<label>¿Qué necesitas?<select name="servicio" required>','<label class="wide">Tipo de instalación<select name="inmueble" required><option value="">Selecciona vivienda o comunidad</option><option>Vivienda particular</option><option>Comunidad de propietarios</option></select></label><label>¿Qué necesitas?<select name="servicio" required>','tipo de inmueble');
  html=one(html,'<option>Amplificación y antenas colectivas</option>','<option>Instalación nueva de sistemas de amplificación</option><option>Reparación de previos y fuentes de alimentación</option><option>Cabeceras monocanal para comunidades</option><option>Amplificación y antenas colectivas</option>','consulta amplificación');
 }
 // Añadir amplificación al servicio descrito, conservando proveedor, área y URL existentes.
 html=html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(_,payload)=>{
  const data=JSON.parse(payload);
  for(const node of data['@graph']||[])if(node['@type']==='Service'&&Array.isArray(node.serviceType))node.serviceType.push('Instalación y reparación de amplificación, previos, fuentes de alimentación y sistemas monocanal');
  return '<script type="application/ld+json">'+JSON.stringify(data).replace(/</g,'\\u003c')+'</script>';
 });
 return html;
}
export async function applyResidential(root='dist'){
 const reportPath=path.join(root,'build-report.json');const report=JSON.parse(fs.readFileSync(reportPath,'utf8'));
 const images=await prepareMedia(root);
 fs.copyFileSync('src/residential.css',path.join(root,'assets/residential.css'));
 for(const page of report.pages){
  const file=path.join(root,page.url==='/404.html'?'404.html':page.url==='/'?'index.html':page.url.slice(1)+'index.html');
  fs.writeFileSync(file,residentialTransform(fs.readFileSync(file,'utf8'),page));
 }
 report.presentation.slogan=slogan;report.presentation.homePhotos=5;
 report.focus={version,slogan,audiences:['Viviendas particulares','Comunidades de propietarios'],townAntennaPhotos:report.totalTowns,amplificationPages:report.totalTowns+2,media:images};
 fs.writeFileSync(reportPath,JSON.stringify(report,null,2));
 console.log('RESIDENCIAL OK: eslogan exacto; viviendas y comunidades destacadas; '+report.totalTowns+' fichas con foto de antena Televés; amplificación, previos, fuentes y monocanales con foto.');
 for(const item of images)console.log('FOTO VERIFICADA '+item.name+' '+item.width+'x'+item.height+' '+item.bytes+' bytes SHA256 '+item.sha256);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await applyResidential();
