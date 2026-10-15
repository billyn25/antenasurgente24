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
  assert.equal(await page.locator('#servicios .service-card').count(),4);
  assert(await page.locator('#amplificacion').evaluate(n=>Boolean(n.closest('#servicios'))),'La amplificación debe estar integrada en las tarjetas');
  const cards=await page.locator('#servicios .service-card').evaluateAll(nodes=>nodes.map(n=>({width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height,font:getComputedStyle(n.querySelector('h3')).fontSize})));
  assert.equal(new Set(cards.map(c=>c.font)).size,1,'Los cuatro títulos deben tener la misma jerarquía');
  assert(Math.max(...cards.map(c=>c.width))-Math.min(...cards.map(c=>c.width))<2,'Las tarjetas deben tener el mismo ancho');
  if(width>=1200)assert(Math.max(...cards.map(c=>c.height))-Math.min(...cards.map(c=>c.height))<2,'Tarjetas desiguales en escritorio');
  const measure=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,photoTop:document.querySelector('.intro-visual').getBoundingClientRect().top,photoBottom:document.querySelector('.intro-visual').getBoundingClientRect().bottom,phonesBottom:document.querySelector('.intro-phone-grid').getBoundingClientRect().bottom,stickyHeight:document.querySelector('.mobile-actions').getBoundingClientRect().height,photoLoaded:document.querySelector('.intro-visual img').naturalWidth}));
  assert(measure.scrollWidth<=width+1,'Desbordamiento en portada '+width);assert(measure.photoLoaded>0,'Foto rota');
  if(width<=430){assert(measure.photoTop<500,'Foto enterrada en móvil');assert(measure.phonesBottom<790,'Teléfonos enterrados en móvil');assert(measure.stickyHeight<100,'Barra inferior demasiado alta');}
  await page.screenshot({path:out+'/home-'+width+'.png'});
  await page.locator('#cobertura').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector('.coverage-map img')?.naturalWidth>0);
  assert.deepEqual(await page.locator('.coverage-stats dd').allTextContents(),['4','8','20','4.035']);
  assert.equal(await page.locator('#cobertura .coverage-map li a').count(),20);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Desbordamiento en mapa '+width);
  metrics.push({...measure,cards,footerMapLoaded:true,footerProvinces:20});
  if(width===390||width===1440){
   await page.locator('#cobertura').screenshot({path:out+'/cobertura-'+width+'.png'});
   await page.locator('#servicios').scrollIntoViewIfNeeded();
   await page.locator('#servicios .cards img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));
   await page.waitForFunction(()=>[...document.querySelectorAll('#servicios .cards img')].every(i=>i.complete&&i.naturalWidth>0));
   await page.locator('#servicios').screenshot({path:out+'/servicios-'+width+'.png'});
  }
  if(width===390){
   await page.locator('[name="localidad"]').fill('chamberi');await page.waitForFunction(()=>document.querySelector('.finder-results a')?.textContent.includes('Chamberí'));
   assert.equal(await page.locator('.finder-results a').first().getAttribute('href'),'/provincias/madrid/madrid/chamberi/');
   await page.locator('[name="localidad"]').fill('El Cañaveral');await page.waitForFunction(()=>document.querySelector('.finder-results a')?.textContent.includes('Vicálvaro'));
   await page.locator('[name="localidad"]').fill('Zalla');await page.waitForFunction(()=>document.querySelector('.finder-results a')?.textContent.includes('Zalla'));
   await page.locator('[name="zona"]').selectOption('madrid');await page.locator('[name="localidad"]').fill('alcala');await page.waitForFunction(()=>document.querySelector('.finder-results a')?.textContent.includes('Alcalá'));
  }
  for(const route of ['/provincias/madrid/','/provincias/madrid/madrid/','/provincias/madrid/madrid/fuencarral-el-pardo/','/provincias/bizkaia/zalla/']){
   await page.goto(base+route,{waitUntil:'networkidle'});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Desbordamiento '+width+' '+route);
   assert.equal(await page.locator('#cobertura').count(),1,'Falta pie en '+route);
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
 fs.writeFileSync(out+'/metrics.json',JSON.stringify(metrics,null,2));console.log('NAVEGADOR OK: '+JSON.stringify(metrics));console.log('BUSCADOR, WHATSAPP Y MAPA OK: cuatro servicios equilibrados, mapa y contadores a cinco anchos; municipios, distritos y teléfonos conservados, sin envío real.');
}finally{await browser.close();server.close();}
