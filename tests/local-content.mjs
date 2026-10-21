import assert from 'node:assert/strict';
import {improveLocalContent,localProfiles,serviceBriefs,technicalProfileFor,localContentFor} from '../scripts/local-content.mjs';
import {specialties} from '../scripts/local-specialty-copy.mjs';
import {responsiveHtml} from '../scripts/responsive-images.mjs';
const form='<form id="whatsapp-aviso"><select name="servicio" required><option value="">Selecciona un servicio</option>'+serviceBriefs.map(s=>'<option>'+s.request+'</option>').join('')+'</select><select name="inmueble" required><option value="">Selecciona vivienda o comunidad</option><option>Vivienda particular</option><option>Comunidad de propietarios</option></select><label>Tu teléfono (opcional)<input></label><label class="wide">Cuéntanos qué ocurre<textarea></textarea></label></form>';
const faq='<section class="section wrap faq-wrap"><h2>Preguntas anteriores</h2><div class="faq"><details><summary>Anterior</summary><p>Anterior</p></details></div></section>';
const shell='<main id="contenido"><h1>Antenista en<br>Lerma.</h1><section class="context-box"><p>Anterior</p></section>'+serviceBriefs.map(s=>'<section id="'+s.id+'"><p>Anterior</p></section>').join('')+faq+form+'</main>';
const result=improveLocalContent(shell,{type:'town',town:'lerma',province:'burgos',url:'/provincias/burgos/lerma/'});
assert(result.includes('Ruyales del Agua'));assert(result.includes('name="nucleo"'));assert(result.includes('data-request-service="Instalación de antenas Starlink"'));
assert.equal(Object.keys(localProfiles).length,10);for(const v of Object.values(localProfiles)){assert(v.sources.length>0);assert(v.paragraphs.length===2);assert(v.examples.length>0);}
assert.equal((result.match(/class="service-detail local-service-brief"/g)||[]).length,5);
const lermaCombo=technicalProfileFor('/provincias/burgos/lerma/');
const zallaCombo=technicalProfileFor('/provincias/bizkaia/zalla/');
assert.equal(lermaCombo.items.length,3);assert.equal(new Set(lermaCombo.families).size,3);assert.equal(technicalProfileFor('/provincias/burgos/lerma/').id,lermaCombo.id);assert.notEqual(lermaCombo.id,zallaCombo.id);

const districtShell='<main id="contenido"><h1>Antenista en<br>Centro, Madrid.</h1><section class="context-box district-context"><p>Barrios y fuente oficial del distrito.</p></section>'+serviceBriefs.map(s=>'<section id="'+s.id+'"><p>Anterior</p></section>').join('')+faq+form+'</main>';
const districtResult=improveLocalContent(districtShell,{type:'district',town:'madrid',province:'madrid',district:'centro',url:'/provincias/madrid/madrid/centro/'});
assert(districtResult.includes('Barrios y fuente oficial del distrito.'));assert(districtResult.includes('data-local-technical='));assert.equal((districtResult.match(/data-local-case/g)||[]).length,3);
for(const [html,url] of [[result,'/provincias/burgos/lerma/'],[districtResult,'/provincias/madrid/madrid/centro/']]){
 const content=localContentFor(url);assert.equal(content.specialties.length,2);assert.equal(new Set(content.specialties.map(s=>s.id)).size,2);
 assert.equal((html.match(/data-specialty=/g)||[]).length,2);assert.equal((html.match(/data-service-copy=/g)||[]).length,5);assert.equal((html.match(/data-faq-copy=/g)||[]).length,3);
 assert(html.includes('<option>Bar o restaurante</option>'));assert(html.includes('<option>Hotel o alojamiento</option>'));assert(html.includes('<option>Local comercial</option>'));
 for(const specialty of specialties)assert(html.includes('<option>'+specialty.request+'</option>'),'Servicio sin opción de consulta: '+specialty.id);
 for(const selected of content.specialties){assert(html.includes('data-request-service="'+selected.request+'"'));assert(html.includes(selected.variant.question));}
 assert.equal(localContentFor(url).id,content.id);
}

const tag='<img src="/assets/parabolica.jpeg" alt="Parabólica" width="1200" height="900" loading="lazy">';
const image=responsiveHtml(tag,{type:'town'},{'parabolica.jpeg':{width:1000,height:750,variants:[{file:'photo-320.webp',width:320},{file:'photo-800.webp',width:800}]}});
assert(image.includes('srcset="/assets/photo-320.webp 320w, /assets/photo-800.webp 800w"'));assert(image.includes('sizes="210px"'));assert(image.includes('width="1000"'));assert(image.includes('alt="Parabólica"'));
console.log('LOCAL OK: perfiles con fuentes, dos servicios complementarios y un caso técnico, cinco servicios principales, FAQ correspondientes y formulario para viviendas, comunidades y locales.');
