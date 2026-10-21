import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import site from '../config/site.json' with {type:'json'};
import {resolveDeployment} from './deployment.mjs';
import {legalContent} from './legal-content.mjs';
import {section,fileFor} from './starlink.mjs';
import {localVersion,localProfiles,improveLocalContent,addServiceResources} from './local-content.mjs';
import {prepareImages,responsiveHtml} from './responsive-images.mjs';
import {addFooterContacts,footerContactStyles} from './footer-contacts.mjs';
import {addLocalGeography} from './local-geography.mjs';
import {serviceCatalogue,showServiceCatalogue} from './service-catalogue.mjs';
export const version='local-util-imagenes-v2';
const e=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hash=s=>createHash('sha256').update(s).digest('hex').slice(0,12);
const catalogue=serviceCatalogue.map(s=>[s.label,s.url,s.image]);
export function conciseLocal(html){
 // Move repeated background explanation to the linked service guides, not to
 // synonym-generated "unique" copies. All five local services and photos stay.
 for(const id of ['antenas','porteros','videoporteros']){
  const block=section(html,id),paragraphs=[...block.matchAll(/<p\b[^>]*>[\s\S]*?<\/p>/g)];
  assert(paragraphs.length>=3,'Servicio local sin estructura esperada: '+id);
  html=html.replace(block,()=>block.replace(paragraphs[1][0],''));
 }
 html=html.replace(/<section class="section wrap local-scope">[\s\S]*?<\/section>/g,'');
 html=html.replace(/<section class="section wrap"><span class="kicker">Antes de llamar<\/span>[\s\S]*?<\/section>/g,'');
 html=html.replaceAll(' No corresponde a una intervención local.','');
 html=html.replace(/No se afirma disponer de una oficina en [^<]*?hasta atender la consulta\./g,'');
 html=html.replace('No se anuncian tarifas ficticias ni plazos garantizados.','').replace('no se anuncian tarifas ficticias ni plazos garantizados.','');
 return html;
}
export function redirectRules(){
 return '/index.html / 301!\n/provincias/:province/:town/:district/index.html /provincias/:province/:town/:district/ 301!\n/provincias/:province/:town/index.html /provincias/:province/:town/ 301!\n/provincias/:province/index.html /provincias/:province/ 301!\n/servicios/:service/index.html /servicios/:service/ 301!\n/aviso-legal/index.html /aviso-legal/ 301!\n/privacidad/index.html /privacidad/ 301!\n/cookies/index.html /cookies/ 301!\n';
}
function updateSchema(html,p,base){
 return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(_,payload)=>{
  const data=JSON.parse(payload),graph=data['@graph'];assert(Array.isArray(graph));
  const org=graph.find(n=>n['@type']==='Organization');
  if(p.type==='home'&&org)org.hasOfferCatalog={'@type':'OfferCatalog',name:'Instalación y reparación',itemListElement:catalogue.map(([name,url])=>({'@type':'Offer',itemOffered:{'@type':'Service',name,url:base+url,provider:{'@id':org['@id']}}}))};
  const item=catalogue.find(x=>x[1]===p.url);
  if(item&&p.type==='service'){
   for(let i=graph.length-1;i>=0;i--)if(graph[i]['@type']==='Service')graph.splice(i,1);
   graph.push({'@type':'Service',name:item[0],serviceType:item[0],url:base+p.url,provider:{'@id':org['@id']}});
  }
  return '<script type="application/ld+json">'+JSON.stringify(data).replace(/</g,'\\u003c')+'</script>';
 });
}
export async function applyClosure(root='dist',preparedImages=null){
 const reportPath=path.join(root,'build-report.json'),report=JSON.parse(fs.readFileSync(reportPath,'utf8'));
 const deployment=resolveDeployment(site),oldBase=report.base;
 assert.equal(report.publicBuild,deployment.publicBuild,'Desajuste de indexación: revisar el dominio antes de publicar');
 const base=deployment.base,legal=legalContent(site),images=preparedImages||await prepareImages(root);
 const styles=['styles.css','residential.css','navigation.css','service-footer.css','starlink-norte.css','closure.css'].map(f=>fs.readFileSync(path.join('src',f),'utf8')).join('\n')+'\n'+footerContactStyles;
 const css='site-'+hash(styles)+'.css';fs.writeFileSync(path.join(root,'assets',css),styles);
 let formJS=fs.readFileSync('src/whatsapp-form.js','utf8');
 // Only enable native submission after the handler that prevents it is attached.
 const marker="  status.replaceChildren(document.createTextNode('Mensaje preparado. '),link);window.open(url,'_blank','noopener,noreferrer');\n });\n}";
 assert(formJS.includes(marker),'Cambió el formulario: verificar su protección sin JavaScript');
 formJS=formJS.replace(marker,marker.slice(0,-1)+" form.querySelector('[data-whatsapp-ready]')?.removeAttribute('disabled');\n}");
 const scripts=[formJS,fs.readFileSync('src/location-finder.js','utf8'),fs.readFileSync('src/privacy-panel.js','utf8'),fs.readFileSync('src/local-assistance.js','utf8')].map(s=>'{\n'+s+'\n}').join('\n');
 const js='site-'+hash(scripts)+'.js';fs.writeFileSync(path.join(root,'assets',js),scripts);
 let compacted=0;
 const panel='<dialog class="privacy-panel" id="privacy-panel" aria-labelledby="privacy-title"><button type="button" class="privacy-close" data-privacy-close aria-label="Cerrar información de privacidad">×</button><h2 id="privacy-title">Cookies y privacidad</h2><p>No activamos cookies de analítica ni de publicidad. El buscador y el mapa funcionan sin seguimiento.</p><p>WhatsApp solo se abre cuando lo pulsas. Puedes revisar el mensaje antes de enviarlo.</p><div class="actions"><button class="btn btn-dark" type="button" data-privacy-close>Cerrar</button><a class="text-link" href="/cookies/">Ver política de cookies ↗</a></div></dialog>';
 for(const p of report.pages){
  const file=fileFor(root,p.url);let html=fs.readFileSync(file,'utf8').replaceAll(oldBase,base);
  if(['town','district'].includes(p.type)){html=addLocalGeography(improveLocalContent(conciseLocal(html),p),p);compacted++;}
  if(legal[p.url])html=html.replace(/<main id="contenido">[\s\S]*?<\/main>/,()=>'<main id="contenido"><nav class="wrap" aria-label="Ruta de navegación"><ol class="breadcrumbs"><li><a href="/">Inicio</a></li><li> / <span aria-current="page">'+e(p.url==='/aviso-legal/'?'Aviso legal':p.url==='/privacidad/'?'Privacidad':'Cookies')+'</span></li></ol></nav><section class="section wrap legal">'+legal[p.url]+'</section></main>');
  html=html.replace('<div class="footer-bottom">','<div class="footer-bottom"><span class="footer-owner">Propiedad de R.F.G.</span>');
  html=html.replace('<a href="/cookies/">Cookies</a>','<a href="/cookies/" data-privacy-open>Cookies y privacidad</a>');
  html=html.replace(/<link rel="stylesheet" href="\/assets\/[^\"]+">/g,'').replace(/<script src="\/assets\/[^\"]+" defer><\/script>/g,'');
  html=html.replace('</head>',`<link rel="stylesheet" href="/assets/${css}"><script src="/assets/${js}" defer></script><meta name="closure-version" content="${version}"></head>`);
  html=html.replace('</body>',panel+'</body>');
  html=html.replace('<button class="btn btn-green wide" type="submit">','<button class="btn btn-green wide" type="submit" disabled data-whatsapp-ready>');
  html=addServiceResources(html,p);
  html=showServiceCatalogue(html,p);
  html=updateSchema(html,p,base);
  html=addFooterContacts(html);
  html=responsiveHtml(html,p,images);
  const image=catalogue.find(x=>x[1]===p.url)?.[2]||'antena-televes-dat.png';
  html=html.replace(/<meta property="og:image" content="[^"]*">/,`<meta property="og:image" content="${base}/assets/${image}">`);
  const social=images[image]?.variants.at(-1);if(social)html=html.replace('property="og:image" content="'+base+'/assets/'+image+'"','property="og:image" content="'+base+'/assets/'+social.file+'"');
  assert(!/pendientes? de confirmación|NIF.*pendientes?|política definitiva como completada/.test(html),'Texto legal provisional no retirado: '+p.url);
  fs.writeFileSync(file,html);
 }
 for(const file of ['sitemap.xml',...fs.readdirSync(path.join(root,'sitemaps')).map(x=>'sitemaps/'+x)]){const loc=path.join(root,file);fs.writeFileSync(loc,fs.readFileSync(loc,'utf8').replaceAll(oldBase,base));}
 let redirects=redirectRules();if(deployment.publicBuild){redirects=site.previewDomain+'/* '+base+'/:splat 301!\n'+redirects;}
 fs.writeFileSync(path.join(root,'_redirects'),redirects);
 fs.writeFileSync(path.join(root,'robots.txt'),'User-agent: *\nAllow: /\n'+(deployment.publicBuild?'Sitemap: '+base+'/sitemap.xml\n':'# Prepublicación: noindex en las páginas y en las cabeceras HTTP.\n'));
 const csp="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests";
 fs.writeFileSync(path.join(root,'_headers'),'/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: '+csp+'\n'+(deployment.publicBuild?'':'  X-Robots-Tag: noindex, follow\n')+'/assets/*\n  Cache-Control: public, max-age=3600\n'+['build-report.json','navigation-audit.json','starlink-audit.json','closure-audit.json','seo-audit.json','media-report.json','local-improvements.json'].map(f=>'/'+f+'\n  X-Robots-Tag: noindex\n').join(''));
 fs.appendFileSync(path.join(root,'_headers'),Object.values(images).flatMap(entry=>entry.variants).map(v=>'/assets/'+v.file+'\n  Cache-Control: public, max-age=31536000, immutable\n').join(''));
 fs.writeFileSync(path.join(root,'media-report.json'),JSON.stringify(images,null,2));
 report.localImprovements={version:localVersion,localPages:compacted,researchedProfiles:Object.keys(localProfiles),districtNeighborhoodSelectors:21,responsivePhotos:Object.keys(images).length,visibleServices:serviceCatalogue.length};
 report.base=base;report.closure={version,ownerLabel:'R.F.G.',css,js,compactedPages:compacted,stylesheets:1,optionalCookies:false,indexingChanged:false,localContentReview:'Diez contextos municipales documentados, servicios abreviados y selección de barrio en las fichas. La información compartida no se considera contenido exclusivo.'};
 fs.writeFileSync(reportPath,JSON.stringify(report,null,2));console.log('CIERRE APLICADO: canonical estable, redirecciones forzadas, R.F.G., privacidad sin rastreo, una hoja CSS y un JS; '+compacted+' fichas sin bloques redundantes.');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await applyClosure();
