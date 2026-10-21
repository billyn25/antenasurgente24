import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {serviceName} from '../scripts/starlink.mjs';
import {specialties} from '../scripts/local-specialty-copy.mjs';
const root=path.resolve('dist'),out='browser-artifacts';fs.mkdirSync(out,{recursive:true});
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.webp':'image/webp','.jpeg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://localhost'),name=path.resolve(root,'.'+decodeURIComponent(u.pathname)+(u.pathname.endsWith('/')?'index.html':''));if(!name.startsWith(root+path.sep)||!fs.existsSync(name)){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',types[path.extname(name)]||'application/octet-stream');res.end(fs.readFileSync(name));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,executablePath:process.env.TEST_CHROMIUM_EXECUTABLE_PATH||undefined}),errors=[],metrics=[];
try{
 for(const width of [320,390,430,768,1440]){
  const page=await browser.newPage({viewport:{width,height:900}});page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('h1').innerText(),'Profesional en antenas cerca de tu localidad');assert.equal(await page.locator('#servicios .service-card').count(),10);
  assert.equal(await page.locator('#servicios .service-card-specialty').count(),5);
  for(const specialty of specialties){const card=page.locator('#servicios .service-card-specialty[data-catalogue-service="'+specialty.id+'"]');assert.equal(await card.count(),1,'Falta especialidad en portada: '+specialty.id);assert(await card.isVisible());assert((await card.locator('h3').innerText()).trim().length>0);assert.equal(await card.locator('img').count(),0);}
  assert.equal(await page.locator('.intro-home').evaluate(n=>n.nextElementSibling.id),'servicios');assert.equal(await page.locator('#tipos-instalacion').evaluate(n=>n.nextElementSibling.id),'confianza');
  const m=await page.evaluate(()=>{const n=document.querySelector('.contact-north'),c=document.querySelector('.intro-phone-grid>a:not(.contact-north)');return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,photoTop:document.querySelector('.intro-visual').getBoundingClientRect().top,phonesBottom:document.querySelector('.intro-phone-grid').getBoundingClientRect().bottom,northLabel:getComputedStyle(n.querySelector('small')).fontSize,northWeight:getComputedStyle(n.querySelector('small')).fontWeight,northNumber:getComputedStyle(n.querySelector('strong')).fontSize,centralNumber:getComputedStyle(c.querySelector('strong')).fontSize,northWidth:n.getBoundingClientRect().width,centralTop:c.getBoundingClientRect().top,northTop:n.getBoundingClientRect().top,sticky:document.querySelector('.mobile-actions').getBoundingClientRect().height};});
  assert(m.scrollWidth<=width+1,'Portada desbordada '+width);assert(Number(m.northWeight)>=750);assert(parseFloat(m.northNumber)>parseFloat(m.centralNumber),'Norte sin prioridad');
  if(width<=430){assert(m.phonesBottom<820,'Contacto demasiado bajo');assert(m.northWidth>width*.8,'Norte no ocupa una fila');assert(m.centralTop>m.northTop);assert(m.sticky<100);}
  await page.screenshot({path:out+'/home-'+width+'.png'});
  await page.locator('#servicios').scrollIntoViewIfNeeded();await page.locator('#servicios img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
  const cards=await page.locator('#servicios .service-card:not(.service-card-specialty)').evaluateAll(nodes=>nodes.map(n=>({w:n.getBoundingClientRect().width,h:n.getBoundingClientRect().height,photo:n.querySelector('img')?.naturalWidth||0,font:getComputedStyle(n.querySelector('h3')).fontSize})));assert.equal(cards.length,5);assert(cards.every(c=>c.photo>0));assert(cards[4].h<=Math.max(...cards.slice(0,4).map(c=>c.h))+50,'Starlink acapara el bloque');
  await page.locator('#servicios').screenshot({path:out+'/servicios-'+width+'.png'});
  await page.locator('#cobertura').scrollIntoViewIfNeeded();await page.locator('.coverage-map img').evaluate(i=>i.decode());assert.deepEqual(await page.locator('.coverage-stats dd').allTextContents(),['10','8','20',(4035).toLocaleString('es-ES')]);
  if(width===390){
   for(const specialty of specialties){const link=page.locator('#servicios .service-card-specialty[data-catalogue-service="'+specialty.id+'"] [data-request-service]');assert.equal(await link.getAttribute('data-request-service'),specialty.request);assert.equal(await link.getAttribute('href'),'#contacto');await link.click();assert.equal(await page.inputValue('[name="servicio"]'),specialty.request,'La tarjeta no selecciona el servicio: '+specialty.id);}
   await page.locator('.intro-contacts').screenshot({path:out+'/norte-390.png'});await page.locator('[name="localidad"]').fill('chamberi');await page.waitForFunction(()=>document.querySelector('.finder-results a')?.textContent.includes('Chamberí'));await page.locator('[name="localidad"]').fill('El Cañaveral');await page.waitForFunction(()=>document.querySelector('.finder-results a')?.textContent.includes('Vicálvaro'));await page.locator('[name="localidad"]').fill('Zalla');await page.waitForFunction(()=>document.querySelector('.finder-results a')?.textContent.includes('Zalla'));
  }
  for(const route of ['/servicios/starlink/','/provincias/madrid/','/provincias/madrid/madrid/','/provincias/madrid/madrid/fuencarral-el-pardo/','/provincias/bizkaia/zalla/']){
   await page.goto(base+route,{waitUntil:'networkidle'});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Desbordamiento '+width+' '+route);
   if(route==='/servicios/starlink/'){assert.equal(await page.inputValue('[name="servicio"]'),serviceName);await page.locator('.starlink-photo img').evaluate(i=>i.decode());if(width===390)await page.screenshot({path:out+'/starlink-390.png'});}
   if(route.endsWith('/zalla/')||route.endsWith('/fuencarral-el-pardo/')){assert.equal(await page.locator('#starlink').count(),1);await page.locator('#starlink img').scrollIntoViewIfNeeded();await page.locator('#starlink img').evaluate(i=>i.decode());}
  }
  metrics.push({...m,cards});await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto(base+'/provincias/madrid/madrid/chamberi/');await page.evaluate(()=>{window.open=url=>{window.testWhatsApp=url;return null;};});
 await page.selectOption('[name="inmueble"]',{label:'Comunidad de propietarios'});await page.selectOption('[name="servicio"]',{label:serviceName});await page.fill('[name="averia"]','Montaje de antena Starlink en cubierta.');await page.locator('#whatsapp-aviso').evaluate(f=>f.requestSubmit());
 let url=await page.evaluate(()=>window.testWhatsApp);assert(url?.startsWith('https://wa.me/34614789945?'));assert(decodeURIComponent(url).includes('Distrito: Chamberí'));assert(decodeURIComponent(url).includes(serviceName));
 await page.selectOption('[name="provincia"]','bizkaia');await page.fill('[name="municipio"]','Zalla');await page.locator('#whatsapp-aviso').evaluate(f=>f.requestSubmit());url=await page.evaluate(()=>window.testWhatsApp);assert(url.startsWith('https://wa.me/34641589394?'));assert(!decodeURIComponent(url).includes('Distrito:'));
 await page.close();assert.equal(errors.length,0,errors.join('\n'));fs.writeFileSync(out+'/metrics-starlink.json',JSON.stringify(metrics,null,2));console.log('NAVEGADOR STARLINK Y NORTE OK: '+JSON.stringify(metrics));console.log('Buscador, distritos, cinco fotos, diez servicios y selección de las cinco especialidades en portada comprobados; ningún mensaje enviado.');
}finally{await browser.close();server.close();}
