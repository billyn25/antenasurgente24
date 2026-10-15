import assert from 'node:assert/strict';
import fs from 'node:fs';
import {resolveDeployment} from '../scripts/deployment.mjs';
import {redirectRules,conciseLocal} from '../scripts/closure.mjs';
import {legalContent} from '../scripts/legal-content.mjs';
import site from '../config/site.json' with {type:'json'};
// Test the unpublished state explicitly, independently of the live launch flag.
assert.equal(resolveDeployment({...site,launchReady:false},{CONTEXT:'production',URL:site.previewDomain,DEPLOY_PRIME_URL:'https://main--antenistaurgente24horas.netlify.app'}).base,site.previewDomain);
assert.equal(resolveDeployment({...site,launchReady:true},{CONTEXT:'production',URL:site.domain}).publicBuild,true);
assert.equal(resolveDeployment({...site,launchReady:true},{CONTEXT:'production',URL:site.domain,DEPLOY_PRIME_URL:'https://main--antenistaurgente24horas.netlify.app'}).base,site.domain);
assert.throws(()=>resolveDeployment({...site,launchReady:true},{CONTEXT:'production',URL:site.previewDomain}),/bloqueado/);
for(const context of ['deploy-preview','branch-deploy']){
 const preview=resolveDeployment({...site,launchReady:true},{CONTEXT:context,URL:site.domain,DEPLOY_PRIME_URL:'https://deploy-preview-10--antenistaurgente24horas.netlify.app'});
 assert.equal(preview.publicBuild,false);assert.notEqual(preview.base,site.domain);
}
assert.equal(resolveDeployment(site,{}).publicBuild,false);
assert.throws(()=>resolveDeployment({...site,domain:'http://example.com'},{}),/HTTPS/);
for(const [url,body] of Object.entries(legalContent(site))){assert(body.includes('R.F.G.'),url);assert(!body.includes('pendiente'),url);assert.equal((body.match(/<h1>/g)||[]).length,1);}
assert(redirectRules().includes('/:district/index.html'));assert(redirectRules().split('\n').filter(Boolean).every(x=>x.endsWith('301!')));
const source=['antenas','porteros','videoporteros'].map(id=>'<section class="service-detail" id="'+id+'"><h2>Encabezado</h2><p>Información inicial</p><p>Texto compartido que pasa a la guía</p><p>Preparar consulta</p></section>').join('');
const result=conciseLocal(source);assert(!result.includes('Texto compartido'));assert.equal((result.match(/Preparar consulta/g)||[]).length,3);
assert(!/localStorage|sessionStorage|document\.cookie\s*=/.test(fs.readFileSync('src/privacy-panel.js','utf8').replace(/\/\/[^\n]*/g,'')));
console.log('TESTS CIERRE OK: dominio .com en producción; previsualizaciones noindex; sin confundir el alias main-- con el dominio público.');
