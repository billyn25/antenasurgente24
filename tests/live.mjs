import fs from 'node:fs';
import {chromium} from 'playwright';
import site from '../config/site.json' with {type:'json'};
import {version} from '../scripts/service-footer.mjs';
const origin=site.previewDomain,result={origin,expectedVersion:version,verified:false};
// A previous Netlify revision must never be reported as publication of this one.
for(let attempt=0;attempt<8;attempt++){
 try{
  const response=await fetch(origin+'/build-report.json?revision='+version+'&attempt='+Date.now(),{signal:AbortSignal.timeout(10000),cache:'no-store'});
  if(!response.ok)throw Error('HTTP '+response.status);const report=await response.json();
  if(report.serviceFooter?.version!==version||report.totalDistricts!==21)throw Error('Netlify todavía sirve otra revisión');
  const home=await fetch(origin+'/?revision='+version,{signal:AbortSignal.timeout(10000)}).then(r=>r.text());
  if(!home.includes('service-footer-version" content="'+version)||!home.includes('id="cobertura"'))throw Error('La portada y el informe no coinciden');
  const map=await fetch(origin+'/assets/cobertura-espana.svg?revision='+version,{signal:AbortSignal.timeout(10000)});
  if(!map.ok||(await map.text()).match(/data-province=/g)?.length!==20)throw Error('Mapa no publicado o incompleto');
  const district=await fetch(origin+'/provincias/madrid/madrid/chamberi/',{signal:AbortSignal.timeout(10000)});
  if(!district.ok||!(await district.text()).includes('Chamberí, Madrid'))throw Error('La ficha de distrito no está publicada');
  result.verified=true;result.pages=report.totalPages;result.districts=report.totalDistricts;result.services=report.serviceFooter.services;result.regions=report.serviceFooter.regions.length;result.provinces=report.serviceFooter.provinces;break;
 }catch(error){result.lastObservation=String(error.message);console.log('NETLIFY: '+result.lastObservation);if(attempt<7)await new Promise(r=>setTimeout(r,5000));}
}
fs.mkdirSync('browser-artifacts',{recursive:true});
if(result.verified){
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.goto(origin+'/?revision='+version,{waitUntil:'networkidle',timeout:30000});
  result.mobile=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,photoLoaded:document.querySelector('.intro-visual img')?.naturalWidth||0,phonesBottom:document.querySelector('.intro-phone-grid')?.getBoundingClientRect().bottom||null,cards:document.querySelectorAll('#servicios .service-card').length}));
  await page.screenshot({path:'browser-artifacts/netlify-live-390.png'});
  await page.locator('#cobertura').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('.coverage-map img')?.naturalWidth>0);
  await page.locator('#cobertura').screenshot({path:'browser-artifacts/netlify-cobertura-390.png'});
  result.mobileVerified=result.mobile.scrollWidth<=390&&result.mobile.photoLoaded>0&&result.mobile.phonesBottom<790&&result.mobile.cards===4;
  result.footerVerified=(await page.locator('.coverage-map img').evaluate(i=>i.naturalWidth))>0;
 }catch(error){result.mobileVerified=false;result.mobileError=String(error.message);}finally{await browser.close();}
}
fs.writeFileSync('browser-artifacts/netlify-status.json',JSON.stringify(result,null,2));
console.log((result.verified?'NETLIFY PUBLICADO: ':'NETLIFY PENDIENTE DE VERIFICAR: ')+JSON.stringify(result));
