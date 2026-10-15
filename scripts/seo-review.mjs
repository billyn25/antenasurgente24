import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root='dist',out='seo-review';fs.mkdirSync(out,{recursive:true});
const report=JSON.parse(fs.readFileSync(path.join(root,'build-report.json'),'utf8'));
const read=u=>fs.readFileSync(path.join(root,u==='/404.html'?'404.html':u==='/'?'index.html':u.slice(1)+'index.html'),'utf8');
const decode=s=>s.replace(/&(?:amp|quot|apos|lt|gt|#39|nbsp);/g,m=>({'&amp;':'&','&quot;':'"','&apos;':"'",'&lt;':'<','&gt;':'>','&#39;':"'",'&nbsp;':' '})[m]);
const text=s=>decode(s.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/g,' ').replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim();
const main=h=>(h.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)||[])[1]||h;
const editorial=h=>text(main(h).replace(/<nav\b[\s\S]*?<\/nav>|<form\b[\s\S]*?<\/form>/g,' '));
const grams=s=>{const w=s.toLowerCase().split(/\s+/);return new Set(w.slice(4).map((_,i)=>w.slice(i,i+5).join(' ')));};
const jaccard=(a,b)=>{let n=0;for(const x of a)if(b.has(x))n++;return +(100*n/(a.size+b.size-n||1)).toFixed(2);};
const stats={pages:report.pages.length,municipalities:report.totalTowns,districts:report.totalDistricts,services:report.starlink?.services,publicBuild:report.publicBuild,base:report.base,duplicateTitles:[],duplicateDescriptions:[],emptyMain:[],titleOver65:[],descriptionOver180:[],blankImageAlt:[],missingServiceSchema:[],bodyWordRange:[],repeatedTechnicalBlocks:{},sampleSimilarity:[],imageBytes:[],externalAssets:[],legalPlaceholders:[],network:[],comparison:[]};
const titles=new Map(),desc=new Map(),technical=new Map(),towns=report.pages.filter(p=>p.type==='town'),htmls=new Map();
for(const p of report.pages){
 const h=read(p.url),t=decode(h.match(/<title>(.*?)<\/title>/)?.[1]||''),d=decode(h.match(/<meta name="description" content="([^"]*)"/)?.[1]||'');
 if(titles.has(t))stats.duplicateTitles.push([titles.get(t),p.url]);titles.set(t,p.url);
 if(desc.has(d))stats.duplicateDescriptions.push([desc.get(d),p.url]);desc.set(d,p.url);
 if(t.length>65)stats.titleOver65.push({url:p.url,length:t.length});if(d.length>180)stats.descriptionOver180.push({url:p.url,length:d.length});
 if(editorial(h).length<100)stats.emptyMain.push(p.url);
 if(['home','service'].includes(p.type)&&!h.includes('"@type":"Service"'))stats.missingServiceSchema.push(p.url);
 if(/pendientes? de confirmación|no presenta una política definitiva|NIF.*pendientes?|prepublicación.*texto/i.test(main(h)))stats.legalPlaceholders.push(p.url);
 for(const m of h.matchAll(/<img\b[^>]*>/g))if(!/alt="[^"]+"/.test(m[0]))stats.blankImageAlt.push(p.url);
 for(const m of h.matchAll(/<(?:script|img|iframe)\b[^>]*src="(https?:[^\"]+)"/g))stats.externalAssets.push({url:p.url,asset:m[1]});
 if(p.type==='town'){
  const b=(h.match(/<section class="service-detail[^"]*" id="antenas">[\s\S]*?<\/section>/)||[])[0]||'';
  const prose=[...b.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(m=>text(m[1])).join(' ');
  const hash=createHash('sha256').update(prose).digest('hex');const v=technical.get(hash)||{count:0,example:p.url,words:prose.split(' ').length};v.count++;technical.set(hash,v);
 }
}
stats.repeatedTechnicalBlocks={method:'Texto de párrafos del bloque antenas: excluye H2, navegación, pie y formulario',groups:[...technical.values()].sort((a,b)=>b.count-a.count)};
const samples=[];for(const province of new Set(towns.map(p=>p.province))){const a=towns.filter(p=>p.province===province);const i=Math.floor(a.length/2);samples.push([a[i],a[(i+1)%a.length]]);}
for(let i=0;i<20;i++)samples.push([towns[Math.floor(i*towns.length/20)],towns[Math.floor(((i+7)%20)*towns.length/20)]]);
const get=p=>{if(!htmls.has(p.url))htmls.set(p.url,editorial(read(p.url)));return htmls.get(p.url);};
for(const [a,b] of samples)stats.sampleSimilarity.push({a:a.url,b:b.url,jaccard5grams:jaccard(grams(get(a)),grams(get(b))),wordsA:get(a).split(' ').length,wordsB:get(b).split(' ').length});
for(const f of fs.readdirSync(root+'/assets'))if(/\.(jpeg|jpg|png|webp|svg)$/.test(f))stats.imageBytes.push({file:f,bytes:fs.statSync(root+'/assets/'+f).size});
if(process.argv.includes('--network')){
 const urls=[report.base+'/',report.base+'/index.html',report.base+'/robots.txt',report.base+'/sitemap.xml',report.base+'/sitemaps/madrid.xml',report.base+'/provincias/madrid/madrid',report.base+'/provincias/madrid/madrid/index.html',report.base+'/provincias/madrid/madrid/chamberi/',report.base+'/provincias/madrid/madrid/chamberi/index.html',report.base+'/no-existe-auditoria-cierre/',report.base+'/aviso-legal/',report.base+'/cookies/','https://antenistaurgente24horas.com/'];
 await Promise.all(urls.map(async url=>{try{const r=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(12000)});const h=await r.text();stats.network.push({url,status:r.status,redirect:r.headers.get('location'),robots:r.headers.get('x-robots-tag'),metaRobots:h.match(/name="robots" content="([^"]*)"/)?.[1],canonical:h.match(/rel="canonical" href="([^"]*)"/)?.[1],setCookie:r.headers.getSetCookie(),cache:r.headers.get('cache-control')});}catch(e){stats.network.push({url,error:String(e.message)});}}));
 for(const origin of ['https://antenasrapid.es','https://antenasrapid.com','https://antenistacerca.es']){
  try{const r=await fetch(origin+'/',{signal:AbortSignal.timeout(12000)}),h=await r.text();if(!r.ok)throw Error('HTTP '+r.status);const candidates=[...h.matchAll(/href="([^\"]+)"/g)].map(x=>{try{return new URL(decode(x[1]),origin);}catch{return null;}}).filter(x=>x?.origin===origin&&/zalla|torrelaguna|chamber|lerma/i.test(x.pathname));const pages=[{url:origin+'/',html:h}];if(candidates[0]){const q=await fetch(candidates[0],{signal:AbortSignal.timeout(10000)});if(q.ok)pages.push({url:candidates[0].href,html:await q.text()});}for(const p of pages){fs.writeFileSync(out+'/'+new URL(p.url).hostname+'-'+(pages.indexOf(p)?'local':'home')+'.html',p.html);stats.comparison.push({url:p.url,newUrl:pages.indexOf(p)?samples[0][0].url:'/',jaccard5grams:jaccard(grams(editorial(p.html)),grams(editorial(read(pages.indexOf(p)?samples[0][0].url:'/')))),words:editorial(p.html).split(' ').length});}}catch(e){stats.comparison.push({url:origin,error:String(e.message)});}
 }
}
fs.writeFileSync(out+'/seo-review.json',JSON.stringify(stats,null,2));
console.log(JSON.stringify({...stats,titleOver65:stats.titleOver65.length,descriptionOver180:stats.descriptionOver180.length,sampleSimilarity:stats.sampleSimilarity.slice(0,3)},null,2));
