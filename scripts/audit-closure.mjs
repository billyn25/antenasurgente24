import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {version,redirectRules} from './closure.mjs';
import {fileFor,decode,section} from './starlink.mjs';
const root='dist',report=JSON.parse(fs.readFileSync(root+'/build-report.json','utf8'));
assert.equal(report.closure?.version,version);assert.equal(report.totalPages,4085);
const pages=new Map(report.pages.map(p=>[p.url,p])),ids=new Map(),incoming=new Map([...pages.keys()].map(x=>[x,0]));
const read=u=>fs.readFileSync(fileFor(root,u),'utf8');
for(const u of pages.keys())ids.set(u,[...read(u).matchAll(/\bid="([^\"]+)"/g)].map(x=>x[1]));
let links=0,forms=0,locals=0;const titles=new Set(),descriptions=new Set();
for(const [url,p] of pages){
 const html=read(url);
 assert.equal((html.match(/<h1\b/g)||[]).length,1,url+': H1');assert.equal(new Set(ids.get(url)).size,ids.get(url).length,url+': IDs');
 const title=decode(html.match(/<title>([\s\S]*?)<\/title>/)[1]),description=decode(html.match(/name="description" content="([^"]*)"/)[1]);
 assert.equal(title,p.title);assert(!titles.has(title));titles.add(title);assert(!descriptions.has(description));descriptions.add(description);
 assert.equal(html.match(/rel="canonical" href="([^"]+)"/)[1],report.base+url,url+': canonical');
 assert(html.includes('name="robots" content="'+(p.noindex?'noindex,follow':'index,follow,max-image-preview:large')+'"'),url+': robots');
 assert.equal((html.match(/<link rel="stylesheet"/g)||[]).length,1);assert(html.includes(report.closure.css));assert(html.includes(report.closure.js));
 assert.equal((html.match(/id="privacy-panel"/g)||[]).length,1);assert(html.includes('data-privacy-open'));
 assert(html.includes('Propiedad de R.F.G.'));assert(!/NIF.*pendientes?|pendientes? de confirmación|política definitiva como completada/.test(html));
 assert(!/aggregateRating|"@type":"Review"|<iframe\b/.test(html));
 assert(html.includes('<dt>servicios técnicos</dt><dd>5</dd>'));
 for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){
  const graph=JSON.parse(match[1])['@graph'];assert.equal(graph.find(n=>n['@type']==='WebPage').url,report.base+url);
  if(p.type==='service')assert.equal(graph.filter(n=>n['@type']==='Service').length,1,url+': Service');
 }
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const href=decode(match[1]);if(!href.startsWith('/')&&!href.startsWith('#'))continue;
  const target=new URL(href,report.base+url),name=decodeURIComponent(target.pathname);
  if(name.startsWith('/assets/')){assert(fs.existsSync(path.join(root,name)),url+': asset '+name);continue;}
  assert(pages.has(name),url+': enlace '+href);incoming.set(name,incoming.get(name)+1);links++;
  if(target.hash)assert(ids.get(name).includes(decodeURIComponent(target.hash.slice(1))),url+': ancla '+href);
 }
 if(['town','district'].includes(p.type)){
  for(const id of ['antenas','amplificacion','porteros','videoporteros','starlink'])assert(ids.get(url).includes(id));
  for(const term of ['Técnico en instalación de antenas en ','Técnico en instalación de porteros automáticos en ','Técnico en instalación de videoporteros en ','Instalación de antenas Starlink en '])assert(html.includes(term));
  for(const photo of ['antena-televes-dat.png','amplificador-monocanal-televes.png','antena-starlink-standard.png'])assert(html.includes(photo));
  const num=['madrid','guadalajara','toledo','cuenca'].includes(p.province)?'614 789 945':'641 589 394';assert.equal(p.phone,num);assert(html.includes('href="tel:+34'+num.replaceAll(' ','')+'"'));
  assert(html.includes('value="'+p.province+'" data-whatsapp="34'+num.replaceAll(' ','')+'" data-phone="'+num+'" selected'));
  assert(!html.includes('class="section wrap local-scope"'));locals++;
 }
 if(html.includes('id="whatsapp-aviso"')){assert(html.includes('disabled data-whatsapp-ready'));forms++;}
 if(['home','service','town','district'].includes(p.type))assert.equal((html.match(/class="commitment-star"/g)||[]).length,5);
}
for(const [u,n] of incoming)assert(n>0||pages.get(u).type==='404','Página huérfana '+u);
const h=read('/');assert(h.includes(section(h,'tipos-instalacion')+section(h,'confianza')));
assert.equal((section(h,'servicios').match(/class="service-card(?: [^"]*)?"/g)||[]).length,5);assert(h.includes('ZONA NORTE<span>CASTILLA Y LEÓN</span>'));
const locations=JSON.parse(fs.readFileSync(root+'/assets/location-index.json','utf8'));assert.equal(locations.length,4056);for(const loc of locations)assert(pages.has(loc.url));
const sitemap=[];for(const f of fs.readdirSync(root+'/sitemaps'))for(const m of fs.readFileSync(root+'/sitemaps/'+f,'utf8').matchAll(/<loc>(.*?)<\/loc>/g))sitemap.push(decode(m[1]));
const expected=report.pages.filter(p=>!['404','legal'].includes(p.type));assert.equal(sitemap.length,4081);assert.equal(new Set(sitemap).size,sitemap.length);for(const p of expected)assert(sitemap.includes(report.base+p.url));
const rules=fs.readFileSync(root+'/_redirects','utf8');assert(rules.includes(redirectRules()));assert(!rules.includes(' / 200'));
const headers=fs.readFileSync(root+'/_headers','utf8');assert(headers.includes("script-src 'self'"));assert(headers.includes("form-action 'none'"));
const script=fs.readFileSync(root+'/assets/'+report.closure.js,'utf8');assert(!/localStorage|sessionStorage|document\.cookie\s*=/.test(script.replace(/\/\/[^\n]*/g,'')));assert(script.includes("removeAttribute('disabled')"));
const result={version,pages:pages.size,localPages:locals,services:5,districts:21,sitemapUrls:sitemap.length,internalLinks:links,forms,duplicateTitles:0,brokenInternalLinks:0,orphanPages:0,stylesheetsPerPage:1,owner:'R.F.G.',optionalCookies:false,indexingChanged:false,technicalCheck:'passed',editorialReview:'Required for municipal differentiation; no guarantee of ranking or of absence of penalties',legalIdentification:'R.F.G. is the label supplied; full LSSI identification has not been certified'};
fs.writeFileSync(root+'/closure-audit.json',JSON.stringify(result,null,2));console.log('AUDITORÍA TÉCNICA DE CIERRE OK: '+JSON.stringify(result));
