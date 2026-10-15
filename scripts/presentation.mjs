import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Capa editorial estática: conserva todas las rutas, canonicals y contactos
// del generador municipal. Se ejecuta antes de la auditoría, nunca en el cliente.
export const slogan = 'Profesional de antenas cerca de tu localidad';
const commitments = [
 ['Contacto directo', 'Tu consulta, con el contacto asignado a tu provincia.'],
 ['Diagnóstico primero', 'Localizar el fallo antes de proponer un cambio de equipo.'],
 ['Equipos compatibles', 'Revisar el sistema, no elegir solo por la apariencia.'],
 ['Condiciones claras', 'Concretar el trabajo y el desplazamiento antes de la visita.'],
 ['Comprobación final', 'Revisar las funciones incluidas en el trabajo acordado.']
];
export function confidence(compact = false) {
 return `<section class="confidence${compact ? ' confidence-compact' : ''}" id="confianza" aria-labelledby="confidence-title"><div class="wrap"><div class="confidence-heading"><span class="kicker">Nuestro compromiso</span><h2 id="confidence-title">La confianza no se promete.<br>Se trabaja.</h2><p>Cinco compromisos para cuidar de tu instalación.</p></div><div class="commitment-grid">${commitments.map(([title,text]) => `<article><span class="commitment-star" aria-hidden="true">★</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div></div></section>`;
}
const propertySection = `<section class="section wrap property-section" id="tipos-instalacion"><div class="section-head"><div><span class="kicker">No todas las instalaciones son iguales</span><h2>Una vivienda.<br>Una comunidad.<br>La solución adecuada.</h2></div><p>El número de usuarios, el cableado existente y el uso del equipo cambian la forma de preparar una instalación o una reparación.</p></div><div class="property-grid"><article><span class="property-label">01 / VIVIENDAS</span><h3>Tu casa, a tu medida.</h3><p>Una toma de televisión que falta, una parabólica por orientar o un portero que quieres renovar. Explica cuántas estancias o accesos necesitas atender y qué equipo tienes instalado.</p><p class="property-note">Antena individual · Tomas de TV · Portero y videoportero</p><a class="text-link" href="#contacto">Consultar para mi vivienda ↗</a></article><article><span class="property-label">02 / COMUNIDADES</span><h3>Mirar el conjunto.</h3><p>Cuando varios vecinos tienen el mismo fallo, la información del conjunto ayuda a delimitar la revisión. Para renovar porteros se prepara el alcance de placas, telefonillos, monitores y viviendas afectadas.</p><p class="property-note">Antena colectiva · Cabecera · Placa comunitaria</p><a class="text-link" href="#contacto">Preparar el aviso de la comunidad ↗</a></article><article><span class="property-label">03 / NEGOCIOS</span><h3>El servicio, organizado.</h3><p>Indica cuántas pantallas o puntos de acceso utilizas, el horario en que puede revisarse la instalación y qué función ha dejado de trabajar. Así se puede concretar la intervención sin dar por supuesto el alcance.</p><p class="property-note">Distribución de TV · Recepción · Acceso al local</p><a class="text-link" href="#contacto">Consultar para mi negocio ↗</a></article></div></section>`;
const diagnosis = [
 ['La TV dice «sin señal»', 'Antenas TDT y parabólicas', 'Describe si faltan todos los canales o solo algunos. Indica si ocurre en un televisor, en toda la vivienda o también a los vecinos. Esas diferencias ayudan a preparar la revisión de recepción y distribución.', 'Televisores afectados · Canales que fallan · Desde cuándo ocurre', '/servicios/antenas/'],
 ['El portero no llama o no abre', 'Porteros automáticos', 'Explica por separado si hay llamada, si se oye en ambos sentidos y si funciona la apertura. Facilita la marca visible del telefonillo y si el fallo afecta a una vivienda o a varias; no desmontes el equipo para buscarla.', 'Llamada · Audio · Apertura · Viviendas afectadas', '/servicios/porteros/'],
 ['La pantalla del videoportero no se ve', 'Videoporteros', 'Indica si el monitor recibe llamada, si permite hablar y si abre la puerta aunque no muestre imagen. Para una renovación, explica cuántos monitores necesitas y si el sistema actual es de audio o de vídeo.', 'Imagen · Sonido · Número de monitores · Sistema actual', '/servicios/videoporteros/']
];
const helpSection = `<section class="section equipment-guide" id="galeria"><div class="wrap"><div class="section-head"><div><span class="kicker">Empieza por el síntoma</span><h2>Cuéntanos qué falla.<br>No qué pieza cambiar.</h2></div><p>Una consulta bien explicada ayuda a preparar el trabajo. Estas comprobaciones son de uso normal: sin abrir equipos, tocar cableado ni subir a la cubierta.</p></div><div class="symptom-grid">${diagnosis.map(([title,label,text,notes,url],i) => `<article><div class="symptom-heading"><span class="symptom-number">0${i+1}</span><span class="kicker">${label}</span></div><h3>${title}</h3><p>${text}</p><div class="symptom-notes"><strong>Qué indicar</strong><p>${notes}</p></div><a class="text-link" href="${url}">Ver instalación y reparación ↗</a></article>`).join('')}</div></div></section>`;
const budgetSection = `<section class="section wrap scope-section" id="presupuesto"><div><span class="kicker">Antes de decidir</span><h2>Un presupuesto<br>con el alcance claro.</h2><p>No es lo mismo reparar un punto de conexión que renovar una instalación comunitaria. La consulta debe dejar claro qué trabajo se propone y qué queda fuera.</p><a class="btn btn-dark" href="#contacto">Explicar mi instalación ↗</a></div><div class="scope-list"><article><span>01</span><div><h3>Qué se va a revisar</h3><p>El fallo observado, los equipos afectados y si la revisión corresponde a una vivienda o al sistema común.</p></div></article><article><span>02</span><div><h3>Qué se va a instalar o sustituir</h3><p>Los componentes, el cableado y las funciones que se necesitan, comprobando la compatibilidad del sistema.</p></div></article><article><span>03</span><div><h3>Qué condiciones se acuerdan</h3><p>Desplazamiento, mano de obra, materiales y disponibilidad. Consulta el importe y el alcance antes de autorizar el trabajo.</p></div></article></div></section>`;
const serviceDetails = {
 antenas: [
  'Recepción, distribución y tomas: un mismo recorrido.',
  'Para instalar una antena se prepara dónde se recibirá la señal y hasta qué puntos debe llegar. Para reparar, interesa saber en qué parte de ese recorrido empieza el fallo.',
  [['Instalación nueva','Indica cuántas tomas de televisión necesitas y si el inmueble utiliza antena individual o comunitaria. Para satélite, concreta la recepción deseada y el receptor que vas a utilizar.'],['Reparación de una avería','Explica si el problema es permanente o intermitente y qué televisores afecta. La revisión del punto de recepción y de la distribución permite valorar el alcance antes de sustituir componentes.'],['Al finalizar el trabajo','Pide que se comprueben las tomas incluidas en la intervención y la recepción acordada. Si quedan otros puntos fuera del presupuesto, conviene identificarlos expresamente.']]
 ],
 porteros: [
  'Llamar, escuchar y abrir. Las tres funciones cuentan.',
  'Preparar bien un aviso de portero evita confundir la avería de un telefonillo con una incidencia de la comunidad. La consulta empieza por la función que falla.',
  [['Antes de elegir un telefonillo','Facilita la marca y referencia que puedas ver sin desmontar el equipo. Explica si quieres reparar una sola vivienda o renovar la instalación completa.'],['Para una comunidad','Indica el número de viviendas, las placas de acceso y qué funciones se quieren conservar. Coordina la consulta con la persona responsable de la instalación comunitaria.'],['Al finalizar el trabajo','Pide revisar llamada, conversación en ambos sentidos y apertura en los puntos incluidos en la intervención. Confirma qué equipos o accesos no forman parte del trabajo.']]
 ],
 videoporteros: [
  'Una imagen nueva empieza por un sistema compatible.',
  'Renovar el monitor y pasar de audio a vídeo son trabajos distintos. Se prepara la elección del equipo a partir de la instalación existente, no solo del diseño de la pantalla.',
  [['Cambiar de audio a vídeo','Explica el sistema actual, cuántas viviendas participan y el número de accesos. La posibilidad de conservar cableado se estudia antes de ofrecer una solución.'],['Sustituir o ampliar monitores','Indica el número de monitores actuales y deseados, la marca visible y las funciones necesarias. No se presupone que cualquier pantalla pueda conectarse a la placa existente.'],['Al finalizar el trabajo','Pide comprobar llamada, imagen, conversación y apertura en los monitores acordados. Consulta cómo utilizar los controles del nuevo equipo y qué funciones se han incluido.']]
 ]
};
function planning(type) {
 const [title,intro,steps] = serviceDetails[type];
 return `<section class="section wrap service-planning"><div class="section-head"><div><span class="kicker">Instalar, reparar o renovar</span><h2>${title}</h2></div><p>${intro}</p></div><div class="planning-grid">${steps.map(([h,p],i) => `<article><span class="property-label">0${i+1}</span><h3>${h}</h3><p>${p}</p></article>`).join('')}</div></section>`;
}
function localScope() {
 return `<section class="section wrap local-scope"><span class="kicker">Preparar la visita</span><h2>Tu aviso, bien definido.</h2><div class="planning-grid"><article><h3>Para una reparación</h3><p>Explica qué ha dejado de funcionar y desde cuándo. Indica si afecta a una toma, a una vivienda o también a otros vecinos; no es necesario desmontar equipos para pedir asistencia.</p></article><article><h3>Para instalar o renovar</h3><p>Concreta los puntos de televisión, viviendas, placas o monitores que necesitas. La marca visible del sistema actual ayuda a estudiar el alcance y la compatibilidad.</p></article><article><h3>Antes de concertar la visita</h3><p>Confirma dirección, acceso a las zonas que deben revisarse, disponibilidad y condiciones de desplazamiento. Solicita que materiales y trabajo propuesto queden definidos.</p></article></div></section>`;
}
function replaceOne(html, oldValue, newValue, label) {
 const matches = html.split(oldValue).length - 1;
 if(matches !== 1) throw Error(`Revisión editorial: ${label}, se esperaba una coincidencia y hay ${matches}`);
 return html.replace(oldValue,newValue);
}
export function transform(html, page) {
 html = html.replaceAll('btn-yellow','btn-primary').replaceAll('#17201f','#14243b')
  .replace('href="/assets/styles.css"','href="/assets/styles.css?v=azul-confianza-v1"')
  .replace('href="/assets/favicon.svg"','href="/assets/favicon.svg?v=azul-confianza-v1"')
  .replace('</head>','<meta name="build-version" content="azul-confianza-v1"></head>');
 if(page.type === 'home') {
  const heading = '<h1>'+slogan.replace('cerca de tu localidad','<span class="highlight">cerca de tu localidad</span>')+'</h1>';
  html = replaceOne(html, '<h1>Tu antenista.<br><span class="highlight">En tu pueblo.</span></h1>', heading, 'eslogan');
  html = replaceOne(html, 'Instalar, reparar o renovar. Cuéntanos qué necesitas y encuentra el contacto de tu localidad.', 'Antenista en tu pueblo para instalar, reparar y renovar. Televisión, porteros y videoporteros: tres especialidades, un contacto para tu zona.', 'presentación');
  html = html.replace('La señal vuelve a importar.','Instalación y reparación, de principio a fin.');
  html = replaceOne(html, '<section class="section wrap" id="servicios">', confidence()+'<section class="section wrap" id="servicios">', 'estrellas');
  html = replaceOne(html, '<section class="promise" id="como-trabajamos">', propertySection+'<section class="promise" id="como-trabajamos">', 'inmuebles');
  const oldGallery = /<section class="section wrap" id="galeria">[\s\S]*?<\/section>/g;
  if([...html.matchAll(oldGallery)].length !== 1) throw Error('No se localiza la antigua galería');
  html = html.replace(oldGallery, helpSection+budgetSection);
  html = html.replace('Tu pueblo importa.','Tu servicio empieza en tu pueblo.');
  html = html.replace('Dos zonas. La misma atención.','Habla con el contacto de tu zona.');
 }
 if(page.type === 'service' || page.type === 'town') {
  const extra = page.type === 'service' ? planning(page.url.split('/')[2]) : localScope();
  html = replaceOne(html, '<section class="section contact-section" id="contacto">', extra+confidence(true)+'<section class="section contact-section" id="contacto">', 'contenido técnico y confianza');
 }
 if(/hero-obra\.webp|#ffcf35|btn-yellow/.test(html)) throw Error('La salida conserva un recurso visual retirado: '+page.url);
 return html;
}
export function applyPresentation(root='dist') {
 const reportPath = path.join(root,'build-report.json');
 const report = JSON.parse(fs.readFileSync(reportPath,'utf8'));
 for(const page of report.pages) {
  const file = path.join(root,page.url === '/404.html' ? '404.html' : page.url === '/' ? 'index.html' : page.url.slice(1)+'index.html');
  fs.writeFileSync(file,transform(fs.readFileSync(file,'utf8'),page));
 }
 fs.rmSync(path.join(root,'assets/hero-obra.webp'),{force:true});
 fs.writeFileSync(path.join(root,'assets/favicon.svg'),'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="13" fill="#245bdb"/><text x="30" y="43" text-anchor="middle" font-family="Arial,sans-serif" font-size="35" font-weight="bold" fill="#fff">24</text><path d="M15 51h34" stroke="#fff" stroke-width="3"/></svg>');
 report.presentation = {version:'azul-confianza-v1',slogan,homePhotos:4,removedPhoto:'hero-obra.webp',stars:'Cinco compromisos de servicio; no valoraciones de clientes.'};
 fs.writeFileSync(reportPath,JSON.stringify(report,null,2));
 console.log(`PRESENTACIÓN OK: azul/antracita, eslogan nuevo, foto inferior retirada, 5 compromisos con estrellas y contenido ampliado en portada, servicios y municipios (${report.totalPages} páginas).`);
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) applyPresentation();
