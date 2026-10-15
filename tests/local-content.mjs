import assert from 'node:assert/strict';
import {improveLocalContent,localProfiles,serviceBriefs} from '../scripts/local-content.mjs';
import {responsiveHtml} from '../scripts/responsive-images.mjs';
const shell='<main id="contenido"><h1>Antenista en<br>Lerma.</h1><section class="context-box"><p>Anterior</p></section>'+serviceBriefs.map(s=>'<section id="'+s.id+'"><p>Anterior</p></section>').join('')+'<form id="whatsapp-aviso"><label>Tu teléfono (opcional)<input></label><label class="wide">Cuéntanos qué ocurre<textarea></textarea></label></form></main>';
const result=improveLocalContent(shell,{type:'town',town:'lerma',province:'burgos',url:'/provincias/burgos/lerma/'});
assert(result.includes('Ruyales del Agua'));assert(result.includes('name="nucleo"'));assert(result.includes('data-request-service="Instalación de antenas Starlink"'));
assert.equal(Object.keys(localProfiles).length,10);for(const v of Object.values(localProfiles)){assert(v.sources.length>0);assert(v.paragraphs.length===2);assert(v.examples.length>0);}
assert.equal((result.match(/class="service-detail local-service-brief"/g)||[]).length,5);
const tag='<img src="/assets/parabolica.jpeg" alt="Parabólica" width="1200" height="900" loading="lazy">';
const image=responsiveHtml(tag,{type:'town'},{'parabolica.jpeg':{width:1000,height:750,variants:[{file:'photo-320.webp',width:320},{file:'photo-800.webp',width:800}]}});
assert(image.includes('srcset="/assets/photo-320.webp 320w, /assets/photo-800.webp 800w"'));assert(image.includes('sizes="210px"'));assert(image.includes('width="1000"'));assert(image.includes('alt="Parabólica"'));
console.log('LOCAL OK: 10 perfiles con fuentes, cinco servicios conservados, formulario por localidad e imágenes responsive.');
