import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const root=path.resolve('dist'),out='browser-artifacts';
fs.mkdirSync(out+'/static',{recursive:true});
fs.copyFileSync(root+'/index.html',out+'/static/index.html');
fs.cpSync(root+'/assets',out+'/static/assets',{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpeg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://localhost'),f=path.resolve(root,'.'+decodeURIComponent(u.pathname)+(u.pathname.endsWith('/')?'index.html':''));if(!f.startsWith(root+'/')||!fs.existsSync(f)){res.writeHead(404).end();return;}res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({headless:true}),results=[];
try{
 for(const width of [390,1440]){
  const page=await browser.newPage({viewport:{width,height:900}});await page.goto(origin+'/',{waitUntil:'networkidle'});
  const photos=await page.locator('#servicios .cards img').evaluateAll(async imgs=>{
   for(const i of imgs)i.loading='eager';await Promise.all(imgs.map(i=>i.decode()));
   await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
   return imgs.map(i=>({src:i.getAttribute('src'),naturalWidth:i.naturalWidth,w:i.getBoundingClientRect().width,h:i.getBoundingClientRect().height,opacity:getComputedStyle(i).opacity,visibility:getComputedStyle(i).visibility}));
  });
  for(const photo of photos){assert(photo.naturalWidth>0);assert(photo.w>40&&photo.h>40,'Foto sin tamaño visible '+JSON.stringify(photo));assert.equal(photo.opacity,'1');assert.equal(photo.visibility,'visible');}
  await page.locator('#servicios .cards').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/servicios-viewport-'+width+'.png'});
  await page.locator('#cobertura').scrollIntoViewIfNeeded();await page.locator('.coverage-map img').evaluate(async i=>{i.loading='eager';await i.decode();});
  await page.screenshot({path:out+'/pie-viewport-'+width+'.png'});results.push({width,photos});await page.close();
 }
 fs.writeFileSync(out+'/image-layout.json',JSON.stringify(results,null,2));console.log('FOTOS DECODIFICADAS OK: '+JSON.stringify(results));
}finally{await browser.close();server.close();}
