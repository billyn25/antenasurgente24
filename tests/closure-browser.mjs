import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {specialties} from '../scripts/local-specialty-copy.mjs';
const root=path.resolve('dist'),out='browser-artifacts';fs.mkdirSync(out,{recursive:true});
const csp=fs.readFileSync(root+'/_headers','utf8').match(/Content-Security-Policy: ([^\n]+)/)[1];
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.webp':'image/webp','.jpeg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');const f=path.resolve(root,'.'+url.pathname+(url.pathname.endsWith('/')?'index.html':''));if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){res.writeHead(404);res.end();return;}res.setHeader('Content-Security-Policy',csp);res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,executablePath:process.env.TEST_CHROMIUM_EXECUTABLE_PATH||undefined}),result={requests:[],pages:[],cookies:[],storage:[],errors:[],cataloguePages:[],formsWithSpecialties:[]};
try{
 const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage();
 page.on('request',r=>result.requests.push(r.url()));page.on('pageerror',e=>result.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')result.errors.push(m.text());});
 for(const route of ['/','/provincias/bizkaia/zalla/','/provincias/madrid/madrid/chamberi/','/servicios/starlink/','/aviso-legal/','/privacidad/','/cookies/']){
  await page.goto(base+route,{waitUntil:'networkidle'});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Desbordamiento '+route);
  const footer=page.locator('footer [data-service-footer="10"]');assert.equal(await footer.count(),1,'Falta catálogo de servicios en footer '+route);assert.equal(await footer.locator('a').count(),10);
  for(const specialty of specialties){const link=footer.locator('a[href="/#'+specialty.id+'"]');assert.equal(await link.count(),1,'Falta especialidad en footer '+specialty.id+' '+route);assert(await link.isVisible());}
  result.cataloguePages.push(route);
  if(await page.locator('#whatsapp-aviso').count()){
   const serviceOptions=await page.locator('[name="servicio"] option').evaluateAll(options=>options.map(o=>o.value)),propertyOptions=await page.locator('[name="inmueble"] option').evaluateAll(options=>options.map(o=>o.value));
   for(const specialty of specialties)assert.equal(serviceOptions.filter(value=>value===specialty.request).length,1,'Especialidad ausente o duplicada en formulario '+specialty.id+' '+route);
   for(const property of ['Local comercial','Bar o restaurante','Hotel o alojamiento'])assert.equal(propertyOptions.filter(value=>value===property).length,1,'Tipo de inmueble ausente o duplicado '+property+' '+route);
   result.formsWithSpecialties.push(route);
  }
  result.storage.push(await page.evaluate(()=>({url:location.pathname,cookies:document.cookie,local:localStorage.length,session:sessionStorage.length})));
  const button=page.locator('[data-whatsapp-ready]');if(await button.count())assert.equal(await button.isDisabled(),false);
  result.pages.push(route);
 }
 await page.locator('[data-privacy-open]').click();assert(await page.locator('#privacy-panel').isVisible());
 assert.equal(await page.locator('#privacy-panel').getAttribute('open'),'');await page.screenshot({path:out+'/cookies-panel-390.png'});
 await page.keyboard.press('Escape');assert.equal(await page.locator('#privacy-panel').isVisible(),false);
 assert.equal(await page.locator('[data-privacy-open]').evaluate(n=>document.activeElement===n),true);
 result.cookies=await context.cookies();assert.equal(result.cookies.length,0);assert(result.storage.every(x=>x.cookies===''&&x.local===0&&x.session===0));
 assert(result.requests.every(url=>new URL(url).origin===base),'Carga externa antes de una acción del usuario');assert.equal(result.errors.length,0,result.errors.join('\n'));
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),p=await nojs.newPage();await p.goto(base+'/provincias/bizkaia/zalla/');assert(await p.locator('[data-whatsapp-ready]').isDisabled());assert(await p.locator('a[href="tel:+34641589394"]').count()>0);
 const nojsCatalogue=p.locator('nav.local-nav[data-service-catalogue="10"] a[data-catalogue-service]');assert.equal(await nojsCatalogue.count(),10);for(const link of await nojsCatalogue.all())assert(await link.isVisible(),'El catálogo debe verse sin JavaScript');await nojs.close();
 result.sameOriginOnly=true;result.noJavaScriptFormSafe=true;result.noJavaScriptCatalogueServices=10;fs.writeFileSync(out+'/privacy-runtime.json',JSON.stringify(result,null,2));console.log('PRIVACIDAD EN NAVEGADOR OK: sin cookies ni almacenamiento, sin solicitudes externas; panel accesible, diez servicios visibles y formulario sin envío nativo.');
}finally{await browser.close();server.close();}
