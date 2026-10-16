/** Representative production HTTP and browser verification. No calls or messages sent. */
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import site from '../config/site.json' with {type:'json'};
import {VERSION,repairs,guides} from '../scripts/town-seo.mjs';
import {fileFor} from '../scripts/starlink.mjs';
const root=path.resolve('dist'),built=JSON.parse(fs.readFileSync(root+'/build-report.json','utf8')),out='browser-artifacts/town-seo',base=site.domain;fs.mkdirSync(out,{recursive:true});
const results={commit:process.env.GITHUB_SHA||null,version:VERSION,mode:'production-http',base,http:[],browser:[],ok:false};
const pause=ms=>new Promise(r=>setTimeout(r,ms));let browser;
async function read(route){const r=await fetch(base+route,{redirect:'manual',signal:AbortSignal.timeout(20000),headers:{'Cache-Control':'no-cache'}});assert.equal(r.status,200,route+': HTTP '+r.status);return {r,text:await r.text()};}
try{
 let ready=false;for(let i=0;i<30;i++){try{const {text}=await read('/provincias/burgos/lerma/');assert(text.includes('data-town-seo="'+VERSION+'"'));assert(text.includes(built.closure.css));ready=true;break;}catch(e){results.lastObservation=e.message;if(i<29)await pause(6000);}}
 assert(ready,'La nueva publicación no se ha confirmado');
 const chosen=new Set(['/','/servicios/antenas/','/servicios/porteros/','/servicios/videoporteros/','/provincias/burgos/lerma/','/provincias/madrid/torrelaguna/']);
 for(const province of new Set(built.pages.filter(p=>p.type==='town').map(p=>p.province))){const rows=built.pages.filter(p=>p.type==='town'&&p.province===province);chosen.add(rows[0].url);chosen.add(rows.at(-1).url);chosen.add('/provincias/'+province+'/');}
 for(const p of built.pages.filter(p=>p.type==='district'))chosen.add(p.url);
 let index=0;const list=[...chosen];await Promise.all(Array.from({length:4},async()=>{while(index<list.length){const route=list[index++];let error;for(let retry=0;retry<3;retry++){try{const {r,text}=await read(route),expected=fs.readFileSync(fileFor(root,route),'utf8');for(const re of [/<title>[\s\S]*?<\/title>/,/<meta name="description"[^>]*>/,/<link rel="canonical"[^>]*>/,/<meta name="robots"[^>]*>/,/<main\b[^>]*>[\s\S]*?<\/main>/,/<footer\b[^>]*>[\s\S]*?<\/footer>/])assert.equal(text.match(re)?.[0],expected.match(re)?.[0],route+': contenido');assert(text.includes(built.closure.css));assert(!/noindex/i.test(r.headers.get('x-robots-tag')||''));results.http.push({url:base+route,status:200,contentMatchesBuild:true,ok:true});error=null;break;}catch(e){error=e;if(retry<2)await pause(1000);}}if(error)results.http.push({url:base+route,ok:false,error:error.message});}}));
 assert.equal(results.http.length,list.length);assert(results.http.every(r=>r.ok),'Muestra publicada incorrecta');
 for(const name of ['sitemap.xml','robots.txt',...fs.readdirSync(root+'/sitemaps').map(f=>'sitemaps/'+f),'assets/'+built.closure.css]){const {text}=await read('/'+name);assert.equal(text,fs.readFileSync(root+'/'+name,'utf8'),name+': archivo publicado distinto');}
 browser=await chromium.launch({headless:true});
 for(const [width,js] of [[320,true],[390,true],[768,true],[1440,true],[390,false]]){
  const ctx=await browser.newContext({viewport:{width,height:950},javaScriptEnabled:js}),page=await ctx.newPage();
  for(const route of ['/provincias/burgos/lerma/','/provincias/madrid/torrelaguna/','/provincias/madrid/madrid/chamberi/',...Object.keys(guides)]){
   await page.goto(base+route,{waitUntil:'load',timeout:45000});await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('h1').count(),1);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Desbordamiento '+route);
   if(route.startsWith('/provincias/')){
    const boxes=await page.locator('.town-seo-actions').evaluateAll(nodes=>nodes.map(n=>({box:n.getBoundingClientRect().toJSON(),links:[...n.children].map(a=>a.getBoundingClientRect().toJSON())})));
    assert.equal(boxes.length,4);for(const {box,links} of boxes){for(const a of links){assert(a.height>=43);assert(a.top>=box.top-1&&a.bottom<=box.bottom+1);assert(a.left>=box.left-1&&a.right<=box.right+1);}for(let i=0;i<links.length;i++)for(let j=i+1;j<links.length;j++){const a=links[i],b=links[j];assert(Math.min(a.right,b.right)-Math.max(a.left,b.left)<=1||Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)<=1,'Enlaces superpuestos');}}
    for(const s of repairs){const link=page.locator(`[data-request-service="${s.request}"]`);assert.equal(await link.getAttribute('href'),'#contacto');if(js){await link.click();assert.equal(await page.inputValue('[name="servicio"]'),s.request);}}
    if(js){const province=await page.locator('[name="provincia"] option:checked').getAttribute('data-whatsapp');assert.equal(province,route.includes('/madrid/')?'34614789945':'34641589394');}
    if(js&&route.includes('lerma')&&[390,1440].includes(width))await page.locator('#antenas').screenshot({path:out+`/lerma-reparacion-${width}.png`});
   }else{const panel=page.locator('.town-seo-guide');assert(await panel.isVisible());if(js&&route==='/servicios/antenas/'&&width===390)await panel.screenshot({path:out+'/guia-senal-390.png'});}
   results.browser.push({route,width,javascript:js,noOverflow:true,actionsChecked:true});
  }
  assert.equal((await ctx.cookies()).length,0);await ctx.close();
 }
 results.ok=true;console.log('SEO PUEBLOS VERIFICADO:',results.http.length,'URLs y',results.browser.length,'pruebas de navegador.');
}catch(error){results.error=error.message;process.exitCode=1;console.error(error);}
finally{if(browser)await browser.close();results.checkedAt=new Date().toISOString();fs.writeFileSync(out+'/published.json',JSON.stringify(results,null,2));}
