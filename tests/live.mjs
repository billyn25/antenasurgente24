import fs from 'node:fs';
import {chromium} from 'playwright';
import site from '../config/site.json' with {type:'json'};
import {version} from '../scripts/navigation.mjs';
const origin=site.previewDomain,result={origin,expectedVersion:version,verified:false};
// Netlify is asynchronous and independent of GitHub Actions. An old deployment
// is reported as pending, never as a successful publication of this revision.
for(let attempt=0;attempt<8;attempt++){
 try{
  const response=await fetch(origin+'/build-report.json?revision='+version+'&attempt='+Date.now(),{signal:AbortSignal.timeout(10000),cache:'no-store'});
  if(!response.ok)throw Error('HTTP '+response.status);
  const report=await response.json();
  if(report.navigation?.version!==version||report.totalDistricts!==21)throw Error('Netlify todavía sirve otra revisión');
  const home=await fetch(origin+'/?revision='+version,{signal:AbortSignal.timeout(10000)}).then(r=>r.text());
  if(!home.includes('navigation-version" content="'+version))throw Error('La portada y el informe no coinciden');
  const district=await fetch(origin+'/provincias/madrid/madrid/chamberi/',{signal:AbortSignal.timeout(10000)});
  if(!district.ok||!(await district.text()).includes('Chamberí, Madrid'))throw Error('La ficha de distrito no está publicada');
  result.verified=true;result.pages=report.totalPages;result.districts=report.totalDistricts;break;
 }catch(error){result.lastObservation=String(error.message);console.log('NETLIFY: '+result.lastObservation);if(attempt<7)await new Promise(r=>setTimeout(r,5000));}
}
fs.mkdirSync('browser-artifacts',{recursive:true});
if(result.verified){
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.goto(origin+'/?revision='+version,{waitUntil:'networkidle',timeout:30000});
  result.mobile=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,photoLoaded:document.querySelector('.intro-visual img')?.naturalWidth||0,phonesBottom:document.querySelector('.intro-phone-grid')?.getBoundingClientRect().bottom||null}));
  await page.screenshot({path:'browser-artifacts/netlify-live-390.png'});
  result.mobileVerified=result.mobile.scrollWidth<=390&&result.mobile.photoLoaded>0&&result.mobile.phonesBottom<790;
 }catch(error){result.mobileVerified=false;result.mobileError=String(error.message);}finally{await browser.close();}
}
fs.writeFileSync('browser-artifacts/netlify-status.json',JSON.stringify(result,null,2));
console.log((result.verified?'NETLIFY PUBLICADO: ':'NETLIFY PENDIENTE DE VERIFICAR: ')+JSON.stringify(result));
