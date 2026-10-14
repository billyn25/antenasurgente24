import fs from 'node:fs';
import path from 'node:path';
import site from '../config/site.json' with {type:'json'};
import {contactForProvince} from './contacts.mjs';

const root='dist';
const domain=site.domain;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const provinces=[
 ['alava','Álava'],['asturias','Asturias'],['avila','Ávila'],['bizkaia','Bizkaia'],['burgos','Burgos'],['cantabria','Cantabria'],['cuenca','Cuenca'],['gipuzkoa','Gipuzkoa'],['guadalajara','Guadalajara'],['la-rioja','La Rioja'],['leon','León'],['madrid','Madrid'],['navarra','Navarra'],['palencia','Palencia'],['salamanca','Salamanca'],['segovia','Segovia'],['soria','Soria'],['toledo','Toledo'],['valladolid','Valladolid'],['zamora','Zamora']
];
const provinceLinks=provinces.map(([slug,name])=>'<a href="/'+slug+'/">'+esc(name)+'</a>').join('');
const serviceWords=[
 ['antenas','Antenista','reparación e instalación de antenas TDT, parabólicas y amplificación'],
 ['porteros','Reparación de porteros automáticos','averías de llamada, audio, apertura, placa y telefonillos'],
 ['videoporteros','Instalación de videoporteros','montaje, renovación y reparación de monitores y placas de calle']
];
const wrap=(title,description,canonical,body,phone)=>'<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>'+esc(title)+'</title><meta name="description" content="'+esc(description)+'"><link rel="canonical" href="'+canonical+'"><link rel="stylesheet" href="/assets/styles.css"></head><body><header class="simple-header"><div class="wrap"><a href="/">ANTENISTA URGENTE 24 HORAS</a><a href="tel:'+phone.tel+'">☎ '+phone.phone+'</a></div></header><main>'+body+'</main><footer class="simple-footer"><div class="wrap"><a href="/">Inicio</a> · <a href="/#telefonos-zonas">Contacto</a> · Atención sujeta a disponibilidad</div></footer></body></html>';
const save=(url,html)=>{const f=path.join(root,url.slice(1),'index.html');fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,html)};
const data=JSON.parse(fs.readFileSync('content/municipios.json','utf8'));
const byProvince=new Map(provinces.map(p=>[p[0],[]]));
for(const t of data){if(!byProvince.has(t.province))throw Error('Provincia no prevista '+t.province);byProvince.get(t.province).push(t)}
const sitemap=[];
for(const [slug,name] of provinces){
 const phone=contactForProvince(slug),towns=byProvince.get(slug);
 const list=towns.map(t=>'<a href="/'+slug+'/'+t.slug+'/">Antenista en '+esc(t.name)+'</a>').join('');
 const url='/'+slug+'/';
 const body='<section class="local-hero"><div class="wrap"><span>Provincia de '+esc(name)+'</span><h1>Antenistas, porteros y videoporteros en '+esc(name)+'</h1><p>Selecciona tu municipio para consultar instalación y reparación de antenas, reparación de porteros automáticos e instalación de videoporteros.</p><a href="tel:'+phone.tel+'">☎ '+phone.phone+'</a></div></section><section class="wrap local-list"><h2>Municipios de '+esc(name)+'</h2><div>'+list+'</div></section>';
 save(url,wrap('Antenistas en '+name+' | Antenas, porteros y videoporteros', 'Servicio técnico de antenas, porteros y videoporteros en municipios de '+name+'. Teléfono '+phone.phone,domain+url,body,phone));sitemap.push(domain+url);
 for(const t of towns){
  const localUrl='/'+slug+'/'+t.slug+'/';
  const sections=serviceWords.map(([id,label,details])=>'<section id="'+id+'"><h2>'+label+' en '+esc(t.name)+'</h2><p>Servicio técnico para '+esc(details)+' en '+esc(t.name)+', '+esc(name)+'. Antes de organizar la visita, indica qué ocurre, desde cuándo y si afecta a una vivienda o a varios vecinos.</p><a href="tel:'+phone.tel+'">Consultar disponibilidad: '+phone.phone+'</a></section>').join('');
  const near=towns.filter(x=>x.slug!==t.slug).slice(0,8).map(x=>'<a href="/'+slug+'/'+x.slug+'/">'+esc(x.name)+'</a>').join('');
  const body='<section class="local-hero"><div class="wrap"><span>Servicio técnico en '+esc(name)+'</span><h1>Antenista en '+esc(t.name)+'</h1><p>Instalación y reparación de antenas, porteros automáticos y videoporteros en '+esc(t.name)+'. Urgencias 24 horas sujetas a disponibilidad.</p><a href="tel:'+phone.tel+'">☎ '+phone.phone+'</a> <a href="https://wa.me/'+phone.whatsapp+'">WhatsApp</a></div></section><div class="wrap local-content">'+sections+'<section><h2>Otras localidades de '+esc(name)+'</h2><nav>'+near+'</nav></section><a href="/'+slug+'/">Ver todos los municipios de '+esc(name)+'</a></div>';
  save(localUrl,wrap('Antenista en '+t.name+', '+name+' | Porteros y videoporteros', 'Antenista en '+t.name+'. Reparación de porteros automáticos e instalación de videoporteros. '+phone.phone,domain+localUrl,body,phone));sitemap.push(domain+localUrl);
 }
}
const homeFile=path.join(root,'index.html');
let home=fs.readFileSync(homeFile,'utf8');
const section='<section class="section" id="provincias"><div class="wrap"><span class="eyebrow">Cobertura municipal</span><h2>Encuentra tu pueblo</h2><p>Las provincias tienen la misma importancia. Elige la tuya para encontrar el teléfono y los servicios de tu municipio.</p><nav class="province-grid">'+provinceLinks+'</nav></div></section>';
home=home.replace('<section class="brand-bar"',section+'<section class="brand-bar"');
fs.writeFileSync(homeFile,home);
fs.appendFileSync(path.join(root,'assets','styles.css'),'\n.simple-header,.simple-footer{background:#0b2b48;color:#fff;padding:16px 0}.simple-header .wrap{display:flex;justify-content:space-between;gap:16px}.local-hero{background:#eaf4fc;padding:44px 0}.local-hero h1{font-size:clamp(28px,4vw,48px)}.local-content{padding:35px 0}.local-content section{margin-bottom:30px}.local-list{padding:30px 0}.local-list>div,.province-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.local-list a,.province-grid a{display:block;border:1px solid #d9e6f0;border-radius:7px;padding:10px 12px}.local-content nav{display:flex;gap:12px;flex-wrap:wrap}@media(max-width:750px){.local-list>div,.province-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:480px){.local-list>div,.province-grid{grid-template-columns:1fr}}\n');
fs.writeFileSync(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+[domain+'/',...sitemap].map(x=>'<url><loc>'+x+'</loc></url>').join('')+'</urlset>');
console.log('SEO MUNICIPAL:',data.length,'pueblos',provinces.length,'provincias; prepublicación noindex.');
