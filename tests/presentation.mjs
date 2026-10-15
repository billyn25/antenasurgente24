import assert from 'node:assert/strict';
import {transform,confidence} from '../scripts/presentation.mjs';
const shell=body=>'<html><head><link href="/assets/styles.css"><link href="/assets/favicon.svg"></head><body>'+body+'</body></html>';
const home=shell('<h1>Tu antenista.<br><span class="highlight">En tu pueblo.</span></h1><p>Instalar, reparar o renovar. Cuéntanos qué necesitas y encuentra el contacto de tu localidad.</p><section class="section wrap" id="servicios"></section><section class="promise" id="como-trabajamos"></section><section class="section wrap" id="galeria"><img src="/assets/hero-obra.webp"></section><section class="section contact-section" id="contacto"></section>');
const result=transform(home,{type:'home',url:'/'});
assert(result.includes('Señal clara.'));
assert(result.includes('id="presupuesto"'));
assert(!result.includes('hero-obra.webp'));
assert.equal((result.match(/class="commitment-star"/g)||[]).length,5);
assert(result.includes('styles.css?v=azul-confianza-v1'));
assert(!/aggregateRating|ratingValue|"@type":"Review"/.test(confidence()));
for(const id of ['antenas','porteros','videoporteros']){
 const html=transform(shell('<h1>Servicio</h1><section class="section contact-section" id="contacto"></section>'),{type:'service',url:`/servicios/${id}/`});
 assert(html.includes('class="section wrap service-planning"'));assert(html.includes('id="confianza"'));
}
const local=transform(shell('<h1>Antenista en Zalla</h1><a href="tel:+34641589394">641 589 394</a><section class="section contact-section" id="contacto"></section>'),{type:'town',url:'/provincias/bizkaia/zalla/'});
assert(local.includes('Tu aviso, bien definido.'));assert(local.includes('href="tel:+34641589394"'));
assert.throws(()=>transform(shell('<h1>Otro diseño</h1>'),{type:'home',url:'/'}),/eslogan/);
console.log('TESTS OK: transformaciones exactas, fotos retiradas, contenido de 3 servicios, teléfono preservado, estrellas sin reseñas y versión anticaché.');
