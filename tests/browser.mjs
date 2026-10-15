import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const root=path.resolve('dist'),out='browser-artifacts';fs.mkdirSync(out,{recursive:true});
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpeg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 const u=new URL(req.url,'http://localhost'),name=path.resolve(root,'.'+decodeURIComponent(u.pathname)+(u.pathname.endsWith('/')?'index.html':''));
 if(!name.startsWith(root+path.sep)||!fs.existsSync(name)){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',types[path.extname(name)]||'application/octet-stream');res.end(fs.readFileSync(name));
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true}),errors=[],metrics=[];
try{
 for(const width of [320,390,430,768,1440]){
  const page=await browser.newPage({viewport:{width,height:900}});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('h1').innerText(),'Profesional en antenas cerca de tu localidad');
  assert.equal(await page.locator('#servicios').evaluate(n=>n.nextElementSibling.id),'amplificacion');
  const measure=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,photoTop:document.querySelector('.intro-visual').getBoundingClientRect().top,photoBottom:document.querySelector('.intro-visual').getBoundingClientRect().bottom,phonesBottom:document.querySelector('.intro-phone-grid').getBoundingClientRect().bottom,stickyHeight:document.querySelector('.mobile-actions').getBoundingClientRect().height,photoLoaded:document.querySelector('.intro-visual img').naturalWidth}));
  assert(measure.scrollWidth<=width+1,'Desbordamiento en portada '+width);assert(measure.photoLoaded>0,'Foto rota');
  if(width<=430){assert(measure.photoTop<500,'Foto enterrada en móvil');assert(measure.phonesBottom<790,'Teléfonos enterrados en móvil');assert(measure.stickyHeight<100,'Barra inferior demasiado alta');}
  await page.screenshot({path:out+'/home-'+width+'.png'});metrics.push(measure);
  if(width===390){
   await page.locator('[name="localidad"]').fill('chamberi');await page.waitForFunction(()=>document.querySelector('.finder-results a')?.textContent.includes('Chamberí'));
   assert.equal(await page.locator('.finder-results a').first().getAttribute('href'),'/provincias/madrid/madrid/chamberi/');
   await page.locator('[name="localidad"]').fill('El Cañaveral');await page.waitForFunction(()=>document.querySelector('.finder-results a')?.textContent.includes('Vicálvaro'));
   await page.locator('[name="localidad"]').fill('Zalla');await page.waitForFunction(()=>document.querySelector('.finder-results a')?.textContent.includes('Zalla'));
   await page.locator('[name="zona"]').selectOption('madrid');await page.locator('[name="localidad"]').fill('alcala');await page.waitForFunction(()=>document.querySelector('.finder-results a')?.textContent.includes('Alcalá'));
   await page.locator('#amplificacion').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/amplificacion-390.png'});
  }
  for(const route of ['/provincias/madrid/','/provincias/madrid/madrid/','/provincias/madrid/madrid/fuencarral-el-pardo/','/provincias/bizkaia/zalla/']){
   await page.goto(base+route,{waitUntil:'networkidle'});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Desbordamiento '+width+' '+route);
  }
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto(base+'/provincias/madrid/madrid/chamberi/');
 await page.evaluate(()=>{window.open=url=>{window.lastWhatsApp=url;return null;};});
 await page.selectOption('[name="inmueble"]',{label:'Comunidad de propietarios'});await page.selectOption('[name="servicio"]',{label:'Cabeceras monocanal para comunidades'});await page.fill('[name="averia"]','Faltan canales en la comunidad.');
 await page.locator('#whatsapp-aviso').evaluate(f=>f.requestSubmit());
 const message=await page.evaluate(()=>window.lastWhatsApp);assert(message?.startsWith('https://wa.me/34614789945?'));assert(decodeURIComponent(message).includes('Distrito: Chamberí'));assert(decodeURIComponent(message).includes('Municipio: Madrid'));
 await page.selectOption('[name="provincia"]','bizkaia');await page.fill('[name="municipio"]','Zalla');await page.locator('#whatsapp-aviso').evaluate(f=>f.requestSubmit());
 const changed=await page.evaluate(()=>window.lastWhatsApp);assert(changed.startsWith('https://wa.me/34641589394?'));assert(!decodeURIComponent(changed).includes('Distrito:'));
 await page.close();assert.equal(errors.length,0,errors.join('\n'));
 fs.writeFileSync(out+'/metrics.json',JSON.stringify(metrics,null,2));console.log('NAVEGADOR OK: '+JSON.stringify(metrics));console.log('BUSCADOR Y WHATSAPP OK: municipios, distritos, búsqueda sin tildes, barrios de referencia y teléfono de la provincia sin envío real.');
}finally{await browser.close();server.close();}
