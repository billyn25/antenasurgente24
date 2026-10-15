import assert from 'node:assert/strict';
import {residentialTransform,amplification,validatePng,slogan,version} from '../scripts/residential.mjs';
const shell=body=>'<html><head><meta name="build-version" content="azul-confianza-v1"><script src="/assets/whatsapp-form.js" defer></script></head><body>'+body+'</body></html>';
const form='<form id="whatsapp-aviso"><label>¿Qué necesitas?<select name="servicio" required><option>Amplificación y antenas colectivas</option></select></label></form>';
const home=shell('<h1>Señal clara.<br><span class="highlight">Puertas que<br>responden.</span></h1><p class="lead">Antenas, porteros automáticos<br>y videoporteros.</p><p>Antenista en tu pueblo para instalar, reparar y renovar. Televisión, porteros y videoporteros: tres especialidades, un contacto para tu zona.</p><div class="service-tags"></div><section class="section wrap property-section" id="tipos-instalacion"><article>03 / NEGOCIOS</article></section>'+form);
const result=residentialTransform(home,{type:'home',url:'/'});
const plain=result.match(/<h1[^>]*>(.*?)<\/h1>/)[1].replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
assert.equal(plain,slogan);assert(!result.includes('NEGOCIOS'));
for(const word of ['viviendas','comunidades de propietarios','name="inmueble"','id="amplificacion"','fuentes de alimentación','monocanal','amplificador-monocanal-televes.png'])assert(result.toLowerCase().includes(word.toLowerCase()),word);
assert(result.includes('residential.css?v='+version));assert(result.includes('whatsapp-form.js?v='+version));
const town=shell('<section class="local-hero wrap"><h1>Antenista en<br>Zalla.</h1></section><a href="#porteros">Porteros automáticos ↓</a><a href="/servicios/antenas/">Ver el servicio de antenas tdt y parabólicas ↗</a><section class="service-detail" id="porteros"></section><a href="tel:+34641589394">641 589 394</a>'+form);
const local=residentialTransform(town,{type:'town',url:'/provincias/bizkaia/zalla/'});
assert.equal((local.match(/src="\/assets\/antena-televes-dat.png"/g)||[]).length,1);
assert(local.includes('sistemas de amplificación en Zalla'));
assert(local.includes('href="tel:+34641589394"'));assert(local.includes('No corresponde a una intervención local.'));
for(const id of ['antenas','porteros','videoporteros']){
 const html=residentialTransform(shell('<section class="local-hero wrap"><h1>Servicio</h1></section><section class="section wrap service-planning"></section>'+form),{type:'service',url:`/servicios/${id}/`});
 assert(html.includes('Servicios para viviendas y comunidades'));assert.equal(html.includes('id="amplificacion"'),id==='antenas');
}
assert.throws(()=>residentialTransform('<html></html>',{type:'home',url:'/'}),/composición previa/);
assert.throws(()=>validatePng(Buffer.from('<html>404</html>'),'error'),/PNG inválida/);
assert(!/ratingValue|aggregateRating|"@type":"Review"/.test(amplification()));
console.log('TESTS RESIDENCIALES OK: eslogan literal, viviendas y comunidades, amplificación, imagen municipal, formulario y protección contra imágenes rotas.');
