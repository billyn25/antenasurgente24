import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import site from '../config/site.json' with {type:'json'};
import {version} from '../scripts/closure.mjs';
const origin=site.previewDomain,result={version,origin,verified:false,checks:[]};let report;
for(let i=0;i<15;i++){
 try{const r=await fetch(origin+'/build-report.json?closure='+Date.now(),{signal:AbortSignal.timeout(10000)});report=await r.json();if(report.closure?.version!==version)throw Error('Despliegue anterior');break;}catch(e){if(i===14)throw e;await new Promise(r=>setTimeout(r,4000));}
}
assert.equal(report.base,site.launchReady?site.domain:origin);
const paths=[['/',200],['/index.html',301,'/'],['/provincias/bizkaia/zalla/index.html',301,'/provincias/bizkaia/zalla/'],['/provincias/madrid/madrid/chamberi/index.html',301,'/provincias/madrid/madrid/chamberi/'],['/servicios/starlink/index.html',301,'/servicios/starlink/'],['/aviso-legal/index.html',301,'/aviso-legal/'],['/no-existe-auditoria-cierre/',404],['/cookies/',200],['/robots.txt',200]];
for(const [path,status,destination] of paths){
 const response=await fetch(origin+path,{redirect:'manual',signal:AbortSignal.timeout(10000)});assert.equal(response.status,status,path);
 if(destination)assert.equal(new URL(response.headers.get('location'),origin).pathname,destination,path);
 const html=await response.text();if(path==='/'){assert(html.includes('href="'+report.base+'/"'));assert(html.includes('closure-version" content="'+version));assert(response.headers.get('content-security-policy')?.includes("script-src 'self'"));}
 result.checks.push({path,status:response.status,location:response.headers.get('location')});
}
const browser=await chromium.launch({headless:true});
try{
 const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),requests=[],errors=[];
 page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/?closure='+version,{waitUntil:'networkidle'});assert.equal(await page.locator('#servicios .service-card').count(),5);assert(await page.locator('.contact-north').innerText().then(t=>t.includes('CASTILLA Y LEÓN')));assert.equal(await page.locator('[data-whatsapp-ready]').isDisabled(),false);
 await page.locator('[data-privacy-open]').click();assert(await page.locator('#privacy-panel').isVisible());
 fs.mkdirSync('browser-artifacts',{recursive:true});await page.screenshot({path:'browser-artifacts/cierre-privacidad-publicada-390.png'});await page.keyboard.press('Escape');
 assert.equal((await context.cookies()).length,0);assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);assert(requests.every(u=>new URL(u).origin===origin));assert.equal(errors.length,0);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.goto(origin+'/provincias/burgos/lerma/?closure='+version,{waitUntil:'networkidle'});
 assert(await page.locator('#direccion-local').innerText().then(t=>t.includes('Ruyales del Agua')));
 await page.locator('[data-request-service="Instalación de antenas Starlink"]').click();assert.equal(await page.inputValue('[name="servicio"]'),'Instalación de antenas Starlink');
 await page.locator('#antenas img').scrollIntoViewIfNeeded();await page.locator('#antenas img').evaluate(i=>i.decode());assert(await page.locator('#antenas img').evaluate(i=>i.currentSrc.endsWith('.webp')));
 await page.locator('#direccion-local').screenshot({path:'browser-artifacts/lerma-publicada-390.png'});
 result.localContentVerified=true;result.webpVerified=true;
 result.cookies=0;result.storage=0;result.externalRequests=0;result.mobileVerified=true;result.verified=true;
}finally{await browser.close();}
fs.writeFileSync('browser-artifacts/cierre-live.json',JSON.stringify(result,null,2));console.log('CIERRE NETLIFY VERIFICADO: '+JSON.stringify(result));
