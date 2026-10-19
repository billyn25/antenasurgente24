import assert from 'node:assert/strict';
import contexts from '../config/local-contexts.json' with {type:'json'};
import {districts} from '../config/madrid-districts.mjs';
import {section,decode} from './starlink.mjs';
export const localVersion='local-util-imagenes-v1';
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const localProfiles=contexts.locations;
export const serviceBriefs=[
 {id:'antenas',heading:'Técnico en instalación de antenas',number:'01',label:'Antenas TDT y parabólicas',url:'/servicios/antenas/',request:'Instalación de antenas',image:'antena-televes-dat.png',alt:'Antena Televés DAT BOSS para recepción de televisión TDT',
 text:'Montaje y orientación de antenas TDT y parabólicas, cableado y nuevas tomas. En reparaciones se comprueba si el fallo está en la recepción, la distribución o una conexión de la vivienda.',
 ask:'Anota qué canales fallan y si ocurre en una toma, en todas o también a otros vecinos. Para un montaje nuevo, indica cuántos televisores necesitas conectar.'},
 {id:'amplificacion',heading:'Instalación y reparación de sistemas de amplificación',number:'04',label:'Amplificación y monocanales',url:'/servicios/antenas/#amplificacion',request:'Instalación nueva de sistemas de amplificación',image:'amplificador-monocanal-televes.png',alt:'Amplificador monocanal Televés T12 para una cabecera comunitaria',
 text:'Instalación nueva y reparación de previos, fuentes de alimentación y amplificadores. En comunidades se revisan los módulos monocanal, su alimentación y la distribución antes de decidir qué sustituir.',
 ask:'Indica si faltan todos los canales o un grupo y cuántas viviendas están afectadas. No abras fuentes ni equipos de cabecera.'},
 {id:'porteros',heading:'Técnico en instalación de porteros automáticos',number:'02',label:'Porteros automáticos',url:'/servicios/porteros/',request:'Instalación de porteros automáticos',
 text:'Instalación de placas de calle y telefonillos, renovación de sistemas y reparación de llamada, conversación o apertura. Se verifica la compatibilidad del equipo con la instalación del edificio.',
 ask:'Explica por separado si llama, se oye en ambos sentidos y abre. Para renovar, facilita el número de viviendas y una foto exterior de la placa.'},
 {id:'videoporteros',heading:'Técnico en instalación de videoporteros',number:'03',label:'Videoporteros',url:'/servicios/videoporteros/',request:'Instalación de videoporteros',
 text:'Montaje de cámaras y monitores, renovación de placas y reparación de imagen, sonido y apertura. El paso de audio a vídeo se estudia según el cableado y la alimentación disponibles.',
 ask:'Indica marca, número de monitores y qué función falla. Aclara si quieres cambiar un monitor o actualizar todo el sistema comunitario.'},
 {id:'starlink',heading:'Instalación de antenas Starlink',number:'05',label:'Internet por satélite',url:'/servicios/starlink/',request:'Instalación de antenas Starlink',image:'antena-starlink-standard.png',alt:'Antena Starlink Standard con soporte',
 text:'Elección del emplazamiento, soporte, tendido de cable y configuración del equipo. Se comprueban las obstrucciones con la aplicación y el montaje que corresponde al modelo del kit.',
 ask:'Indica el kit que tienes, dónde iría la antena y dónde necesitas Wi-Fi. El montaje se presupuesta separado del equipo y de la suscripción.'}
];
function nameOf(html){
 const h=html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/);assert(h);
 return decode(h[1].replace(/<br\s*\/?\s*>/g,' ').replace(/<[^>]+>/g,'')).replace(/^Antenista en\s*/,'').replace(/\.$/,'').trim();
}
function brief(s,place){
 const figure=s.image?`<figure class="local-equipment"><img src="/assets/${s.image}" alt="${e(s.alt)}" width="800" height="800" loading="lazy" decoding="async"><figcaption>Equipo de referencia</figcaption></figure>`:'';
 return `<section class="service-detail local-service-brief" id="${s.id}"><div><span class="kicker">${s.number} / ${s.label}</span><h2>${s.heading} en ${e(place)}</h2>${figure}</div><div><p>${s.text}</p><p><strong>Para preparar el aviso:</strong> ${s.ask}</p><div class="actions"><a class="text-link" href="#contacto" data-request-service="${e(s.request)}">Consultar este servicio ↗</a><a class="local-guide-link" href="${s.url}">Ver la guía de ${e(s.label.toLowerCase())} ↗</a></div></div></section>`;
}
function profileBlock(profile){
 return `<section class="context-box local-address-guide" id="direccion-local"><span class="kicker">Tu dirección, bien identificada</span><h2>${e(profile.heading)}</h2>${profile.paragraphs.map(t=>'<p>'+e(t)+'</p>').join('')}${(profile.related||[]).map(r=>'<p><a class="text-link" href="'+e(r.url)+'">'+e(r.label)+' ↗</a></p>').join('')}<p class="local-source">Referencias de localidad: ${profile.sources.map(s=>'<a href="'+e(s.url)+'" target="_blank" rel="noopener noreferrer">'+e(s.label)+'</a>').join(' · ')}</p></section>`;
}
function enrichForm(html,p,profile){
 const district=p.type==='district'?districts.find(d=>d.slug===p.district):null;
 const examples=district?.barrios||profile?.examples||[];
 const title=district?'Barrio de Madrid (opcional)':'Barrio o localidad dentro del municipio (opcional)';
 const field=`<label class="wide local-address-field">${title}<input name="nucleo" type="text" maxlength="100" autocomplete="off"${examples.length?' list="local-address-options"':''} data-local-location="${e(p.town)}" data-local-province="${e(p.province)}" placeholder="${examples.length?e(examples.slice(0,2).join(', ')):'Barrio, pedanía o núcleo de población'}">${examples.length?'<datalist id="local-address-options">'+examples.map(s=>'<option value="'+e(s)+'"></option>').join('')+'</datalist>':''}</label>`;
 const anchor='<label>Tu teléfono (opcional)';assert(html.includes(anchor),'Formulario local no reconocido');
 html=html.replace(anchor,field+anchor);
 const textarea='<label class="wide">Cuéntanos qué ocurre';assert(html.includes(textarea));
 const symptoms='<label>Qué necesitas (opcional)<select name="sintoma"><option value="">Selecciona el problema</option><optgroup label="Antenas y amplificación"><option>Sin señal en todos los canales</option><option>Pixelación o faltan algunos canales</option><option>Una toma funciona y otra no</option></optgroup><optgroup label="Porteros automáticos y videoporteros"><option>No suena la llamada</option><option>No se oye o solo se oye en un sentido</option><option>No abre la puerta</option><option>Videoportero sin imagen</option></optgroup><optgroup label="Starlink"><option>Montaje de un kit Starlink nuevo</option><option>Reubicación de una antena Starlink</option></optgroup><option>Instalación nueva o renovación</option><option>Otro problema</option></select></label><label>A quién afecta (opcional)<select name="alcance"><option value="">Sin confirmar</option><option>Solo un equipo o una toma</option><option>Toda mi vivienda</option><option>Varias viviendas de la comunidad</option><option>Toda la comunidad</option><option>Es una instalación nueva</option></select></label>';
 html=html.replace(textarea,symptoms+'<p class="wide service-request-help" id="service-request-help" role="status">Selecciona el servicio para ver qué información conviene facilitar.</p>'+textarea);
 return html;
}
export function improveLocalContent(html,p){
 if(!['town','district'].includes(p.type))return html;
 const place=nameOf(html),profile=localProfiles[p.url];
 for(const s of serviceBriefs)html=html.replace(section(html,s.id),()=>brief(s,place));
 // Do not manufacture unique text from random templates or geographical names.
 // Only records with an explicitly researched source get a factual local guide.
 if(profile){
  const old=html.match(/<section class="context-box">[\s\S]*?<\/section>/);assert(old,'Falta el contexto de '+p.url);
  html=html.replace(old[0],()=>profileBlock(profile));
 }else if(p.type==='town'){
  const old=html.match(/<section class="context-box">[\s\S]*?<\/section>/);assert(old);
  html=html.replace(old[0],()=>'<section class="context-box local-address-guide"><h2>Tu aviso en '+e(place)+'</h2><p>Selecciona el servicio y el tipo de inmueble. La consulta conserva tu municipio y el teléfono de la provincia; puedes añadir el barrio o núcleo de población antes de abrir WhatsApp.</p></section>');
 }
 html=enrichForm(html,p,profile);
 // These installation answers repeat the service blocks immediately above.
 // Keep the practical booking, availability and budget questions.
 if(p.type==='town')html=html.replace(/<details><summary>¿(?:Instaláis porteros automáticos|Puedo cambiar a videoportero) en [\s\S]*?<\/details>/g,'');
 // The application builds a message locally; these attributes do not send data.
 html=html.replace('<main id="contenido">','<main id="contenido" data-local-version="'+localVersion+'">');
 return html;
}
export function addServiceResources(html,p){
 if(p.url!=='/servicios/antenas/')return html;
 const resource='<section class="section wrap useful-resources" id="comprobar-recepcion"><span class="kicker">Antes de sustituir equipos</span><h2>Recursos para comprobar la recepción.</h2><div class="property-grid"><article><h3>Cobertura TDT</h3><p>Consulta la información oficial de televisión digital para tu localidad. La cobertura general no sustituye la medición en la antena y en las tomas de la vivienda.</p><a class="text-link" href="https://television.digital.gob.es/television-digital/tdt" target="_blank" rel="noopener noreferrer">Información oficial de TDT ↗</a></article><article><h3>Posibles interferencias 4G y 5G</h3><p>Si sospechas que los cortes comenzaron con un despliegue móvil, Llega700 permite comprobar si la dirección está afectada. Sus actuaciones para incidencias que entran en el programa son gratuitas y se solicitan a esa entidad.</p><a class="text-link" href="https://www.llega700.es/faq.php" target="_blank" rel="noopener noreferrer">Consultar el programa Llega700 ↗</a></article></div></section>';
 return html.replace(section(html,'contacto'),m=>resource+m);
}
