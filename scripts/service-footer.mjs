import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

export const version='servicios-equilibrados-mapa-v1';
export const serviceCount=4;
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
// Representative provincial points, not addresses, offices or exact service radii.
export const areas=[
 ['alava','País Vasco',-2.67,42.85],['asturias','Principado de Asturias',-5.84,43.36],
 ['avila','Castilla y León',-4.70,40.66],['bizkaia','País Vasco',-2.90,43.26],
 ['burgos','Castilla y León',-3.70,42.34],['cantabria','Cantabria',-4.00,43.25],
 ['cuenca','Castilla-La Mancha',-2.10,40.07],['gipuzkoa','País Vasco',-2.20,43.15],
 ['guadalajara','Castilla-La Mancha',-2.85,40.85],['la-rioja','La Rioja',-2.50,42.27],
 ['leon','Castilla y León',-5.65,42.65],['madrid','Comunidad de Madrid',-3.70,40.42],
 ['navarra','Comunidad Foral de Navarra',-1.65,42.65],['palencia','Castilla y León',-4.54,42.20],
 ['salamanca','Castilla y León',-6.05,40.92],['segovia','Castilla y León',-4.00,41.10],
 ['soria','Castilla y León',-2.47,41.76],['toledo','Castilla-La Mancha',-4.20,39.90],
 ['valladolid','Castilla y León',-4.80,41.65],['zamora','Castilla y León',-5.80,41.60]
];
export function coverage(report){
 const provinces=report.counts.map(p=>{const id=slug(p.province),a=areas.find(x=>x[0]===id);assert(a,'Falta ubicación cartográfica: '+id);return {...p,id,region:a[1],lon:a[2],lat:a[3]};});
 assert.equal(new Set(provinces.map(p=>p.id)).size,provinces.length);
 assert.equal(provinces.length,report.provinceCount);
 assert.equal(provinces.reduce((n,p)=>n+p.towns,0),report.totalTowns);
 return {provinces,regions:[...new Set(provinces.map(p=>p.region))].sort((a,b)=>a.localeCompare(b,'es')),services:serviceCount,towns:report.totalTowns,districts:report.totalDistricts||0};
}
export function sectionById(html,id){
 const start=new RegExp('<section\\b[^>]*\\bid="'+id+'"[^>]*>').exec(html);assert(start,'Sección ausente: '+id);
 const tags=/<section\b[^>]*>|<\/section>/g;tags.lastIndex=start.index;let depth=0,m;
 while((m=tags.exec(html))){depth+=m[0].startsWith('</')?-1:1;if(!depth)return html.slice(start.index,tags.lastIndex);}
 throw Error('Sección sin cierre: '+id);
}
export function balanceHome(html){
 const large=sectionById(html,'amplificacion'),services=sectionById(html,'servicios');
 assert(large.includes('amplification-home'),'No se reconoce el bloque grande de amplificación');
 assert.equal((services.match(/class="service-card"/g)||[]).length,3,'Se esperaban los tres servicios originales');
 assert(services.endsWith('</div></section>'),'Cierre inesperado de tarjetas');
 const card='<section class="service-card service-card-amplification" id="amplificacion" aria-labelledby="amplification-home-title"><a class="image-box" href="/servicios/antenas/#amplificacion" aria-label="Sistemas de amplificación"><img src="/assets/amplificador-monocanal-televes.png" alt="Amplificador monocanal Televés T12 para cabeceras comunitarias" width="800" height="800" loading="lazy" decoding="async"></a><div class="card-body"><span class="card-number">04</span><h3 id="amplification-home-title">Amplificación</h3><p>Instalación y reparación de previos, fuentes de alimentación y amplificadores. Sistemas monocanal para viviendas y comunidades.</p><a class="text-link" href="/servicios/antenas/#amplificacion">Instalación y reparación ↗</a></div></section>';
 const correct=services.slice(0,-'</div></section>'.length)+card+'</div></section>';
 html=html.replace(large,'').replace(services,correct);
 html=html.replace('<span class="kicker">Tres especialidades</span>','<span class="kicker">Cuatro servicios para viviendas y comunidades</span>');
 html=html.replace('Antenas, porteros y videoporteros con el mismo protagonismo. Desde una avería hasta la renovación del equipo.','Antenas, porteros, videoporteros y amplificación. Instalación y reparación para tu vivienda o comunidad.');
 verifyBalancedHome(html);return html;
}
export function verifyBalancedHome(html){
 const block=sectionById(html,'servicios');
 assert.equal((block.match(/class="service-card(?: [^"]*)?"/g)||[]).length,4,'Deben existir cuatro tarjetas de servicio');
 assert.equal((html.match(/\bid="amplificacion"/g)||[]).length,1,'Amplificación duplicada');
 const order=[...block.matchAll(/class="card-number">(\d\d)<\/span>/g)].map(m=>m[1]);
 assert.deepEqual(order,['01','02','03','04'],'Orden de servicios incorrecto');
 assert(!html.includes('amplification-home"'),'El bloque grande no debe seguir en portada');
 assert(sectionById(block,'amplificacion').includes('<h3'),'Amplificación debe tener la misma jerarquía que los demás');
 assert(sectionById(block,'amplificacion').includes('href="/servicios/antenas/#amplificacion"'),'Falta el detalle técnico');
 assert(/<section\b[^>]*\bid="tipos-instalacion"/.test(html.slice(html.indexOf(block)+block.length)),'El contenido residencial debe conservarse');
}
export function mapSvg(geometry,info){
 const project=([lon,lat])=>[30+(lon+9.5)*40,24+(44-lat)*51.5];
 const inset=([lon,lat])=>[34+(lon+18.5)*32,479+(29.5-lat)*25];
 const outline=(coords,fn)=>coords.map((xy,i)=>{const [x,y]=fn(xy);return (i?'L':'M')+x.toFixed(1)+','+y.toFixed(1);}).join('')+'Z';
 const shapes=[`<path d="${outline(geometry.mainland,project)}"/>`,...geometry.islands.map(p=>`<path d="${outline(p,p[0][0]<-10?inset:project)}"/>`)].join('');
 const points=info.provinces.map(p=>{const [x,y]=project([p.lon,p.lat]);return `<g data-province="${p.id}"><title>${e(p.province)}</title><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="#7ebaff" opacity=".16"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.8" fill="#a7d1ff" stroke="#14243b" stroke-width="1.3"/></g>`;}).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 550" role="img" aria-labelledby="map-title map-desc"><title id="map-title">Zonas del directorio de Antenista Urgente 24 Horas</title><desc id="map-desc">Silueta de España con ${info.provinces.length} puntos provinciales: ${info.provinces.map(p=>e(p.province)).join(', ')}. Los puntos son orientativos, no oficinas. Canarias en recuadro. Sin cobertura marcada en las islas, Ceuta ni Melilla.</desc><g fill="#264264" stroke="#7494b7" stroke-width="1.4" stroke-linejoin="round">${shapes}</g><rect x="16" y="458" width="204" height="87" rx="10" fill="none" stroke="#516981" stroke-dasharray="4 5"/><g font-family="system-ui,sans-serif" font-size="12" fill="#adc2d9"><text x="29" y="475">Canarias</text><text x="484" y="291">Illes Balears</text><text x="151" y="463">Ceuta</text><text x="293" y="492">Melilla</text></g><circle cx="198" cy="442" r="2.4" fill="#7494b7"/><circle cx="292" cy="473" r="2.4" fill="#7494b7"/>${points}</svg>`;
}
export function footerCoverage(info){
 const stats=[[info.services,'servicios técnicos'],[info.regions.length,'comunidades autónomas'],[info.provinces.length,'provincias'],[info.towns,'municipios del directorio']];
 return `<section class="wrap footer-coverage" id="cobertura" aria-labelledby="coverage-heading"><div class="coverage-copy"><span class="kicker">Servicio por localidades</span><h2 id="coverage-heading">Tu vivienda.<br>Tu comunidad.<br>También en tu zona.</h2><p>Antenas, porteros, videoporteros y amplificación. Localiza tu provincia y consulta el servicio para tu dirección.</p><dl class="coverage-stats">${stats.map(([n,t])=>`<div><dt>${t}</dt><dd>${n.toLocaleString('es-ES')}</dd></div>`).join('')}</dl><p class="coverage-districts">Además, ${info.districts} distritos de Madrid capital.</p><a class="btn btn-primary" href="/#provincias">Encuentra tu localidad ↗</a></div><div class="coverage-map"><img src="/assets/cobertura-espana.svg?v=${version}" alt="Silueta de España con las ${info.provinces.length} provincias del directorio marcadas en el norte y centro" width="620" height="550" loading="lazy" decoding="async"><p class="coverage-legend"><span aria-hidden="true"></span>Provincias del directorio · Puntos orientativos, no sedes</p><details><summary>Ver las ${info.provinces.length} provincias</summary><ul>${info.provinces.map(p=>`<li><a href="/provincias/${p.id}/">${e(p.province)}</a></li>`).join('')}</ul></details></div><p class="coverage-note">${info.regions.map(e).join(' · ')}. Consulta disponibilidad y desplazamiento para tu localidad; el mapa no implica servicio en toda España.</p></section>`;
}
export function verifyFooter(html,info){
 assert.equal((html.match(/\bid="cobertura"/g)||[]).length,1,'Debe haber un mapa de cobertura en el pie');
 assert(html.indexOf('id="cobertura"')>html.indexOf('<footer class="footer">'),'La cobertura debe estar en el pie');
 const block=sectionById(html,'cobertura');
 for(const label of ['servicios técnicos','comunidades autónomas','provincias','municipios del directorio'])assert(block.includes('<dt>'+label+'</dt>'),'Falta el contador '+label);
 for(const n of [info.services,info.regions.length,info.provinces.length,info.towns])assert(block.includes('<dd>'+n.toLocaleString('es-ES')+'</dd>'),'Recuento incorrecto '+n);
 assert(block.includes('/assets/cobertura-espana.svg?v='+version),'Falta el mapa de esta revisión');
 for(const p of info.provinces)assert(block.includes('href="/provincias/'+p.id+'/"'),'Provincia ausente del mapa '+p.id);
 assert(!/clientes satisfechos|trabajos realizados|comunidades atendidas/i.test(block),'No inventar cifras de clientes');
}
export function transform(html,page,info){
 if(page.type==='home')html=balanceHome(html);
 assert.equal(html.split('<footer class="footer">').length,2,'Pie no reconocido');
 html=html.replace('<footer class="footer">','<footer class="footer">'+footerCoverage(info));
 html=html.replace('</head>',`<link rel="stylesheet" href="/assets/service-footer.css?v=${version}"><meta name="service-footer-version" content="${version}"></head>`);
 verifyFooter(html,info);return html;
}
export function apply(root='dist'){
 const reportPath=path.join(root,'build-report.json'),report=JSON.parse(fs.readFileSync(reportPath,'utf8')),info=coverage(report);
 const geometry=JSON.parse(fs.readFileSync('config/spain-outline.json','utf8'));
 fs.writeFileSync(path.join(root,'assets/cobertura-espana.svg'),mapSvg(geometry,info));
 fs.copyFileSync('src/service-footer.css',path.join(root,'assets/service-footer.css'));
 for(const p of report.pages){const file=path.join(root,p.url==='/404.html'?'404.html':p.url==='/'?'index.html':p.url.slice(1)+'index.html');fs.writeFileSync(file,transform(fs.readFileSync(file,'utf8'),p,info));}
 report.serviceFooter={version,services:info.services,regions:info.regions,provinces:info.provinces.length,municipalities:info.towns,serviceOrder:['antenas','porteros','videoporteros','amplificacion'],markers:info.provinces.map(p=>p.id)};
 report.focus.homeSectionOrder=['servicios (cuatro tarjetas)','tipos-instalacion'];
 fs.writeFileSync(reportPath,JSON.stringify(report,null,2));
 console.log(`SERVICIOS Y PIE OK: cuatro tarjetas equivalentes; mapa en ${report.totalPages} páginas; ${info.services} servicios, ${info.regions.length} comunidades autónomas, ${info.provinces.length} provincias y ${info.towns} municipios. Sin cifras de trabajos o clientes inventadas.`);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))apply();
