import fs from 'node:fs';
import {chromium} from 'playwright';
import site from '../config/site.json' with {type:'json'};
import {version,serviceUrl} from '../scripts/starlink.mjs';
const origin=site.previewDomain,result={origin,expectedVersion:version,verified:false};
for(let attempt=0;attempt<8;attempt++){
 try{
  const response=await fetch(origin+'/build-report.json?revision='+version+'&t='+Date.now(),{signal:AbortSignal.timeout(10000),cache:'no-store'});if(!response.ok)throw Error('HTTP '+response.status);const report=await response.json();
  if(report.starlink?.version!==version||report.serviceFooter.services!==5)throw Error('Netlify todavía sirve otra revisión');
  const home=await fetch(origin+'/?revision='+version,{signal:AbortSignal.timeout(10000)}).then(r=>r.text());if(!home.includes('name="starlink-version" content="'+version)||!home.includes('class="contact-north"'))throw Error('Portada anterior');
  const service=await fetch(origin+serviceUrl,{signal:AbortSignal.timeout(10000)});if(!service.ok||!(await service.text()).includes('Instalación de antenas Starlink'))throw Error('Servicio Starlink pendiente');
  const district=await fetch(origin+'/provincias/madrid/madrid/chamberi/',{signal:AbortSignal.timeout(10000)});if(!district.ok||!(await district.text()).includes('Instalación de antenas Starlink en Chamberí'))throw Error('Distrito pendiente');
  result.verified=true;result.pages=report.totalPages;result.services=5;result.districts=report.totalDistricts;break;
 }catch(error){result.lastObservation=error.message;console.log('NETLIFY: '+error.message);if(attempt<7)await new Promise(r=>setTimeout(r,5000));}
}
fs.mkdirSync('browser-artifacts',{recursive:true});
if(result.verified){const browser=await chromium.launch({headless:true});try{
 const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto(origin+'/?revision='+version,{waitUntil:'networkidle',timeout:30000});
 result.mobile=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,north:document.querySelector('.contact-north')?.innerText,cards:document.querySelectorAll('#servicios .service-card').length,servicesFirst:document.querySelector('.intro-home')?.nextElementSibling?.id==='servicios',starsAfterProperties:document.querySelector('#tipos-instalacion')?.nextElementSibling?.id==='confianza'}));await page.screenshot({path:'browser-artifacts/netlify-norte-390.png'});
 await page.locator('#servicios').scrollIntoViewIfNeeded();await page.locator('#servicios img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));await page.locator('#servicios').screenshot({path:'browser-artifacts/netlify-servicios-starlink-390.png'});
 result.mobileVerified=result.mobile.scrollWidth<=390&&result.mobile.cards===5&&result.mobile.north.includes('CASTILLA Y LEÓN')&&result.mobile.servicesFirst&&result.mobile.starsAfterProperties;
}catch(error){result.mobileVerified=false;result.mobileError=error.message;}finally{await browser.close();}}
fs.writeFileSync('browser-artifacts/netlify-status.json',JSON.stringify(result,null,2));console.log((result.verified?'NETLIFY PUBLICADO: ':'NETLIFY PENDIENTE: ')+JSON.stringify(result));
