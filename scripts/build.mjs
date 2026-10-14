import fs from 'node:fs';
import path from 'node:path';
import site from '../config/site.json' with {type:'json'};
import {contactsForHome} from './contacts.mjs';

const OUT='dist';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const contacts=contactsForHome();
const assets={
  logo:'/assets/logo-antena.svg',
  hero:'/assets/hero-obra.webp',
  antennas:'/assets/antena-tdt.jpeg',
  porteros:'/assets/portero-fermax.jpeg',
  videoporteros:'/assets/portero-tegui.jpeg',
  parabola:'/assets/parabolica.jpeg'
};
const phoneLink=(x,cls='')=>'<a class="phone-card '+cls+'" href="tel:'+x.tel+'"><span class="phone-icon" aria-hidden="true">☎</span><span><strong>'+esc(x.phone)+'</strong><small>'+esc(x.label)+'</small></span></a>';
const brand='<a href="/" class="brand" aria-label="Antenista Urgente 24 Horas"><img src="'+assets.logo+'" width="67" height="67" alt=""><span><strong>ANTENISTA</strong><b>URGENTE <em>24 HORAS</em></b></span></a>';
const header='<header class="site-header"><div class="wrap masthead">'+brand+'<div class="header-claim"><strong>Instalación · Reparación · Mantenimiento</strong><span>En tu hogar, siempre cerca</span></div><div class="header-phones">'+phoneLink(contacts[0],'phone-light')+phoneLink(contacts[1],'phone-yellow')+'</div></div><div class="nav-shell"><div class="wrap nav-row"><nav aria-label="Navegación principal"><a href="/">Inicio</a><a href="/servicios/antenas/">Antenas</a><a href="/servicios/porteros/">Porteros</a><a href="/servicios/videoporteros/">Videoporteros</a><a href="/#telefonos-zonas">Zonas de servicio</a><a href="/#galeria">Galería</a><a href="/#contacto">Contacto</a></nav><a class="emergency-link" href="/#telefonos-zonas">◷ Urgencias 24 horas</a></div></div></header>';
const footer='<footer class="footer"><div class="wrap"><span>© '+new Date().getFullYear()+' '+esc(site.brand)+'</span><span>Atención 24 horas sujeta a disponibilidad. Datos legales y cobertura por municipio pendientes de completar.</span></div></footer><div class="mobile-actions"><a class="btn btn-yellow" href="/#telefonos-zonas">☎ Teléfonos</a><a class="btn btn-green" href="https://wa.me/'+contacts[0].whatsapp+'">WhatsApp Madrid</a></div>';
const document=(title,description,body)=>'<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="'+esc(description)+'"><title>'+esc(title)+'</title><link rel="icon" type="image/svg+xml" href="'+assets.logo+'"><link rel="preload" as="image" href="'+assets.hero+'"><link rel="stylesheet" href="/assets/styles.css"></head><body>'+header+'<main>'+body+'</main>'+footer+'</body></html>';
const photoCard=(url,title,description,img,alt)=>'<a class="photo-card" href="'+url+'"><img src="'+img+'" loading="lazy" decoding="async" alt="'+esc(alt)+'"><span class="photo-card-copy"><span><strong>'+esc(title)+'</strong><small>'+esc(description)+'</small></span><span class="photo-arrow" aria-hidden="true">→</span></span></a>';
const cards='<div class="service-photos">'+photoCard('/servicios/antenas/','Antenas de TV','Instalación, reparación y orientación de TDT y satélite.',assets.antennas,'Antena de televisión TDT')+photoCard('/servicios/porteros/','Porteros automáticos','Reparación e instalación de placas y telefonillos.',assets.porteros,'Placa de portero automático')+photoCard('/servicios/videoporteros/','Videoporteros','Instalación, reparación y renovación de videoporteros.',assets.videoporteros,'Equipo de portero y control de acceso')+'</div>';
const brands=[...site.antennaBrands,...site.doorphoneBrands].map(x=>'<span>'+esc(x)+'</span>').join('');
const brandBar='<section class="brand-bar" id="marcas" aria-label="Marcas de equipos"><div class="wrap"><strong class="brand-bar-title">Marcas y equipos</strong><div class="brand-names">'+brands+'</div></div></section>';
const zonesBar='<section class="zones-bar"><div class="wrap"><div><span class="zone-symbol">★</span><p>Servicio prioritario en:<strong>Madrid · Toledo · Guadalajara · Cuenca</strong></p></div><div><span class="zone-symbol">⌖</span><p>También en otras provincias:<strong>Consulta la cobertura por localidad</strong></p></div><a class="btn btn-yellow" href="/#telefonos-zonas">Ver teléfonos por zona →</a></div></section>';
const regional='<section class="section regional" id="telefonos-zonas"><div class="wrap"><span class="eyebrow">Contacto por zona</span><h2>El teléfono correcto para tu localidad.</h2><p>Selecciona tu zona para llamar o escribir por WhatsApp. La disponibilidad y el desplazamiento se confirman antes de la visita.</p><div class="regional-grid">'+contacts.map(x=>'<article class="regional-card"><h3>'+esc(x.label)+'</h3><strong>'+esc(x.phone)+'</strong><div class="actions"><a class="btn btn-yellow" href="tel:'+x.tel+'">☎ Llamar</a><a class="btn btn-green" href="https://wa.me/'+x.whatsapp+'">WhatsApp</a></div></article>').join('')+'</div></div></section>';
const hero='<section class="hero"><div class="hero-image" role="img" aria-label="Antenas de televisión en una instalación técnica"></div><div class="wrap hero-inner"><div class="hero-copy"><span class="hero-kicker">ANTENAS · PORTEROS · VIDEOPORTEROS</span><h1>Tu antenista de confianza <em>en tu pueblo</em></h1><p>Antenas TDT y satélite · Porteros automáticos · Videoporteros. Instalación, reparación y mantenimiento con atención urgente 24 horas.</p><div class="hero-benefits"><span>◷ Atención urgente</span><span>⚙ Diagnóstico técnico</span><span>⌖ Servicio por pueblos</span></div><div class="hero-buttons"><a class="btn btn-yellow" href="/#telefonos-zonas">☎ Llamar ahora</a><a class="btn btn-green" href="https://wa.me/'+contacts[0].whatsapp+'">WhatsApp</a></div><small>Confirma disponibilidad y condiciones para tu municipio.</small></div><div class="hero-services"><strong>¿Qué necesitas?</strong><span>✓ Antenas TDT</span><span>✓ Parabólicas</span><span>✓ Porteros automáticos</span><span>✓ Videoporteros</span><span>✓ Amplificación de señal</span></div></div></section>';
const gallery='<section class="section gallery" id="galeria"><div class="wrap"><span class="eyebrow">Fotografías de equipos</span><h2>Antenas, porteros y sistemas de acceso</h2><div class="gallery-grid"><figure><img src="'+assets.parabola+'" loading="lazy" alt="Antena parabólica"><figcaption>Recepción por satélite</figcaption></figure><figure><img src="'+assets.porteros+'" loading="lazy" alt="Placa de portero automático"><figcaption>Porteros automáticos</figcaption></figure><figure><img src="'+assets.videoporteros+'" loading="lazy" alt="Equipo de control de acceso"><figcaption>Equipos de acceso</figcaption></figure></div><small>Imágenes ilustrativas de equipos, no fotografías acreditadas de trabajos realizados.</small></div></section>';
const home=hero+'<section class="services-intro wrap" id="servicios"><h2>Tres especialidades. La misma importancia.</h2><p>Reparamos e instalamos antenas, porteros automáticos y videoporteros para viviendas y comunidades.</p></section>'+cards+brandBar+zonesBar+regional+gallery+'<section class="contact" id="contacto"><div class="wrap"><h2>¿Necesitas un técnico?</h2><p>Indica tu pueblo y qué ha dejado de funcionar.</p><a class="btn btn-yellow" href="/#telefonos-zonas">Consultar contacto →</a></div></section>';
const descriptions=[
 'Instalación y reparación de antenas TDT, parabólicas, amplificadores y antenas colectivas.',
 'Reparación e instalación de porteros automáticos, placas, telefonillos y apertura.',
 'Instalación y reparación de videoporteros, monitores, placas y sistemas de acceso.'
];
const servicePages=site.services.map((s,i)=>{
 const image=[assets.antennas,assets.porteros,assets.videoporteros][i];
 return {url:'/servicios/'+s.id+'/',title:s.title+' | '+site.brand,description:descriptions[i],
 body:'<section class="service-hero"><div class="wrap"><div><span class="eyebrow">Urgencias 24 horas · Instalación y reparación</span><h1>'+esc(s.title)+'</h1><p>'+esc(descriptions[i])+' Consulta atención en tu municipio y condiciones antes de la visita.</p><a class="btn btn-yellow" href="/#telefonos-zonas">Consultar teléfono de mi zona</a></div><img src="'+image+'" alt="'+esc(s.title)+'"></div></section>'+regional+'<div class="wrap back-link"><a href="/">← Volver a la portada</a></div>'};
});
fs.rmSync(OUT,{recursive:true,force:true});
fs.mkdirSync(path.join(OUT,'assets'),{recursive:true});
fs.copyFileSync('src/styles.css',path.join(OUT,'assets/styles.css'));
for(const url of Object.values(assets)){
 const file=path.basename(url),source=path.join('src/media',file);
 if(!fs.existsSync(source))throw Error('Imagen ausente: '+source);
 fs.copyFileSync(source,path.join(OUT,'assets',file));
}
const write=(url,content)=>{const file=path.join(OUT,url==='/'?'index.html':url.slice(1)+'index.html');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content)};
write('/',document(site.brand+' | Antenas, porteros y videoporteros','Servicio técnico de antenas, porteros automáticos y videoporteros. Urgencias 24 horas según disponibilidad.',home));
for(const p of servicePages)write(p.url,document(p.title,p.description,p.body));
fs.writeFileSync(path.join(OUT,'robots.txt'),'User-agent: *\nDisallow: /\n');
console.log('BUILD OK: diseño de referencia aplicado, logo SVG, hero, 3 servicios, marcas, zonas y teléfonos. Prepublicación noindex.');
