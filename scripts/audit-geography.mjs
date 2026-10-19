import fs from 'node:fs';
import assert from 'node:assert/strict';
import {byRoute} from './local-geography.mjs';
import {fileFor} from './starlink.mjs';
const report=JSON.parse(fs.readFileSync('dist/build-report.json','utf8'));
const routes=new Set(report.pages.map(p=>p.url));let count=0;
for(const p of report.pages.filter(p=>p.type==='town')){
 const m=byRoute.get(p.url);assert(m,p.url);const html=fs.readFileSync(fileFor('dist',p.url),'utf8');
 assert(html.includes('id="municipios-proximos"'),p.url);assert(!html.includes('Enlaces del directorio por orden alfabético'),p.url);
 assert(html.includes('name="sintoma"')&&html.includes('name="alcance"'),p.url);
 assert(!/¿Instaláis porteros automáticos en/.test(html),p.url+': FAQ redundante');
 for(const [code] of m.nearby){const {geography}=await import('./local-geography.mjs');const target=geography.municipalities[code].url;assert(routes.has(target),target);assert(html.includes('href="'+target+'"'),p.url);}
 count++;
}
assert.equal(count,4035);console.log('AUDITORÍA GEOGRÁFICA OK: 4035 fichas con seis municipios próximos enlazados, campos de avería y alcance, sin las dos FAQs duplicadas.');
