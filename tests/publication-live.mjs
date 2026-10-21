import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import site from '../config/site.json' with {type:'json'};
const origin=site.domain,output='browser-artifacts/publication-indexing.json';
const result={origin,checkedAt:new Date().toISOString(),verified:false,sitemaps:[],samples:[],redirects:[]};
const locs=xml=>[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1].replaceAll('&amp;','&'));
async function read(url){const r=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(15000),headers:{'Cache-Control':'no-cache'}});return {r,text:await r.text()};}
async function mapLimit(items,n,fn){let i=0;await Promise.all(Array.from({length:Math.min(n,items.length)},async()=>{while(i<items.length){const item=items[i++];await fn(item);}}));}
fs.mkdirSync('browser-artifacts',{recursive:true});
try{
 let report;
 // Wait for the requested PUBLIC build, not merely the previous code revision.
 for(let i=0;i<24;i++){
  try{
   const {r,text}=await read(origin+'/build-report.json?launch='+Date.now());assert.equal(r.status,200);
   report=JSON.parse(text);assert.equal(report.base,origin);assert.equal(report.publicBuild,true);assert.equal(report.localImprovements?.visibleServices,10,'La versión pública aún no muestra los diez servicios');assert(report.pages.filter(p=>!p.noindex).length===4081);break;
  }catch(error){result.lastObservation=error.message;if(i===23)throw error;await new Promise(r=>setTimeout(r,4000));}
 }
 const index=await read(origin+'/sitemap.xml');assert.equal(index.r.status,200);assert(index.text.includes('<sitemapindex'));assert(!index.text.includes('.netlify.app'));
 const maps=locs(index.text);assert.equal(maps.length,21);
 const all=[],samples=new Set(['/','/servicios/antenas/','/servicios/porteros/','/servicios/videoporteros/','/servicios/starlink/','/provincias/madrid/madrid/chamberi/','/provincias/bizkaia/zalla/','/provincias/burgos/lerma/']);
 await mapLimit(maps,4,async url=>{
  assert.equal(new URL(url).origin,origin);const {r,text}=await read(url);assert.equal(r.status,200,url);assert(text.includes('<urlset'));assert(!text.includes('.netlify.app'));
  const pages=locs(text);assert(pages.length>0);for(const p of pages)assert.equal(new URL(p).origin,origin);
  result.sitemaps.push({url,status:r.status,urls:pages.length});all.push(...pages);samples.add(new URL(pages[0]).pathname);samples.add(new URL(pages.at(-1)).pathname);
 });
 assert.equal(all.length,4081);assert.equal(new Set(all).size,4081);
 const expectedUrls=new Set(report.pages.filter(p=>!p.noindex).map(p=>origin+p.url));for(const u of all)assert(expectedUrls.has(u),'No indexable en sitemap: '+u);
 await mapLimit([...samples],4,async route=>{
  const {r,text}=await read(origin+route);assert.equal(r.status,200,route);
  const robots=r.headers.get('x-robots-tag')||'';assert(!/noindex|none/i.test(robots),'Bloqueo HTTP '+route);
  const tags=[...text.matchAll(/<meta name="(?:robots|googlebot)" content="([^"]*)"/g)].map(m=>m[1]);assert(tags.length>0);assert(tags.every(x=>!/(?:noindex|none)/i.test(x)),'Bloqueo HTML '+route);
  assert.equal(text.match(/rel="canonical" href="([^"]*)"/)?.[1],origin+route,'Canonical '+route);
  result.samples.push({path:route,status:r.status,robots:tags.join('; '),xRobotsTag:robots,canonical:origin+route});
 });
 const robots=await read(origin+'/robots.txt');assert.equal(robots.r.status,200);assert(robots.text.includes('Sitemap: '+origin+'/sitemap.xml'));assert(!/^Disallow:\s*\//m.test(robots.text));result.robotsTxt=robots.text;
 for(const [url,dest] of [[site.previewDomain+'/',origin+'/'],[site.previewDomain+'/sitemaps/madrid.xml',origin+'/sitemaps/madrid.xml'],[origin+'/index.html',origin+'/'],[origin+'/provincias/madrid/madrid/chamberi/index.html',origin+'/provincias/madrid/madrid/chamberi/']]){
  const {r}=await read(url);assert([301,308].includes(r.status),'No redirige: '+url+' '+r.status);assert.equal(new URL(r.headers.get('location'),url).href,dest);result.redirects.push({url,status:r.status,to:dest});
 }
 const missing=await read(origin+'/no-existe-verificacion-indexacion/');assert.equal(missing.r.status,404);result.missingPageStatus=404;
 const browser=await chromium.launch({headless:true,executablePath:process.env.TEST_CHROMIUM_EXECUTABLE_PATH||undefined});
 try{
  const ctx=await browser.newContext({viewport:{width:390,height:844}}),page=await ctx.newPage(),requests=[],errors=[];
  page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('#servicios .service-card').count(),10);assert((await page.locator('.contact-north').innerText()).includes('CASTILLA Y LEÓN'));
  assert.equal(await page.locator('[data-whatsapp-ready]').isDisabled(),false);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:'browser-artifacts/publicacion-com-390.png'});
  await page.locator('[data-privacy-open]').click();assert(await page.locator('#privacy-panel').isVisible());await page.keyboard.press('Escape');
  assert.equal((await ctx.cookies()).length,0);assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);assert(requests.every(u=>new URL(u).origin===origin));assert.equal(errors.length,0);
  await page.goto(origin+'/provincias/burgos/lerma/',{waitUntil:'networkidle'});assert((await page.locator('#direccion-local').innerText()).includes('Ruyales del Agua'));await page.locator('[data-request-service="Instalación de antenas Starlink"]').click();assert.equal(await page.inputValue('[name="servicio"]'),'Instalación de antenas Starlink');
  result.mobileVerified=true;result.cookies=0;result.externalRequests=0;
 }finally{await browser.close();}
 result.verified=true;result.sitemapFiles=maps.length;result.sitemapUrls=all.length;result.publicBuild=true;result.pages=report.totalPages;result.noindexRemovedFrom=report.pages.filter(p=>!p.noindex).length;delete result.lastObservation;
}catch(error){result.error=error.message;throw error;}
finally{fs.writeFileSync(output,JSON.stringify(result,null,2));console.log('PUBLICACIÓN .COM: '+JSON.stringify(result));}
