import assert from 'node:assert/strict';
import {geography,byRoute,addLocalGeography} from '../scripts/local-geography.mjs';
assert.equal(byRoute.size,4035);
assert.match(geography.source,/^https:\/\/www\.ign\.es\//);
for(const [code,m] of Object.entries(geography.municipalities)){
 assert.equal(m.nearby.length,6);assert.equal(new Set(m.nearby.map(n=>n[0])).size,6);
 assert(m.capital);assert(Number.isFinite(m.lat)&&Number.isFinite(m.lon));
 for(const [id,km] of m.nearby){assert.notEqual(id,code);assert(geography.municipalities[id]);assert(km>=0);}
 assert(m.nearby.every((n,i)=>i===0||n[1]>=m.nearby[i-1][1]));
}
const p={type:'town',url:'/provincias/bizkaia/bakio/'};
const result=addLocalGeography('<section class="section wrap"><span class="kicker">Directorio de Bizkaia</span><p>Alfabético</p></section><form><label class="wide local-address-field">Barrio</label></form>',p);
assert(result.includes('Basigo'));assert(result.includes('Maruri'));assert(result.includes('línea recta'));assert(!result.includes('Alfabético'));
assert.equal((result.match(/<li>/g)||[]).length,6);
assert.throws(()=>addLocalGeography('',{type:'town',url:'/inexistente/'}),/Falta geografía/);
console.log('GEOGRAFÍA OK: 4035 referencias, seis destinos válidos y distancias ordenadas; capital de Bakio y sustitución del orden alfabético.');
