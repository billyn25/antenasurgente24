import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const root=path.resolve('dist'),out='browser-artifacts';fs.mkdirSync(out,{recursive:true});
const csp=fs.readFileSync(root+'/_headers','utf8').match(/Content-Security-Policy: ([^\n]+)/)[1];
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpeg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');const f=path.resolve(root,'.'+url.pathname+(url.pathname.endsWith('/')?'index.html':''));if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){res.writeHead(404);res.end();return;}res.setHeader('Content-Security-Policy',csp);res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true}),result={requests:[],pages:[],cookies:[],storage:[],errors:[]};
try{
 const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage();
 page.on('request',r=>result.requests.push(r.url()));page.on('pageerror',e=>result.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')result.errors.push(m.text());});
 for(const route of ['/','/provincias/bizkaia/zalla/','/provincias/madrid/madrid/chamberi/','/servicios/starlink/','/aviso-legal/','/privacidad/','/cookies/']){
  await page.goto(base+route,{waitUntil:'networkidle'});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Desbordamiento '+route);
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
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),p=await nojs.newPage();await p.goto(base+'/provincias/bizkaia/zalla/');assert(await p.locator('[data-whatsapp-ready]').isDisabled());assert(await p.locator('a[href="tel:+34641589394"]').count()>0);await nojs.close();
 result.sameOriginOnly=true;result.noJavaScriptFormSafe=true;fs.writeFileSync(out+'/privacy-runtime.json',JSON.stringify(result,null,2));console.log('PRIVACIDAD EN NAVEGADOR OK: sin cookies ni almacenamiento, sin solicitudes externas; panel accesible y formulario sin envío nativo.');
}finally{await browser.close();server.close();}
