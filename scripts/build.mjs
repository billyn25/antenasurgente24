import fs from 'node:fs';
import path from 'node:path';
import site from '../config/site.json' with {type:'json'};
import {contactsForHome} from './contacts.mjs';

const OUT='dist';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const media={
 antennas:'/assets/antena-tdt.jpeg',
 porteros:'/assets/portero-fermax.jpeg',
 videoporteros:'/assets/portero-tegui.jpeg',
 parabola:'/assets/parabolica.jpeg',
 hero:'/assets/hero-obra.webp'
};
const region=contactsForHome();
const buttons=(x)=>'<div class="actions"><a class="btn btn-yellow" href="tel:'+x.tel+'">☎ Llamar '+esc(x.phone)+'</a><a class="btn btn-green" href="https://wa.me/'+x.whatsapp+'">WhatsApp</a></div>';
const nav='<div class="topbar"><div class="wrap"><span>Antenas · Porteros automáticos · Videoporteros</span><strong>Urgencias 24 horas · Disponibilidad según zona</strong></div></div><header class="header"><div class="wrap"><a class="brand" href="/">ANTENISTA URGENTE<span>24 HORAS</span></a><nav class="nav" aria-label="Navegación principal"><a href="/#servicios">Servicios</a><a href="/#marcas">Marcas</a><a href="/#galeria">Galería</a><a href="/#telefonos-zonas">Provincias y contacto</a></nav><a class="btn btn-yellow" href="/#telefonos-zonas">☎ Ver teléfonos</a></div></header>';
const footer='<footer class="footer"><div class="wrap"><span>© '+new Date().getFullYear()+' '+esc(site.brand)+' · Atención según disponibilidad</span><span>Web en preparación. Datos legales y cobertura pendientes de confirmar.</span></div></footer><div class="mobile-actions"><a class="btn btn-yellow" href="/#telefonos-zonas">☎ Teléfonos</a><a class="btn btn-green" href="https://wa.me/'+region[0].whatsapp+'">WhatsApp Madrid</a></div>';
const html=(title,description,body)=>'<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="description" content="'+esc(description)+'"><title>'+esc(title)+'</title><link rel="preload" as="image" href="'+media.hero+'"><link rel="stylesheet" href="/assets/styles.css"></head><body>'+nav+'<main>'+body+'</main>'+footer+'</body></html>';
const brandTags=items=>items.map(s=>'<span>'+esc(s)+'</span>').join('');
const photo=(src,alt,caption,loading='lazy')=>'<figure class="hero-photo"><img src="'+src+'" alt="'+esc(alt)+'" loading="'+loading+'" decoding="async"><figcaption>'+esc(caption)+'</figcaption></figure>';
const heroVisual='<div class="hero-visual">'+photo(media.hero,'Instalación de antena de televisión en cubierta','Antenas TDT y parabólicas','eager')+photo(media.porteros,'Placa de portero automático','Porteros automáticos','eager')+photo(media.videoporteros,'Equipo de control de acceso','Videoporteros y acceso','eager')+'<div class="hero-badge"><span>24H</span><small>Urgencias</small></div></div>';
const hero='<section class="hero hero-new"><div class="wrap hero-layout"><div class="hero-copy"><span class="eyebrow">Servicio técnico para viviendas y comunidades</span><h1>Antenas, porteros y videoporteros. <em>Un técnico cuando lo necesitas.</em></h1><p>Instalamos, reparamos y revisamos los tres sistemas con la misma importancia. Cuéntanos el problema y en qué pueblo necesitas asistencia.</p><div class="actions"><a class="btn btn-dark" href="/#telefonos-zonas">☎ Consultar mi zona</a><a class="btn btn-outline" href="/#servicios">Nuestros servicios ↓</a></div><p class="hero-note">Urgencias 24 horas · Disponibilidad y desplazamiento a confirmar.</p></div><div class="hero-feature"><img src="'+media.hero+'" alt="Antenas de televisión instaladas sobre cubierta" width="1200" height="520" fetchpriority="high"><div class="hero-feature-label"><span>ATENCIÓN TÉCNICA</span><strong>Instalación y reparación</strong></div></div></div><div class="wrap hero-service-row"><a href="/servicios/antenas/"><span class="hero-service-num">01</span><strong>Antenas</strong><small>TDT · Parabólicas · Amplificación</small><b>↗</b></a><a href="/servicios/porteros/"><span class="hero-service-num">02</span><strong>Porteros automáticos</strong><small>Audio · Placas · Apertura</small><b>↗</b></a><a href="/servicios/videoporteros/"><span class="hero-service-num">03</span><strong>Videoporteros</strong><small>Monitores · Imagen · Renovación</small><b>↗</b></a></div></section>';
const strip='<div class="strip"><div class="wrap"><div class="strip-item"><i>✓</i> Atención directa para tu localidad</div><div class="strip-item"><i>✓</i> Reparación e instalación</div><div class="strip-item"><i>✓</i> Equipos antiguos y actuales</div></div></div>';
const images=[media.antennas,media.porteros,media.videoporteros];
const descriptions=[
 'Falta de canales, antenas colectivas, parabólicas, cabeceras, amplificadores y tomas. Primero comprobamos dónde está el fallo.',
 'Fallos de llamada, audio o apertura. Revisión de placa, telefonillo, alimentación y cableado antes de sustituir componentes.',
 'Instalación y renovación de sistemas con imagen, monitores y placas de calle. Revisamos la compatibilidad con la instalación existente.'
];
const cards=site.services.map((s,i)=>'<article class="service-card"><div class="service-art"><img src="'+images[i]+'" alt="'+esc(s.title)+'" loading="lazy" decoding="async"></div><div class="service-body"><h3>'+esc(s.title)+'</h3><p>'+esc(descriptions[i])+'</p><a href="/servicios/'+s.id+'/">Ver instalación y reparación →</a></div></article>').join('');
const servicesSection='<section class="section" id="servicios"><div class="wrap"><div class="section-head"><div><span class="eyebrow">Nuestros servicios</span><h2>Tres especialidades. La misma importancia.</h2><p class="section-lead">Una web pensada para encontrar un técnico de antenas, reparar un portero o instalar un videoportero sin complicaciones.</p></div></div><div class="service-grid">'+cards+'</div></div></section>';
const trust='<section class="section soft"><div class="wrap"><span class="eyebrow">Asistencia técnica</span><h2>Resolver la avería, sin dar vueltas.</h2><div class="trust-grid"><article class="trust"><div class="number">01</div><strong>Cuéntanos qué falla</strong><p>Si se ha perdido señal, si no abre el portal o si el videoportero no muestra imagen.</p></article><article class="trust"><div class="number">02</div><strong>Indica tu pueblo</strong><p>Comprobamos disponibilidad en la localidad y las condiciones del desplazamiento.</p></article><article class="trust"><div class="number">03</div><strong>Revisión del sistema</strong><p>Antes de sustituir, comprobamos el equipo, las conexiones y los elementos compatibles.</p></article></div></div></section>';
const brands='<section class="section" id="marcas"><div class="wrap"><span class="eyebrow">Equipos y fabricantes</span><h2>Marcas que conocemos, instalaciones que entendemos.</h2><p class="section-lead">Trabajamos con equipos de distintas generaciones. La mención de marcas no implica representación ni servicio técnico oficial.</p><div class="brand-groups"><div class="brand-panel"><h3>Antenas y amplificación</h3><div class="brand-tags">'+brandTags(site.antennaBrands)+'</div></div><div class="brand-panel"><h3>Porteros y videoporteros</h3><div class="brand-tags">'+brandTags(site.doorphoneBrands)+'</div></div></div></div></section>';
const gallery='<section class="section soft" id="galeria"><div class="wrap"><span class="eyebrow">Galería de equipos</span><h2>Instalaciones, componentes y tecnología.</h2><div class="gallery-grid"><figure class="gallery-item"><img src="'+media.parabola+'" loading="lazy" alt="Antena parabólica"><figcaption>Antenas parabólicas y recepción</figcaption></figure><figure class="gallery-item"><img src="'+media.porteros+'" loading="lazy" alt="Placa de portero automático"><figcaption>Porteros automáticos y placas</figcaption></figure><figure class="gallery-item"><img src="'+media.videoporteros+'" loading="lazy" alt="Equipo de control de acceso"><figcaption>Equipos de acceso y renovación</figcaption></figure></div><p class="gallery-note">Fotografías ilustrativas de equipos; no se presentan como trabajos propios. La galería de instalaciones realizadas se añadirá con imágenes verificadas.</p></div></section>';
const regional='<section class="section" id="telefonos-zonas"><div class="wrap"><span class="eyebrow">Contacto por zonas</span><h2>Un teléfono claro para cada zona.</h2><p class="section-lead">Elige la zona de tu municipio. El contacto se asignará automáticamente en cada página local.</p><div class="regional-contacts">'+region.map(x=>'<article class="regional-contact"><h3>'+esc(x.label)+'</h3><strong>'+esc(x.phone)+'</strong>'+buttons(x)+'</article>').join('')+'</div></div></section>';
const contact='<section class="section contact" id="contacto"><div class="wrap"><div><span class="eyebrow">Urgencias 24 horas</span><h2>¿Falla la antena o el portero?</h2><p>Indica el municipio y la avería. Confirma la disponibilidad y el presupuesto antes de la visita.</p></div><a class="btn btn-yellow" href="/#telefonos-zonas">Consultar teléfono de mi zona →</a></div></section>';
const home=hero+strip+servicesSection+trust+brands+gallery+regional+contact;
const servicePages=site.services.map((s,i)=>({
 url:'/servicios/'+s.id+'/',
 title:s.title+' | '+site.brand,
 description:descriptions[i],
 body:'<section class="hero"><div class="wrap"><div class="hero-copy"><span class="eyebrow">Instalación y reparación · Urgencias 24 horas</span><h1>'+esc(s.title)+' <em>cerca de tu pueblo.</em></h1><p>'+esc(descriptions[i])+'</p><div class="actions"><a class="btn btn-dark" href="/#telefonos-zonas">Consultar teléfono de mi zona</a><a class="btn btn-outline" href="/">Volver a portada</a></div></div><div class="hero-visual">'+photo(images[i],s.title,'Instalación y reparación','eager')+photo(media.antennas,'Antena TDT','Antenas')+photo(media.porteros,'Portero automático','Porteros')+'</div></div></section><section class="section"><div class="wrap"><span class="eyebrow">Diagnóstico técnico</span><h2>¿Qué debemos revisar?</h2><p class="section-lead">Al solicitar una visita, indica el municipio, el tipo de inmueble, el modelo si lo conoces y los síntomas. La disponibilidad se confirma al contactar.</p></div></section>'+regional
}));
fs.rmSync(OUT,{recursive:true,force:true});
fs.mkdirSync(path.join(OUT,'assets'),{recursive:true});
fs.copyFileSync('src/styles.css',path.join(OUT,'assets/styles.css'));
for(const [key,url] of Object.entries(media)){
 const source=path.join('src/media',path.basename(url));
 if(!fs.existsSync(source))throw Error('Imagen ausente: '+source);
 fs.copyFileSync(source,path.join(OUT,url.slice('/assets/'.length)));
}
const write=(url,content)=>{
 const file=path.join(OUT,url==='/'?'index.html':url.slice(1)+'index.html');
 fs.mkdirSync(path.dirname(file),{recursive:true});
 fs.writeFileSync(file,content);
};
write('/',html(site.brand+' | Antenas, porteros y videoporteros','Instalación y reparación de antenas, porteros automáticos y videoporteros. Urgencias 24 horas sujetas a disponibilidad.',home));
for(const s of servicePages)write(s.url,html(s.title,s.description,s.body));
fs.writeFileSync(path.join(OUT,'robots.txt'),'User-agent: *\nDisallow: /\n');
console.log('BUILD OK: nuevo hero fotográfico, tres servicios, galería y contactos por zona. Prepublicación noindex.');
