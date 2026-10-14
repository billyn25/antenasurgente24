import fs from 'node:fs';
import path from 'node:path';
import site from '../config/site.json' with {type:'json'};
import {contactForProvince} from './contacts.mjs';
const out='dist',errors=[];
const assert=(ok,msg)=>{if(!ok)errors.push(msg)};
const pages=['/','/servicios/antenas/','/servicios/porteros/','/servicios/videoporteros/'];
for(const url of pages){
 const file=path.join(out,url==='/'?'index.html':url.slice(1)+'index.html');
 assert(fs.existsSync(file),'Página ausente: '+url);
 if(!fs.existsSync(file))continue;
 const html=fs.readFileSync(file,'utf8');
 assert((html.match(/<h1\b/g)||[]).length===1,url+': debe tener un H1');
 assert(html.includes('name="robots" content="noindex,nofollow"'),url+': noindex de prepublicación');
 assert(html.includes('href="/assets/styles.css"'),url+': CSS ausente');
 assert(html.includes('href="/#telefonos-zonas"'),url+': enlace a contactos por zona ausente');
 assert(html.includes('Urgencias 24'),url+': urgencias ausentes');
}
const home=fs.readFileSync(path.join(out,'index.html'),'utf8');
for(const s of site.services)assert(home.includes('href="/servicios/'+s.id+'/"'),'Servicio no enlazado: '+s.id);
for(const brand of [...site.antennaBrands,...site.doorphoneBrands])assert(home.includes(brand),'Marca ausente: '+brand);
for(const p of ['madrid','guadalajara','toledo','cuenca']){
 const x=contactForProvince(p);
 assert(x.phone==='614 789 945'&&x.whatsapp==='34614789945',p+': teléfono nuevo incorrecto');
}
for(const p of ['bizkaia','burgos','cantabria','navarra']){
 const x=contactForProvince(p);
 assert(x.phone==='641 589 394'&&x.whatsapp==='34641589394',p+': teléfono habitual incorrecto');
}
assert(home.includes('614 789 945')&&home.includes('641 589 394'),'Portada: contactos regionales no visibles');
assert(site.domain==='https://antenistaurgente24horas.com','Dominio definitivo incorrecto');
assert(!site.launchReady,'No activar indexación antes de completar datos de producción');
assert(fs.readFileSync(path.join(out,'robots.txt'),'utf8').includes('Disallow: /'),'Prepublicación sin bloqueo');
assert(fs.existsSync(path.join(out,'assets/styles.css')),'CSS no generado');
assert(fs.existsSync(path.join(out,'assets/logo.svg')),'Logo SVG no publicado');
assert(home.includes('614 789 945')&&home.includes('641 589 394'),'Teléfonos por zona ausentes');
assert(home.includes('class="hero-phones"'),'Hero sin llamadas diferenciadas');
assert(home.includes('/assets/logo.svg'),'Logo ausente de cabecera');
const media=['hero-obra.webp','antena-tdt.jpeg','portero-fermax.jpeg','portero-tegui.jpeg','parabolica.jpeg'];
for(const name of media){
 const file=path.join(out,'assets',name);
 assert(fs.existsSync(file),'Imagen no copiada: '+name);
 if(fs.existsSync(file))assert(fs.statSync(file).size>5000,'Imagen vacía o demasiado pequeña: '+name);
}
for(const url of pages){
 const file=path.join(out,url==='/'?'index.html':url.slice(1)+'index.html');
 const html=fs.readFileSync(file,'utf8');
 for(const match of html.matchAll(/<img[^>]+src=["'](\/assets\/[^"']+)["']/g)){
  assert(fs.existsSync(path.join(out,match[1].slice(1))),url+': imagen rota '+match[1]);
 }
}
assert(home.includes('class="hero-image"'),'Hero fotográfico de portada ausente');
assert(home.includes('class="service-photos"'),'Tres tarjetas de servicio ausentes');
assert((home.match(/class="photo-card"/g)||[]).length===3,'Deben mostrarse tres servicios con fotografía');
assert(home.includes('logo-antena.svg'),'Logotipo ausente');
assert(home.includes('class="brand-bar"'),'Marcas ausentes');
assert(home.includes('class="zones-bar"'),'Zonas destacadas ausentes');
assert(fs.existsSync(path.join(out,'assets','logo-antena.svg')),'Logo SVG no copiado');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('AUDITORÍA OK: 4 páginas, 3 servicios, marcas, enlaces, responsive CSS y protección noindex.');
