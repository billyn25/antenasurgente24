import assert from 'node:assert/strict';
import {decode,section} from './starlink.mjs';
import {specialties} from './local-specialty-copy.mjs';

const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const coreServices=[
 {id:'antenas',label:'Antenas TDT y parabólicas',url:'/servicios/antenas/',image:'parabolica.jpeg'},
 {id:'porteros',label:'Porteros automáticos',url:'/servicios/porteros/',image:'portero-fermax.jpeg'},
 {id:'videoporteros',label:'Videoporteros',url:'/servicios/videoporteros/',image:'portero-tegui.jpeg'},
 {id:'amplificacion',label:'Sistemas de amplificación',url:'/servicios/antenas/#amplificacion',image:'amplificador-monocanal-televes.png'},
 {id:'starlink',label:'Instalación de antenas Starlink',url:'/servicios/starlink/',image:'antena-starlink-standard.png'}
];
const presentation={
 cofdm:{label:'Moduladores COFDM para bares y hoteles',text:'Distribución de televisión en bares y hoteles desde Movistar u otros receptores HD, según compatibilidad y condiciones del servicio.'},
 accesos:{label:'Control de acceso con teclado o llavero',text:'Instalación de teclados y lectores de llavero para controlar la entrada a portales, garajes y zonas comunes.'},
 uhd:{label:'Resintonización TDT y comprobación UHD',text:'Búsqueda de canales TDT y revisión de la compatibilidad del televisor o receptor con las emisiones UHD.'},
 'soporte-tv':{label:'Montaje de soportes de TV',text:'Montaje de soportes fijos o articulados, comprobando pared, anclajes, peso y compatibilidad con el televisor.'},
 'aviso-accesible':{label:'Kit de aviso para aseos accesibles',text:'Instalación de tirador de llamada, señal luminosa y acústica y rearme para solicitar asistencia en aseos de locales.'}
};
export const additionalServices=specialties.map(s=>({id:s.id,request:s.request,url:'/#'+s.id,...presentation[s.id]}));
export const serviceCatalogue=[...coreServices,...additionalServices];
export const commercialProperties=['Local comercial','Bar o restaurante','Hotel o alojamiento'];

function ensureOptions(html,name,labels){
 const selector=new RegExp('(<select\\b[^>]*\\bname="'+name+'"[^>]*>)([\\s\\S]*?)(<\\/select>)','g');
 return html.replace(selector,(_,start,options,end)=>{
  const values=new Set([...options.matchAll(/<option\b([^>]*)>([^<]*)<\/option>/g)].map(([,attrs,label])=>decode(attrs.match(/\bvalue="([^"]*)"/)?.[1]??label)));
  return start+options+labels.filter(label=>!values.has(label)).map(label=>'<option>'+e(label)+'</option>').join('')+end;
 });
}

function homeCatalogue(html){
 const old=section(html,'servicios');
 if(old.includes('data-service-catalogue="10"'))return html;
 let count=0;
 let block=old.replace(/<(?:article|section)\b[^>]*\bclass="service-card(?: [^"]*)?"[^>]*>/g,tag=>{
  assert(coreServices[count],'Más tarjetas principales de las previstas');
  return tag.replace(/>$/,()=>` data-catalogue-service="${coreServices[count++].id}">`);
 });
 assert.equal(count,5,'Faltan tarjetas principales en portada');
 assert(block.endsWith('</div></section>'),'Contenedor de servicios inesperado');
 assert(block.includes('Cinco servicios para viviendas y comunidades'),'Encabezado de servicios inesperado');
 block=block.replace('id="servicios"','id="servicios" data-service-catalogue="10"')
  .replace('Cinco servicios para viviendas y comunidades','Diez servicios para viviendas, comunidades y locales')
  .replace('Antenas, porteros, videoporteros, amplificación y Starlink. Instalación y reparación para tu vivienda o comunidad.','Instalación y reparación de televisión, porteros, accesos y avisos de asistencia. Elige el servicio y prepara tu consulta.');
 const cards=additionalServices.map((s,i)=>`<article class="service-card service-card-specialty" id="${s.id}" data-catalogue-service="${s.id}"><div class="card-body"><span class="card-number">${String(i+6).padStart(2,'0')}</span><h3>${e(s.label)}</h3><p>${e(s.text)}</p><a class="text-link" href="#contacto" data-request-service="${e(s.request)}" aria-label="Consultar ${e(s.label)}">Consultar servicio ↗</a></div></article>`).join('');
 block=block.slice(0,-'</div></section>'.length)+cards+'</div></section>';
 return html.replace(old,()=>block);
}

function localCatalogue(html){
 const nav=/<nav class="local-nav"[^>]*>[\s\S]*?<\/nav>/;
 const old=html.match(nav)?.[0];assert(old,'Falta índice local de servicios');
 if(old.includes('data-service-catalogue="10"'))return html;
 const label=old.match(/aria-label="([^"]+)"/)?.[1]||'Servicios';
 const links=serviceCatalogue.map((s,i)=>`<a href="${s.request?'#contacto':'#'+s.id}" data-catalogue-service="${s.id}"${s.request?' data-request-service="'+e(s.request)+'"':''}><span class="catalogue-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><span>${e(s.label)}</span><span class="catalogue-arrow" aria-hidden="true">↓</span></a>`).join('');
 return html.replace(old,()=>`<nav class="local-nav" data-service-catalogue="10" aria-label="${label}"><span class="catalogue-heading">Los 10 servicios</span><div class="service-shortcuts">${links}</div></nav>`);
}

export function showServiceCatalogue(html,p){
 if(p.type==='home')html=homeCatalogue(html);
 if(['town','district'].includes(p.type))html=localCatalogue(html);
 html=ensureOptions(html,'servicio',additionalServices.map(s=>s.request));
 html=ensureOptions(html,'inmueble',commercialProperties)
  .replaceAll('Selecciona vivienda o comunidad','Selecciona tipo de inmueble')
  .replaceAll('Tipo de instalación<select name="inmueble"','Tipo de inmueble<select name="inmueble"');
 if(!html.includes('data-service-footer="10"')){
  const old=/<h3>Servicios<\/h3><div class="footer-links">[\s\S]*?<\/div>/;
  assert(old.test(html),'Falta lista de servicios en el pie '+p.url);
  const links=serviceCatalogue.map(s=>`<a href="${s.url}">${e(s.label)}</a>`).join('');
  html=html.replace(old,()=>'<h3>Servicios</h3><div class="footer-links" data-service-footer="10">'+links+'</div><a class="footer-directory-link" href="/#provincias">Encuentra tu municipio</a>');
 }
 assert(/<dt>servicios técnicos<\/dt><dd>(?:5|10)<\/dd>/.test(html),'Falta contador de servicios '+p.url);
 return html.replace('<dt>servicios técnicos</dt><dd>5</dd>','<dt>servicios técnicos</dt><dd>10</dd>');
}
