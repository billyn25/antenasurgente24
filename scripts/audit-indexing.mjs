import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import site from '../config/site.json' with {type:'json'};
import {resolveDeployment} from './deployment.mjs';
import {fileFor} from './starlink.mjs';
const root='dist',report=JSON.parse(fs.readFileSync(root+'/build-report.json','utf8')),expected=resolveDeployment(site);
assert.equal(report.publicBuild,expected.publicBuild,'El informe no coincide con el contexto de despliegue');
assert.equal(report.base,expected.base,'Dominio incorrecto');
if(process.argv.includes('--production'))assert.equal(report.publicBuild,true,'No se generó la versión indexable');
const locs=xml=>[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1].replaceAll('&amp;','&'));
const maps=locs(fs.readFileSync(root+'/sitemap.xml','utf8'));
assert.equal(maps.length,21,'Falta el sitemap principal o alguna provincia');
const urls=[];
for(const url of maps){
 const u=new URL(url);assert.equal(u.origin,report.base,'Sitemap de otro dominio: '+url);
 const xml=fs.readFileSync(path.join(root,u.pathname),'utf8');assert(xml.includes('<urlset'),'No anidar índices');
 const pages=locs(xml);assert(pages.length>0,'Sitemap vacío: '+url);
 for(const p of pages)assert.equal(new URL(p).origin,report.base,'Página de otro dominio: '+p);
 urls.push(...pages);
}
assert.equal(urls.length,4081);assert.equal(new Set(urls).size,urls.length);
const pageMap=new Map(report.pages.map(p=>[report.base+p.url,p]));let indexed=0,excluded=0;
for(const [url,p] of pageMap){
 const html=fs.readFileSync(fileFor(root,p.url),'utf8');
 assert.equal(html.match(/rel="canonical" href="([^"]+)"/)?.[1],url,'Canonical incorrecto');
 const shouldIndex=report.publicBuild&&!['legal','404'].includes(p.type);
 assert.equal(p.noindex,!shouldIndex,'Flag de indexación incorrecto: '+url);
 assert.equal(html.match(/name="robots" content="([^"]+)"/)?.[1],shouldIndex?'index,follow,max-image-preview:large':'noindex,follow',url);
 if(shouldIndex){indexed++;assert(urls.includes(url),'Página indexable fuera de sitemap');assert(!html.includes(site.previewDomain),'Referencia a prepublicación en HTML público');}else excluded++;
}
const headers=fs.readFileSync(root+'/_headers','utf8'),global=headers.split('\n').slice(1).join('\n').split(/\n(?=\/)/)[0];
assert.equal(/X-Robots-Tag:.*noindex/i.test(global),!report.publicBuild,'Bloqueo HTTP global incorrecto');
const robots=fs.readFileSync(root+'/robots.txt','utf8');assert(!/^Disallow:\s*\//m.test(robots));
if(report.publicBuild){
 assert(robots.includes('Sitemap: '+site.domain+'/sitemap.xml'));
 assert(fs.readFileSync(root+'/_redirects','utf8').includes(site.previewDomain+'/* '+site.domain+'/:splat 301!'));
}
const result={checkedAt:new Date().toISOString(),publicBuild:report.publicBuild,domain:report.base,sitemapFiles:maps.length,sitemapUrls:urls.length,indexablePages:indexed,noindexPages:excluded,wrongSitemapDomains:0,globalNoindex:!report.publicBuild};
fs.mkdirSync('browser-artifacts',{recursive:true});fs.writeFileSync('browser-artifacts/indexing-build-'+(report.publicBuild?'production':'preview')+'.json',JSON.stringify(result,null,2));
console.log('AUDITORÍA DE INDEXACIÓN OK: '+JSON.stringify(result));
