import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {localProfiles,localVersion,localTechnicalProfiles} from './local-content.mjs';import {fileFor} from './starlink.mjs';
const root='dist',report=JSON.parse(fs.readFileSync(root+'/build-report.json','utf8')),images=JSON.parse(fs.readFileSync(root+'/media-report.json','utf8'));
assert.equal(report.localImprovements.version,localVersion);assert.equal(report.localImprovements.researchedProfiles.length,10);
let localPages=0,photos=0,profiles=0;const technicalUsed=new Set(),origIds=new Set(report.pages.map(p=>p.url));
for(const [name,entry] of Object.entries(images)){
 assert(entry.variants.length>=2);for(const v of entry.variants){assert(fs.existsSync(path.join(root,'assets',v.file)));assert.equal(fs.statSync(path.join(root,'assets',v.file)).size,v.bytes);assert(v.bytes<entry.originalBytes,'Foto no optimizada: '+name);}
}
for(const p of report.pages){
 const html=fs.readFileSync(fileFor(root,p.url),'utf8');
 if(['town','district'].includes(p.type)){
  assert(html.includes('data-local-version="'+localVersion+'"'));assert(html.includes('name="nucleo"'));assert.equal((html.match(/data-request-service=/g)||[]).length,9);const technical=html.match(/data-local-technical="([^"]+)"/);assert(technical,p.url+': falta perfil técnico');technicalUsed.add(technical[1]);assert.equal((html.match(/data-local-case/g)||[]).length,3,p.url+': se esperaban 3 casos técnicos');localPages++;
  if(localProfiles[p.url]){assert(html.includes('id="direccion-local"'));for(const source of localProfiles[p.url].sources)assert(html.includes(source.url));profiles++;}
 }
 for(const image of html.matchAll(/<img\b[^>]*srcset="([^"]+)"[^>]*>/g)){
  for(const v of image[1].split(', ')){const [src,w]=v.split(' ');assert(fs.existsSync(path.join(root,src)));assert(/\d+w/.test(w));}photos++;
 }
}
for(const url of Object.keys(localProfiles))assert(origIds.has(url),'Perfil sin municipio '+url);
assert.equal(localPages,4056);assert.equal(profiles,10);assert.equal(technicalUsed.size,localTechnicalProfiles.length);assert.equal(Object.keys(images).length,6);
const totals=Object.values(images).reduce((a,x)=>({original:a.original+x.originalBytes,largest:a.largest+x.variants.at(-1).bytes}),{original:0,largest:0});
const result={version:localVersion,localPages,researchedMunicipalities:profiles,profileRoutes:Object.keys(localProfiles),technicalProfiles:localTechnicalProfiles.length,technicalProfilesUsed:[...technicalUsed].sort(),technicalCasesPerLocalPage:3,responsiveImages:photos,photoSources:6,originalPhotoBytes:totals.original,largestVariantsBytes:totals.largest,largestVariantSavingPercent:+(100*(1-totals.largest/totals.original)).toFixed(1),sourcePolicy:'Fuentes territoriales explícitas para hechos locales. Casos técnicos deterministas sin afirmar prevalencia, trabajos ni sedes locales.',indexingChanged:false};
fs.writeFileSync(root+'/local-improvements.json',JSON.stringify(result,null,2));console.log('AUDITORÍA CONTENIDO E IMÁGENES OK: '+JSON.stringify(result));
