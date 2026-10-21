import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {localProfiles,localVersion,localTechnicalProfiles} from './local-content.mjs';import {fileFor,decode} from './starlink.mjs';
import {specialties} from './local-specialty-copy.mjs';
const root='dist',report=JSON.parse(fs.readFileSync(root+'/build-report.json','utf8')),images=JSON.parse(fs.readFileSync(root+'/media-report.json','utf8'));
assert.equal(report.localImprovements.version,localVersion);assert.equal(report.localImprovements.researchedProfiles.length,10);
let localPages=0,photos=0,profiles=0;const technicalUsed=new Set(),familySets=new Set(),origIds=new Set(report.pages.map(p=>p.url));
const specialtyUsage=Object.fromEntries(specialties.map(s=>[s.id,0])),specialtyVersions=new Set(),coreVersions=new Set(),faqVersions=new Set();
for(const [name,entry] of Object.entries(images)){
 assert(entry.variants.length>=2);for(const v of entry.variants){assert(fs.existsSync(path.join(root,'assets',v.file)));assert.equal(fs.statSync(path.join(root,'assets',v.file)).size,v.bytes);assert(v.bytes<entry.originalBytes,'Foto no optimizada: '+name);}
}
for(const p of report.pages){
 const html=fs.readFileSync(fileFor(root,p.url),'utf8');
 if(['town','district'].includes(p.type)){
  assert(html.includes('data-local-version="'+localVersion+'"'));assert(html.includes('name="nucleo"'));assert.equal((html.match(/data-request-service=/g)||[]).length,11);
  const technical=html.match(/data-local-technical="([^"]+)"/);assert(technical,p.url+': falta combinación de servicios y diagnóstico');technicalUsed.add(technical[1]);
  const families=html.match(/data-local-families="([^"]+)"/);assert(families,p.url+': faltan familias');const familyList=families[1].split(',');assert.equal(new Set(familyList).size,3,p.url+': las tres familias deben ser distintas');familySets.add([...familyList].sort().join('|'));assert.equal((html.match(/data-local-case/g)||[]).length,3,p.url+': se esperaban 3 tarjetas');
  const cards=[...html.matchAll(/data-specialty="([^"]+)" data-specialty-copy="([^"]+)"/g)];assert.equal(cards.length,2,p.url+': dos servicios complementarios');assert.equal(new Set(cards.map(m=>m[1])).size,2);
  for(const [,id,variant] of cards){assert(Object.hasOwn(specialtyUsage,id));specialtyUsage[id]++;specialtyVersions.add(variant);}
  const options=html.match(/<select name="servicio"[^>]*>[\s\S]*?<\/select>/)?.[0];assert(options,p.url+': falta selector de servicio');
  const optionValues=new Set([...options.matchAll(/<option\b([^>]*)>([^<]*)<\/option>/g)].map(([,attrs,label])=>decode(attrs.match(/\bvalue="([^"]*)"/)?.[1]??label)));
  for(const s of specialties)assert(optionValues.has(s.request),p.url+': falta opción '+s.id);
  for(const [,request] of html.matchAll(/data-request-service="([^"]+)"/g))assert(optionValues.has(decode(request)),p.url+': consulta sin opción '+request);
  assert(html.includes('<option>Bar o restaurante</option>'));assert(html.includes('<option>Hotel o alojamiento</option>'));assert(html.includes('<option>Local comercial</option>'));
  const core=[...html.matchAll(/data-service-copy="([^"]+)"/g)],faqs=[...html.matchAll(/data-faq-copy="([^"]+)"/g)];assert.equal(core.length,5);assert.equal(faqs.length,3);assert(html.includes('data-local-faq'));assert.equal(new Set(faqs.map(m=>m[1])).size,3);
  core.forEach(m=>coreVersions.add(m[1]));faqs.forEach(m=>faqVersions.add(m[1]));localPages++;
  if(localProfiles[p.url]){assert(html.includes('id="direccion-local"'));for(const source of localProfiles[p.url].sources)assert(html.includes(source.url));profiles++;}
 }
 for(const image of html.matchAll(/<img\b[^>]*srcset="([^"]+)"[^>]*>/g)){
  for(const v of image[1].split(', ')){const [src,w]=v.split(' ');assert(fs.existsSync(path.join(root,src)));assert(/\d+w/.test(w));}photos++;
 }
}
for(const url of Object.keys(localProfiles))assert(origIds.has(url),'Perfil sin municipio '+url);
assert.equal(localPages,4056);assert.equal(profiles,10);assert(localTechnicalProfiles.length>=15);assert(technicalUsed.size>=1800,'Pocas combinaciones técnicas distintas: '+technicalUsed.size);assert(familySets.size>=150,'Poca variedad de familias técnicas: '+familySets.size);assert.equal(Object.keys(images).length,9);
assert.equal(coreVersions.size,40);assert.equal(specialtyVersions.size,30);assert.equal(faqVersions.size,70);for(const count of Object.values(specialtyUsage))assert(count>0);
const totals=Object.values(images).reduce((a,x)=>({original:a.original+x.originalBytes,largest:a.largest+x.variants.at(-1).bytes}),{original:0,largest:0});
const result={version:localVersion,localPages,researchedMunicipalities:profiles,profileRoutes:Object.keys(localProfiles),technicalFamilies:localTechnicalProfiles.length,technicalCombinations:technicalUsed.size,technicalFamilySets:familySets.size,technicalCasesPerLocalPage:1,specialtiesPerLocalPage:2,specialtyUsage,coreCopyVariants:coreVersions.size,specialtyCopyVariants:specialtyVersions.size,faqVariants:faqVersions.size,responsiveImages:photos,photoSources:9,originalPhotoBytes:totals.original,largestVariantsBytes:totals.largest,largestVariantSavingPercent:+(100*(1-totals.largest/totals.original)).toFixed(1),sourcePolicy:'Fuentes territoriales explícitas para hechos locales. Servicios y casos técnicos sin afirmar prevalencia, trabajos ni sedes locales.',indexingChanged:false};
fs.writeFileSync(root+'/local-improvements.json',JSON.stringify(result,null,2));console.log('AUDITORÍA CONTENIDO E IMÁGENES OK: '+JSON.stringify(result));
