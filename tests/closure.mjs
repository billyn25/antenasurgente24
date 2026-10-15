import assert from 'node:assert/strict';
import fs from 'node:fs';
import {resolveDeployment} from '../scripts/deployment.mjs';
import {redirectRules,conciseLocal} from '../scripts/closure.mjs';
import {legalContent} from '../scripts/legal-content.mjs';
import site from '../config/site.json' with {type:'json'};
assert.equal(resolveDeployment(site,{CONTEXT:'production',URL:site.previewDomain,DEPLOY_PRIME_URL:'https://main--antenistaurgente24horas.netlify.app'}).base,site.previewDomain);
assert.equal(resolveDeployment({...site,launchReady:true},{CONTEXT:'production',URL:site.domain}).publicBuild,true);
assert.throws(()=>resolveDeployment({...site,launchReady:true},{CONTEXT:'production',URL:site.previewDomain}),/bloqueado/);
assert.equal(resolveDeployment({...site,launchReady:true},{CONTEXT:'deploy-preview',DEPLOY_PRIME_URL:'https://deploy-preview-10--antenistaurgente24horas.netlify.app'}).publicBuild,false);
assert.equal(resolveDeployment(site,{}).publicBuild,false);
assert.throws(()=>resolveDeployment({...site,domain:'http://example.com'},{}),/HTTPS/);
for(const [url,body] of Object.entries(legalContent(site))){assert(body.includes('R.F.G.'),url);assert(!body.includes('pendiente'),url);assert.equal((body.match(/<h1>/g)||[]).length,1);}
assert(redirectRules().includes('/:district/index.html'));assert(redirectRules().split('\n').filter(Boolean).every(x=>x.endsWith('301!')));
const source=['antenas','porteros','videoporteros'].map(id=>'<section class="service-detail" id="'+id+'"><h2>Encabezado</h2><p>Información inicial</p><p>Texto compartido que pasa a la guía</p><p>Preparar consulta</p></section>').join('');
const result=conciseLocal(source);assert(!result.includes('Texto compartido'));assert.equal((result.match(/Preparar consulta/g)||[]).length,3);
assert(!/localStorage|sessionStorage|document\.cookie\s*=/.test(fs.readFileSync('src/privacy-panel.js','utf8').replace(/\/\/[^\n]*/g,'')));
console.log('TESTS CIERRE OK: preview y producción separados, alias main-- corregido, 301 forzados, contenido y privacidad.');
