import fs from 'node:fs';import path from 'node:path';import http from 'node:http';import assert from 'node:assert/strict';import {chromium} from 'playwright';
const root=path.resolve('dist'),out='browser-artifacts';fs.mkdirSync(out,{recursive:true});
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.webp':'image/webp','.jpeg':'image/jpeg','.svg':'image/svg+xml'};
const csp=fs.readFileSync(root+'/_headers','utf8').match(/Content-Security-Policy: ([^\n]+)/)[1];
const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://localhost'),f=path.resolve(root,'.'+u.pathname+(u.pathname.endsWith('/')?'index.html':''));if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');res.setHeader('Content-Security-Policy',csp);res.end(fs.readFileSync(f));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({headless:true,executablePath:process.env.TEST_CHROMIUM_EXECUTABLE_PATH||undefined}),metrics=[],specialtiesChecked=new Set();
try{
 for(const width of [320,390,430,768,1440]){
  const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:2}),p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  for(const route of ['/','/provincias/burgos/lerma/','/provincias/burgos/alfoz-de-quintanaduenas/','/provincias/leon/astorga/','/provincias/bizkaia/zalla/','/provincias/madrid/madrid/chamberi/']){
   await p.goto(base+route,{waitUntil:'networkidle'});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Desbordamiento '+route+' '+width);
   await p.locator('img[srcset]').evaluateAll(imgs=>Promise.all(imgs.map(i=>{i.loading='eager';return i.decode();})));
   const imgs=await p.locator('img[srcset]').evaluateAll(imgs=>imgs.map(i=>({src:i.currentSrc,loaded:i.naturalWidth})));assert(imgs.every(i=>i.loaded>0&&i.src.endsWith('.webp')),'Foto sin optimizar');
   if(route!=='/'){
    const centered=await p.locator('.local-equipment img').evaluateAll(imgs=>imgs.map(img=>{const a=img.getBoundingClientRect(),b=img.closest('figure').getBoundingClientRect();return Math.abs((a.left+a.right)/2-(b.left+b.right)/2)<=1;}));
    assert.equal(centered.length,5);assert(centered.every(Boolean),'Imágenes sin centrar '+route+' '+width);
   }
   if(width===390&&route.includes('lerma')){await p.locator('#direccion-local').screenshot({path:out+'/lerma-contexto-390.png'});await p.locator('#antenas').screenshot({path:out+'/lerma-servicio-390.png'});}
   if(width===390&&route!=='/'){
    for(const card of await p.locator('[data-specialty]').all()){
     const id=await card.getAttribute('data-specialty'),link=card.locator('[data-request-service]'),request=await link.getAttribute('data-request-service');
     await p.selectOption('[name="sintoma"]',{label:'No abre la puerta'});await link.click();assert.equal(await p.inputValue('[name="servicio"]'),request);assert.equal(await p.inputValue('[name="sintoma"]'),'');assert(!(await p.locator('#service-request-help').innerText()).includes('No fuerces la puerta'));specialtiesChecked.add(id);
     if(id==='cofdm'){
      await p.selectOption('[name="inmueble"]',{label:'Hotel o alojamiento'});await p.fill('[name="averia"]','Distribuir un receptor HD a las pantallas del hotel.');await p.evaluate(()=>{window.open=u=>{window.testSpecialtyMessage=u;};});await p.locator('#whatsapp-aviso').evaluate(f=>f.requestSubmit());
      const message=decodeURIComponent(await p.evaluate(()=>window.testSpecialtyMessage));assert(message.includes(request));assert(message.includes('Hotel o alojamiento'));assert(message.includes('34641589394'));
      await card.screenshot({path:out+'/cofdm-movistar-390.png'});
     }
    }
   }
  }
  await p.goto(base+'/provincias/burgos/lerma/');await p.locator('[data-request-service="Instalación de antenas Starlink"]').click();assert.equal(await p.inputValue('[name="servicio"]'),'Instalación de antenas Starlink');
  assert((await p.locator('#service-request-help').innerText()).includes('kit'));await p.selectOption('[name="inmueble"]',{label:'Vivienda particular'});await p.fill('[name="nucleo"]','Ruyales del Agua');await p.fill('[name="averia"]','Montaje del kit.');await p.evaluate(()=>{window.open=u=>{window.testMessage=u;};});await p.locator('#whatsapp-aviso').evaluate(f=>f.requestSubmit());
  const message=decodeURIComponent(await p.evaluate(()=>window.testMessage));assert(message.includes('34641589394'));assert(message.includes('Municipio: Lerma'));assert(message.includes('Barrio o localidad: Ruyales del Agua'));
  await p.selectOption('[name="provincia"]','madrid');await p.fill('[name="municipio"]','Madrid');assert.equal(await p.inputValue('[name="nucleo"]'),'');
  await p.locator('#whatsapp-aviso').evaluate(f=>f.requestSubmit());assert((await p.evaluate(()=>window.testMessage)).includes('34614789945'));
  assert.equal((await context.cookies()).length,0);assert.equal(await p.evaluate(()=>localStorage.length+sessionStorage.length),0);assert.equal(errors.length,0,errors.join('\n'));
  metrics.push({width,noOverflow:true,webpLoaded:true,imagesCentered:true,servicePreselection:true,nucleusMessage:true,phoneSwitch:true,cookies:0});await context.close();
 }
 assert.equal(specialtiesChecked.size,5,'Deben comprobarse las cinco especialidades en navegador');
 fs.writeFileSync(out+'/local-browser.json',JSON.stringify({metrics,specialtiesChecked:[...specialtiesChecked],hotelMessage:true},null,2));console.log('LOCAL NAVEGADOR OK: '+JSON.stringify({metrics,specialtiesChecked:[...specialtiesChecked],hotelMessage:true}));
}finally{await browser.close();server.close();}
