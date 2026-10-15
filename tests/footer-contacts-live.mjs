/** Read-only HTTP and browser verification on the actual production domain. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import site from '../config/site.json' with {type:'json'};
import {verifyFooterContacts,footerContacts,footerContactsVersion} from '../scripts/footer-contacts.mjs';
const built=JSON.parse(fs.readFileSync('dist/build-report.json','utf8'));
const origin=site.domain,out='browser-artifacts',result={origin,version:footerContactsVersion,commit:process.env.GITHUB_SHA||null,generatedPages:built.totalPages,samples:[],browser:[],ok:false};
fs.mkdirSync(out,{recursive:true});
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function read(route){const r=await fetch(origin+route,{redirect:'manual',headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(20000)});assert.equal(r.status,200,route+': HTTP '+r.status);return {r,html:await r.text()};}
let browser;
try{
 let ready=false;
 for(let i=0;i<24;i++){
  try{const {html}=await read('/');verifyFooterContacts(html,'Portada');assert(html.includes('/assets/'+built.closure.css));ready=true;break;}
  catch(error){result.lastObservation=error.message;if(i<23)await pause(10000);}
 }
 assert(ready,'No se ha confirmado la publicación de los teléfonos del pie');
 const rows=built.pages.filter(p=>['home','service','province','district','legal'].includes(p.type));
 for(const province of new Set(built.pages.filter(p=>p.type==='town').map(p=>p.province)))rows.push(built.pages.find(p=>p.type==='town'&&p.province===province));
 const unique=[...new Map(rows.map(p=>[p.url,p])).values()];let next=0;
 await Promise.all(Array.from({length:4},async()=>{
  while(next<unique.length){const p=unique[next++];let last;
   for(let attempt=0;attempt<3;attempt++){
    try{const {r,html}=await read(p.url);verifyFooterContacts(html,p.url);
     assert.equal(html.match(/rel="canonical" href="([^"]+)"/)?.[1],origin+p.url,p.url+': canonical');
     assert.equal(html.match(/name="robots" content="([^"]+)"/)?.[1],p.noindex?'noindex,follow':'index,follow,max-image-preview:large',p.url+': robots');
     if(!p.noindex)assert(!/noindex/i.test(r.headers.get('x-robots-tag')||''),p.url+': bloqueo HTTP');
     assert(html.includes('/assets/'+built.closure.css),p.url+': hoja CSS de otra versión');
     result.samples.push({url:origin+p.url,type:p.type,status:r.status,footerPhones:true,ok:true});last=null;break;
    }catch(e){last=e;if(attempt<2)await pause(1500);}
   }
   if(last)result.samples.push({url:origin+p.url,type:p.type,ok:false,error:last.message});
  }
 }));
 assert.equal(result.samples.length,unique.length);assert(result.samples.every(p=>p.ok),'Hay páginas con teléfonos de pie pendientes');
 const {html:css}=await read('/assets/'+built.closure.css);assert.equal(css,fs.readFileSync('dist/assets/'+built.closure.css,'utf8'),'CSS publicado distinto');
 browser=await chromium.launch({headless:true});
 for(const [width,javascript] of [[320,true],[390,true],[768,true],[1440,true],[390,false]]){
  const context=await browser.newContext({viewport:{width,height:950},javaScriptEnabled:javascript});
  const page=await context.newPage();
  for(const route of ['/','/provincias/madrid/madrid/chamberi/','/provincias/burgos/lerma/']){
   await page.goto(origin+route,{waitUntil:'networkidle'});
   const panel=page.locator('.footer-contact-zones');await panel.scrollIntoViewIfNeeded();
   assert.equal(await panel.count(),1);assert(await panel.isVisible());
   for(const c of footerContacts){const card=panel.locator(`[data-footer-zone="${c.key}"]`),phone=card.locator('.footer-contact-number'),wa=card.locator('.footer-contact-whatsapp');
    assert.equal(await phone.innerText(),c.display);assert.equal(await phone.getAttribute('href'),'tel:'+c.tel);assert.equal(await wa.getAttribute('href'),'https://wa.me/'+c.whatsapp);assert(await phone.isVisible());assert(await wa.isVisible());
    const box=await phone.boundingBox();assert(box.x>=0&&box.x+box.width<=width+1,route+': teléfono fuera de pantalla');
   }
   const dimensions=await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));assert(dimensions.scroll<=dimensions.client+1,route+': desbordamiento');
   result.browser.push({route,width,javascript,phonesVisible:true,correctDestinations:true,noOverflow:true});
   if(route==='/'&&javascript&&[390,1440].includes(width))await panel.screenshot({path:out+`/antenas24-telefonos-pie-${width}.png`});
  }
  await context.close();
 }
 result.ok=true;console.log('PIE PUBLICADO VERIFICADO: '+result.samples.length+' URLs; '+result.browser.length+' comprobaciones visuales. No se han enviado mensajes ni realizado llamadas.');
}catch(e){result.error=e.message;process.exitCode=1;console.error(e);}
finally{if(browser)await browser.close();result.checkedAt=new Date().toISOString();result.samples.sort((a,b)=>a.url.localeCompare(b.url));fs.writeFileSync(out+'/footer-contacts-live.json',JSON.stringify(result,null,2));}
