import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import contexts from '../config/local-contexts.json' with {type:'json'};
import {districts} from '../config/madrid-districts.mjs';
import {section,decode} from './starlink.mjs';
export const localVersion='local-combinaciones-tecnicas-v4';
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const localProfiles=contexts.locations;
export const localTechnicalProfiles=[
 {id:'temporal-estructura',heading:'Viento, lluvia y elementos exteriores',items:[
  ['Antena movida o dañada por viento','Si una pérdida de señal aparece después de viento fuerte, se revisan orientación, fijaciones, mástil y conexiones antes de sustituir la antena. Una pequeña variación puede afectar más a unos canales que a otros.'],
  ['Mástil, soporte o herrajes con corrosión','El óxido y el deterioro de fijaciones no se resuelven aumentando señal. En una revisión se comprueba la estabilidad del conjunto y si los elementos estructurales siguen siendo adecuados para soportar la instalación.'],
  ['Cable coaxial cuarteado o con entrada de agua','Un coaxial exterior envejecido puede dejar entrar humedad por la cubierta, conectores o cajas. La avería puede presentarse como cortes intermitentes o empeorar con lluvia aunque la antena siga orientada.']
 ]},
 {id:'recepcion-compleja',heading:'Cuando recibir más señal no significa recibir mejor',items:[
  ['Señales que llegan por más de un centro emisor','En determinados emplazamientos pueden recibirse señales por recorridos distintos. Antes de amplificar se mide nivel y calidad y se ajusta la orientación para reducir ecos o recepciones incompatibles.'],
  ['Amplificación excesiva','Un amplificador no corrige cualquier fallo. Si la entrada ya es alta o llega degradada, añadir ganancia puede saturar la instalación; primero se separa el problema de recepción del de distribución.'],
  ['Faltan solo algunos canales','Cuando desaparece un grupo concreto de canales interesa comparar tomas y otras viviendas, además de revisar recepción y cabecera. Ese patrón orienta mejor que limitarse a cambiar el televisor o la antena.']
 ]},
 {id:'sombra-sat-uhd',heading:'Zonas con recepción terrestre difícil',items:[
  ['TDT terrestre insuficiente después de revisar la instalación','Si la señal disponible sigue siendo deficiente tras comprobar antena, cableado y amplificación, se puede valorar una solución de televisión por satélite cuando el servicio y sus requisitos sean adecuados para esa ubicación.'],
  ['TDT por satélite como alternativa, no como parche','La recepción por satélite se estudia cuando la vía terrestre no ofrece una solución razonable. Requiere equipo compatible, orientación y comprobar las condiciones del servicio antes de presupuestar.'],
  ['Receptores preparados para UHD y nuevos formatos','Si se renueva un receptor conviene revisar compatibilidad con UHD, códecs y estándares admitidos por el equipo. Comprar solo por precio puede dejar una instalación limitada ante cambios de emisión.']
 ]},
 {id:'torretas-comunidades',heading:'Altura y estructuras en comunidades',items:[
  ['Torreta o mástil para ganar despeje','Cuando edificios, arbolado o relieve bloquean la recepción, ganar altura puede ayudar si la medición confirma una mejora. La solución debe valorar soporte, anclajes, estabilidad y carga del conjunto.'],
  ['Tensores, anclajes y estado de la estructura','En torretas existentes no basta con mirar la antena. Se revisan corrosión, tensores, fijaciones y verticalidad, especialmente después de temporales o cuando la estructura lleva años expuesta.'],
  ['Retirar una estructura que ya no aporta','Una torreta antigua no debe conservarse por inercia si la recepción actual permite otra solución. Antes de desmontarla se comprueba qué servicios soporta y cómo quedará resuelta la captación.']
 ]},
 {id:'cabecera-comunitaria',heading:'Cabeceras y distribución colectiva',items:[
  ['Un grupo de canales falla en todo el edificio','Si varias viviendas pierden los mismos canales, la revisión se centra en recepción, fuente, central o módulos de cabecera antes de intervenir toma por toma.'],
  ['Previos, fuentes y monocanales','Una fuente fatigada o un módulo concreto puede provocar una avería parcial. Medir entrada y salida ayuda a decidir si se repara una parte o si la cabecera necesita una actualización mayor.'],
  ['Nueva toma o redistribución de señal','Añadir televisores o derivaciones modifica las pérdidas de la red. Antes de crear una toma se estudia el reparto existente para no mejorar una habitación a costa de empeorar las demás.']
 ]},
 {id:'parabolica-satelite',heading:'Parabólicas y recepción por satélite',items:[
  ['Parabólica que pierde señal con lluvia o viento','Se comprueban fijación, orientación, LNB, conectores y coaxial. Sustituir el LNB sin revisar el resto puede dejar intacta la causa real del problema.'],
  ['LNB y distribución para uno o varios receptores','El tipo de LNB y la distribución dependen del número de usuarios y del sistema. Antes de cambiar componentes se identifica cómo está repartida la señal de satélite.'],
  ['Instalaciones multisatélite o motorizadas','Cuando se pretende recibir más de una posición orbital, el montaje, el control y la compatibilidad del receptor requieren una planificación distinta de una parabólica fija convencional.']
 ]},
 {id:'radio-fm-dab',heading:'Radio FM y DAB/DAB+',items:[
  ['Antena específica para FM o DAB/DAB+','La radio terrestre no se capta igual que la TDT. Se valora el tipo de antena, polarización, orientación y nivel recibido antes de decidir amplificación o distribución.'],
  ['Compartir mástil no significa compartir antena','FM, DAB y televisión pueden convivir en una estructura cuando el montaje lo permite, pero cada servicio necesita su elemento de captación y una integración correcta en la red.'],
  ['Distribución de radio en una comunidad','Para llevar FM o DAB/DAB+ a varias viviendas se comprueba captación exterior, amplificación y red común, evitando perjudicar la televisión al combinar señales.']
 ]},
 {id:'portero-cerradura',heading:'Portero, abrepuertas y cierre mecánico',items:[
  ['El telefonillo funciona pero la puerta no abre','Si llamada y audio están correctos, el diagnóstico se desplaza hacia alimentación, pulsación, cableado y cerradero eléctrico antes de culpar al telefonillo.'],
  ['La cerradura abre pero la puerta no queda cerrada','Una holgura, desalineación del marco o ajuste mecánico puede impedir el cierre aunque el abrepuertas reciba correctamente la orden eléctrica.'],
  ['Apertura intermitente','Cuando unas veces abre y otras no, interesa revisar contactos, alimentación, pulsador, conductores y ajuste del cerradero. Cambiar piezas sin localizar el fallo puede no resolverlo.']
 ]},
 {id:'mantenimiento-comunidad',heading:'Mantenimiento que evita averías mayores',items:[
  ['Revisión después de un temporal','Tras viento o lluvia fuerte conviene comprobar visualmente desde una zona segura si hay movimientos, cable suelto o elementos dañados y dejar la cubierta para personal preparado.'],
  ['Conectores y cajas exteriores','La estanqueidad de conectores y cajas importa tanto como la antena. Agua y oxidación pueden degradar la señal de forma progresiva hasta que el fallo parece repentino.'],
  ['Medir antes de sustituir','En una comunidad la señal se comprueba en recepción, cabecera y puntos de distribución. Esa secuencia ayuda a cambiar solo el elemento que realmente introduce la pérdida.']
 ]},
 {id:'starlink-entorno',heading:'Satélite e Internet: el emplazamiento importa',items:[
  ['Obstrucciones alrededor de una antena Starlink','Árboles, chimeneas y edificios pueden generar interrupciones. El lugar de montaje se elige comprobando obstrucciones y un recorrido de cable razonable, no solo buscando el punto más alto.'],
  ['Soporte expuesto al viento','Una antena instalada en cubierta necesita un soporte adecuado al emplazamiento. Ganar altura aumenta exposición y no debe hacerse sin valorar fijación y estabilidad.'],
  ['Mala Wi‑Fi no siempre significa mala señal exterior','Una conexión por satélite o móvil puede llegar correctamente al router y perder rendimiento dentro de la vivienda. Conviene separar el enlace exterior de la cobertura Wi‑Fi interior.']
 ]},
 {id:'red-tv-ict',heading:'Red de televisión dentro del edificio',items:[
  ['Derivadores, repartidores y tomas forman parte de la avería','Que la antena reciba bien no garantiza que la señal llegue igual a todas las viviendas. Se revisan pérdidas y conexiones a lo largo de la red antes de aumentar ganancia.'],
  ['Una reforma puede cambiar el recorrido de la señal','Si el fallo empezó tras mover una toma, cambiar cableado o reformar una vivienda, ese cambio ayuda a localizar la incidencia sin intervenir primero en la cabecera comunitaria.'],
  ['Distinguir red común y red interior','Si otros vecinos ven correctamente la televisión, el diagnóstico puede concentrarse en la derivación o instalación de la vivienda; si fallan varios, se priorizan los elementos comunes.']
 ]},
 {id:'antena-deteriorada',heading:'Antenas envejecidas o incompletas',items:[
  ['Antena con directores o elementos rotos','Una antena puede seguir dando imagen aunque haya perdido parte de sus elementos, pero su comportamiento puede empeorar frente a ruido, viento o señales débiles. Se revisa el estado mecánico junto con nivel y calidad antes de decidir si compensa sustituirla.'],
  ['Material antiguo que ya limita la instalación','Antenas, repartidores, conectores o amplificadores muy antiguos pueden seguir funcionando parcialmente y aun así no ofrecer el margen necesario. Se comprueba qué componente está realmente obsoleto antes de renovar el conjunto.'],
  ['Antena sin suficiente altura o despeje','Si la antena queda escondida tras cubierta, edificios, arbolado o relieve, aumentar ganancia no siempre resuelve el problema. Se valora si ganar altura o cambiar el punto de captación mejora la recepción de forma medible.']
 ]},
 {id:'mastil-humedad-filtrado',heading:'Mástil, humedad y filtrado de señal',items:[
  ['Amplificador de mástil mojado o con humedad','Un previo o amplificador exterior expuesto a agua puede provocar cortes, pérdidas o fallos intermitentes. Se revisan caja, alimentación, conectores y estado del equipo antes de atribuir la avería a la antena.'],
  ['Filtro 4G/5G inadecuado o ausente','Cuando entran señales móviles próximas a la banda de televisión, se comprueba si la instalación dispone del filtrado adecuado y si el problema es realmente interferencia. No se instala un filtro por rutina sin medir primero.'],
  ['Conexiones exteriores oxidadas','Agua y oxidación en conectores, empalmes o cajas pueden degradar la señal progresivamente. Una instalación puede parecer correcta en seco y fallar después de lluvia o con cambios de temperatura.']
 ]},
 {id:'reemisores-tdt',heading:'Emisores, reemisores y orientación',items:[
  ['Recepción desde más de un emisor o reemisor','En algunos emplazamientos pueden llegar señales por direcciones distintas. La revisión compara nivel y calidad antes de decidir orientación, filtrado o configuración de cabecera; recibir más potencia no siempre significa recibir mejor.'],
  ['Cambio de orientación tras viento','Una antena ligeramente girada puede seguir recibiendo parte de la TDT y perder margen en determinados múltiplex. Se comprueba fijación, orientación y calidad antes de sustituir equipos.'],
  ['Repetidor TDT como parte del entorno de recepción','Cuando la señal disponible depende de un centro reemisor, interesa identificar qué señal está recibiendo realmente la instalación. No se presupone qué emisor corresponde a un pueblo sin comprobar la ubicación y la recepción efectiva.']
 ]},
 {id:'torreta-renovacion',heading:'Torretas, altura y renovación estructural',items:[
  ['Ganar altura cuando la medición lo justifica','En cubiertas con obstáculos puede ser útil elevar la captación con mástil o torreta, siempre que la mejora se confirme y el soporte pueda instalarse con estabilidad y seguridad.'],
  ['Desmontar una torreta antigua','Una estructura antigua puede dejar de ser necesaria después de cambiar el sistema de recepción. Antes de retirarla se identifica qué antenas y servicios soporta y cómo quedará resuelta la instalación.'],
  ['Antena motorizada para varias posiciones orbitales','Una parabólica motorizada requiere más que orientar una antena fija: recorrido libre, soporte estable, ajuste mecánico y compatibilidad de control con el receptor. Se valora como instalación específica, no como ampliación automática.']
 ]},
 {id:'antena-conexion-balun',heading:'Antena, dipolo y conexión exterior',items:[
  ['Caja de conexión de antena deteriorada','La caja del dipolo puede presentar humedad, plástico degradado o conexiones oxidadas. Una antena aparentemente bien orientada puede perder calidad si la conexión entre antena y coaxial está dañada.'],
  ['Conector o latiguillo exterior defectuoso','Un conector mal montado, flojo o corroído puede provocar cortes y pérdida de determinados canales. Se revisa continuidad y estanqueidad antes de sustituir la antena completa.'],
  ['Brazo, boom o elementos deformados','Golpes, hielo, viento o envejecimiento pueden deformar partes de la antena. El estado mecánico se valora junto con la medida de señal para decidir si basta reajustar o conviene renovar.']
 ]},
 {id:'previo-mastil',heading:'Previos y amplificadores de mástil',items:[
  ['Amplificador de mástil sin alimentación','Un previo exterior puede estar correcto y no funcionar porque no recibe tensión desde la fuente interior. Se comprueba alimentación por coaxial, conexiones y consumo antes de cambiar el amplificador.'],
  ['Amplificador de mástil averiado después de tormenta','Una sobretensión o descarga cercana puede dañar el previo, la fuente o ambos. Se mide entrada, salida y alimentación para no sustituir componentes a ciegas.'],
  ['Amplificador con demasiada ganancia','Un previo ajustado demasiado alto puede saturar etapas posteriores o el propio receptor. Se regula según nivel y calidad, no buscando simplemente la cifra máxima de ganancia.']
 ]},
 {id:'fuente-alimentacion-antena',heading:'Fuentes de alimentación de antena',items:[
  ['Fuente sin tensión de salida','Si la fuente deja de alimentar el previo o la cabecera, puede desaparecer la señal en toda la instalación aunque la antena esté perfecta. Se comprueba tensión y estado del equipo antes de subir a cubierta.'],
  ['Fuente que falla en caliente o de forma intermitente','Algunas fuentes envejecidas funcionan en frío y fallan al calentarse. Los cortes repetitivos y la recuperación espontánea son datos útiles para orientar la revisión.'],
  ['Cortocircuito en coaxial que bloquea la alimentación','Un conector mal montado o un cable dañado puede cortocircuitar la alimentación que viaja por coaxial. Se localiza el tramo o conexión defectuosa antes de sustituir fuente o amplificador.']
 ]},
 {id:'cabecera-modulos',heading:'Módulos y centrales de cabecera',items:[
  ['Un módulo monocanal deja de entregar señal','Si solo desaparece un múltiplex en toda la comunidad, puede existir un problema en un módulo, su ajuste o alimentación. Se compara entrada y salida antes de sustituir la cabecera completa.'],
  ['Central programable desajustada','Una central puede necesitar revisión de niveles, filtros o programación tras cambios de recepción. La solución depende de medidas reales, no de copiar ajustes de otra instalación.'],
  ['Fuente común de cabecera fatigada','Cuando varios módulos dependen de una misma fuente, una caída de tensión puede provocar averías parciales o intermitentes. Se comprueba la alimentación bajo carga.']
 ]},
 {id:'portero-grupo-fonico',heading:'Grupo fónico y audio del portero',items:[
  ['Se oye desde la vivienda pero no desde la calle','Un fallo de audio en un solo sentido puede estar en micrófono, altavoz, grupo fónico, terminal o cableado. Se separa el sentido de comunicación para localizar la etapa afectada.'],
  ['No se oye en ninguna vivienda','Cuando el audio falla en todo el portal, se revisan grupo fónico, alimentación y cableado común antes de intervenir telefonillos individuales.'],
  ['Audio con ruido, zumbido o volumen muy bajo','Zumbidos y audio débil pueden relacionarse con alimentación, conexiones, ajuste o deterioro del grupo fónico. Se comprueba el sistema completo antes de cambiar terminales.']
 ]},
 {id:'portero-llamada-pulsadores',heading:'Llamada, pulsadores y cableado del portero',items:[
  ['Un pulsador de la placa no llama','Si solo falla una vivienda, se revisan pulsador, conductor de llamada y terminal correspondiente antes de atribuir la avería a la placa completa.'],
  ['Ningún vecino recibe llamada','Una avería general de llamada puede estar en alimentación, electrónica de placa o cable común. Se diferencia del audio y de la apertura para acotar la causa.'],
  ['La llamada suena en la vivienda equivocada','Cruces de cable, programación o identificación incorrecta pueden provocar llamadas al terminal equivocado. Se revisa el sistema según su tecnología antes de modificar conexiones.']
 ]},
 {id:'portero-fuente',heading:'Fuente y alimentación del portero automático',items:[
  ['Portero completamente apagado','Cuando no hay llamada, audio ni apertura en todo el edificio, una de las primeras comprobaciones es la alimentación del sistema y sus protecciones.'],
  ['La fuente entrega tensión pero cae al accionar','Una fuente fatigada puede mantener tensión en reposo y caer al llamar o activar el abrepuertas. Se comprueba bajo carga antes de sustituir otros elementos.'],
  ['Alimentación inestable provoca fallos distintos','Tensiones inestables pueden causar síntomas aparentemente independientes en placa, telefonillos o cerradura. Medir alimentación ayuda a evitar reparaciones por descarte.']
 ]},
 {id:'cerradura-abrepuertas',heading:'Cerradura eléctrica y abrepuertas',items:[
  ['La bobina del abrepuertas no actúa','Si llega la orden eléctrica pero el cerradero no se mueve, se revisan bobina, mecanismo y tensión aplicada antes de sustituir la placa o el telefonillo.'],
  ['El abrepuertas funciona pero necesita demasiado empuje','Una puerta descolgada, un pestillo forzado o un marco desalineado puede impedir la apertura aunque eléctricamente el sistema funcione. El ajuste mecánico forma parte del diagnóstico.'],
  ['La puerta queda abierta después de accionar','Un cerradero atascado o mal ajustado puede no recuperar su posición. Se diferencia el problema mecánico del eléctrico antes de cambiar el componente.']
 ]},
 {id:'videoportero-imagen',heading:'Cámara, monitor e imagen de videoportero',items:[
  ['Hay llamada y audio pero la pantalla queda negra','Cuando las demás funciones responden, se revisan cámara, monitor, alimentación de vídeo y conexiones específicas antes de sustituir todo el sistema.'],
  ['Imagen con interferencias o cortes','Una imagen inestable puede estar relacionada con alimentación, cableado, conectores o compatibilidad entre equipos. Se compara con otros monitores si los hay.'],
  ['Solo falla un monitor de la comunidad','Si los demás vecinos ven correctamente, la revisión se concentra en ese terminal y su derivación, evitando intervenir primero en la placa exterior.']
 ]}
];
const technicalHeadings=[
 'Tres comprobaciones que pueden cambiar el diagnóstico',
 'Antes de sustituir equipos, conviene separar estas causas',
 'Tres situaciones técnicas que orientan la revisión',
 'Pistas útiles para localizar el origen de una avería',
 'Qué puede cambiar la solución de una instalación',
 'Tres puntos que merece la pena comprobar primero',
 'No todas las averías de señal tienen la misma causa',
 'Qué revisar antes de decidir una sustitución'
];
export function technicalProfileFor(key){
 const digest=createHash('sha256').update('urgente24-combinaciones-v4:'+String(key)).digest();
 const total=localTechnicalProfiles.length;
 const start=digest[0]%total;
 const step=(digest[1]%(total-1))+1;
 const familyIndexes=[start,(start+step)%total,(start+2*step)%total];
 const items=familyIndexes.map((index,i)=>{
  const family=localTechnicalProfiles[index];
  return family.items[digest[2+i]%family.items.length];
 });
 const combo=createHash('sha256').update(familyIndexes.map((index,i)=>localTechnicalProfiles[index].id+':'+localTechnicalProfiles[index].items.indexOf(items[i])).join('|')).digest('hex').slice(0,12);
 return {id:'combo-'+combo,heading:technicalHeadings[digest[6]%technicalHeadings.length],items,families:familyIndexes.map(i=>localTechnicalProfiles[i].id)};
}
function practicalBlock(place,key){
 const profile=technicalProfileFor(key);
 return '<div class="local-practical" data-local-technical="'+e(profile.id)+'" data-local-families="'+e(profile.families.join(','))+'"><span class="kicker">Situaciones que pueden cambiar el diagnóstico</span><h3>'+e(profile.heading)+' en '+e(place)+'</h3><div class="diagnosis">'+profile.items.map(([title,text])=>'<article data-local-case><h3>'+e(title)+'</h3><p>'+e(text)+'</p></article>').join('')+'</div></div>';
}
export const serviceBriefs=[
 {id:'antenas',heading:'Técnico en instalación de antenas',number:'01',label:'Antenas TDT y parabólicas',url:'/servicios/antenas/',request:'Instalación de antenas',image:'antena-televes-dat.png',alt:'Antena Televés DAT BOSS para recepción de televisión TDT',
 text:'Montaje y orientación de antenas TDT y parabólicas, cableado y nuevas tomas. En reparaciones se comprueba si el fallo está en la recepción, la distribución o una conexión de la vivienda.',
 ask:'Anota qué canales fallan y si ocurre en una toma, en todas o también a otros vecinos. Para un montaje nuevo, indica cuántos televisores necesitas conectar.'},
 {id:'amplificacion',heading:'Instalación y reparación de sistemas de amplificación',number:'04',label:'Amplificación y monocanales',url:'/servicios/antenas/#amplificacion',request:'Instalación nueva de sistemas de amplificación',image:'amplificador-monocanal-televes.png',alt:'Amplificador monocanal Televés T12 para una cabecera comunitaria',
 text:'Instalación nueva y reparación de previos, fuentes de alimentación y amplificadores. En comunidades se revisan los módulos monocanal, su alimentación y la distribución antes de decidir qué sustituir.',
 ask:'Indica si faltan todos los canales o un grupo y cuántas viviendas están afectadas. No abras fuentes ni equipos de cabecera.'},
 {id:'porteros',heading:'Técnico en instalación de porteros automáticos',number:'02',label:'Porteros automáticos',url:'/servicios/porteros/',request:'Instalación de porteros automáticos',
 text:'Instalación de placas de calle y telefonillos, renovación de sistemas y reparación de llamada, conversación o apertura. Se verifica la compatibilidad del equipo con la instalación del edificio.',
 ask:'Explica por separado si llama, se oye en ambos sentidos y abre. Para renovar, facilita el número de viviendas y una foto exterior de la placa.'},
 {id:'videoporteros',heading:'Técnico en instalación de videoporteros',number:'03',label:'Videoporteros',url:'/servicios/videoporteros/',request:'Instalación de videoporteros',
 text:'Montaje de cámaras y monitores, renovación de placas y reparación de imagen, sonido y apertura. El paso de audio a vídeo se estudia según el cableado y la alimentación disponibles.',
 ask:'Indica marca, número de monitores y qué función falla. Aclara si quieres cambiar un monitor o actualizar todo el sistema comunitario.'},
 {id:'starlink',heading:'Instalación de antenas Starlink',number:'05',label:'Internet por satélite',url:'/servicios/starlink/',request:'Instalación de antenas Starlink',image:'antena-starlink-standard.png',alt:'Antena Starlink Standard con soporte',
 text:'Elección del emplazamiento, soporte, tendido de cable y configuración del equipo. Se comprueban las obstrucciones con la aplicación y el montaje que corresponde al modelo del kit.',
 ask:'Indica el kit que tienes, dónde iría la antena y dónde necesitas Wi-Fi. El montaje se presupuesta separado del equipo y de la suscripción.'}
];
function nameOf(html){
 const h=html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/);assert(h);
 return decode(h[1].replace(/<br\s*\/?\s*>/g,' ').replace(/<[^>]+>/g,'')).replace(/^Antenista en\s*/,'').replace(/\.$/,'').trim();
}
function brief(s,place){
 const figure=s.image?`<figure class="local-equipment"><img src="/assets/${s.image}" alt="${e(s.alt)}" width="800" height="800" loading="lazy" decoding="async"><figcaption>Equipo de referencia</figcaption></figure>`:'';
 return `<section class="service-detail local-service-brief" id="${s.id}"><div><span class="kicker">${s.number} / ${s.label}</span><h2>${s.heading} en ${e(place)}</h2>${figure}</div><div><p>${s.text}</p><p><strong>Para preparar el aviso:</strong> ${s.ask}</p><div class="actions"><a class="text-link" href="#contacto" data-request-service="${e(s.request)}">Consultar este servicio ↗</a><a class="local-guide-link" href="${s.url}">Ver la guía de ${e(s.label.toLowerCase())} ↗</a></div></div></section>`;
}
function profileBlock(profile,place,key){
 return `<section class="context-box local-address-guide" id="direccion-local"><span class="kicker">Tu dirección, bien identificada</span><h2>${e(profile.heading)}</h2>${profile.paragraphs.map(t=>'<p>'+e(t)+'</p>').join('')}${(profile.related||[]).map(r=>'<p><a class="text-link" href="'+e(r.url)+'">'+e(r.label)+' ↗</a></p>').join('')}<p class="local-source">Referencias de localidad: ${profile.sources.map(s=>'<a href="'+e(s.url)+'" target="_blank" rel="noopener noreferrer">'+e(s.label)+'</a>').join(' · ')}</p>${practicalBlock(place,key)}</section>`;
}
function enrichForm(html,p,profile){
 const district=p.type==='district'?districts.find(d=>d.slug===p.district):null;
 const examples=district?.barrios||profile?.examples||[];
 const title=district?'Barrio de Madrid (opcional)':'Barrio o localidad dentro del municipio (opcional)';
 const field=`<label class="wide local-address-field">${title}<input name="nucleo" type="text" maxlength="100" autocomplete="off"${examples.length?' list="local-address-options"':''} data-local-location="${e(p.town)}" data-local-province="${e(p.province)}" placeholder="${examples.length?e(examples.slice(0,2).join(', ')):'Barrio, pedanía o núcleo de población'}">${examples.length?'<datalist id="local-address-options">'+examples.map(s=>'<option value="'+e(s)+'"></option>').join('')+'</datalist>':''}</label>`;
 const anchor='<label>Tu teléfono (opcional)';assert(html.includes(anchor),'Formulario local no reconocido');
 html=html.replace(anchor,field+anchor);
 const textarea='<label class="wide">Cuéntanos qué ocurre';assert(html.includes(textarea));
 const symptoms='<label>Qué necesitas (opcional)<select name="sintoma"><option value="">Selecciona el problema</option><optgroup label="Antenas y amplificación"><option>Sin señal en todos los canales</option><option>Pixelación o faltan algunos canales</option><option>Una toma funciona y otra no</option></optgroup><optgroup label="Porteros automáticos y videoporteros"><option>No suena la llamada</option><option>No se oye o solo se oye en un sentido</option><option>No abre la puerta</option><option>Videoportero sin imagen</option></optgroup><optgroup label="Starlink"><option>Montaje de un kit Starlink nuevo</option><option>Reubicación de una antena Starlink</option></optgroup><option>Instalación nueva o renovación</option><option>Otro problema</option></select></label><label>A quién afecta (opcional)<select name="alcance"><option value="">Sin confirmar</option><option>Solo un equipo o una toma</option><option>Toda mi vivienda</option><option>Varias viviendas de la comunidad</option><option>Toda la comunidad</option><option>Es una instalación nueva</option></select></label>';
 html=html.replace(textarea,symptoms+'<p class="wide service-request-help" id="service-request-help" role="status">Selecciona el servicio para ver qué información conviene facilitar.</p>'+textarea);
 return html;
}
export function improveLocalContent(html,p){
 if(!['town','district'].includes(p.type))return html;
 const place=nameOf(html),profile=localProfiles[p.url];
 for(const s of serviceBriefs)html=html.replace(section(html,s.id),()=>brief(s,place));
 // Do not invent geographical facts or claim that a fault is prevalent in a town.
 // Researched local facts remain sourced; the technical cases below are stable diagnostic scenarios, not local claims.
 if(profile){
  const old=html.match(/<section class="context-box">[\s\S]*?<\/section>/);assert(old,'Falta el contexto de '+p.url);
  html=html.replace(old[0],()=>profileBlock(profile,place,p.url));
 }else if(p.type==='town'){
  const old=html.match(/<section class="context-box">[\s\S]*?<\/section>/);assert(old,'Falta contexto municipal '+p.url);
  html=html.replace(old[0],()=>'<section class="context-box local-address-guide"><h2>Tu aviso en '+e(place)+'</h2><p>Selecciona el servicio y el tipo de inmueble. La consulta conserva tu municipio y el teléfono de la provincia; puedes añadir el barrio o núcleo antes de abrir WhatsApp.</p>'+practicalBlock(place,p.url)+'</section>');
 }else{
  const old=html.match(/<section class="context-box district-context">[\s\S]*?<\/section>/);assert(old,'Falta contexto distrital '+p.url);
  html=html.replace(old[0],()=>old[0]+practicalBlock(place,p.url));
 }
 html=enrichForm(html,p,profile);
 // These installation answers repeat the service blocks immediately above.
 // Keep the practical booking, availability and budget questions.
 if(p.type==='town')html=html.replace(/<details><summary>¿(?:Instaláis porteros automáticos|Puedo cambiar a videoportero) en [\s\S]*?<\/details>/g,'');
 // The application builds a message locally; these attributes do not send data.
 html=html.replace('<main id="contenido">','<main id="contenido" data-local-version="'+localVersion+'">');
 return html;
}
export function addServiceResources(html,p){
 if(p.url!=='/servicios/antenas/')return html;
 const resource='<section class="section wrap useful-resources" id="comprobar-recepcion"><span class="kicker">Antes de sustituir equipos</span><h2>Recursos para comprobar la recepción.</h2><div class="property-grid"><article><h3>Cobertura TDT</h3><p>Consulta la información oficial de televisión digital para tu localidad. La cobertura general no sustituye la medición en la antena y en las tomas de la vivienda.</p><a class="text-link" href="https://television.digital.gob.es/television-digital/tdt" target="_blank" rel="noopener noreferrer">Información oficial de TDT ↗</a></article><article><h3>Posibles interferencias 4G y 5G</h3><p>Si sospechas que los cortes comenzaron con un despliegue móvil, Llega700 permite comprobar si la dirección está afectada. Sus actuaciones para incidencias que entran en el programa son gratuitas y se solicitan a esa entidad.</p><a class="text-link" href="https://www.llega700.es/faq.php" target="_blank" rel="noopener noreferrer">Consultar el programa Llega700 ↗</a></article></div></section>';
 return html.replace(section(html,'contacto'),m=>resource+m);
}
