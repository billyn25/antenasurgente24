'use strict';
(()=>{
 const form=document.getElementById('whatsapp-aviso');if(!form)return;
 const service=form.elements.servicio,help=document.getElementById('service-request-help'),nucleus=form.elements.nucleo;
 const symptom=form.elements.sintoma,scope=form.elements.alcance,property=form.elements.inmueble;
 const hints=()=>{
  if(!help)return;
  const value=service.value.toLowerCase();
  let advice=value.includes('cofdm')?'Indica el modelo del receptor Movistar u otra fuente HD, el número de pantallas y si deben mostrar el mismo programa.':value.includes('control de acceso')?'Indica cuántas puertas y usuarios habrá, y si prefieres teclado, llaveros o ambos.':value.includes('uhd')||value.includes('resintonizaci')?'Indica el modelo del televisor o receptor y qué canales faltan. Aclara si ocurre también en otros equipos.':value.includes('soporte de tv')?'Indica modelo y tamaño del televisor, tipo de pared y si ya tienes el soporte.':value.includes('aseo accesible')?'Indica dónde está el aseo, dónde debe recibirse el aviso y quién podrá atenderlo.':value.includes('starlink')?'Indica el modelo del kit, el lugar de montaje y dónde necesitas Wi-Fi.':value.includes('amplifica')||value.includes('monocanal')||value.includes('fuentes')?'Indica qué canales fallan, cuántas viviendas están afectadas y si necesitas instalación nueva o reparación.':value.includes('videoportero')?'Indica marca, número de monitores y si fallan imagen, sonido, llamada o apertura.':value.includes('portero')?'Indica marca, número de viviendas y si falla llamada, audio o apertura.':value.includes('antena')?'Indica si fallan todos los canales, cuántos televisores están afectados o cuántas tomas quieres instalar.':'Selecciona el servicio para ver qué información conviene facilitar.';
  const observations={
   'Sin señal en todos los canales':'Anota el mensaje exacto de la pantalla y si otros televisores tienen señal. No restablezcas ni resintonices todos los equipos antes de comprobar si el fallo es compartido.',
   'Pixelación o faltan algunos canales':'Apunta dos o tres canales afectados y cuándo se producen los cortes. Indica si en otra toma ocurre lo mismo; estos datos no bastan para atribuirlo a la antena.',
   'Una toma funciona y otra no':'Identifica la habitación y el televisor que sí funcionan. No desmontes la toma: la revisión debe distinguir equipo, conexión y distribución.',
   'No suena la llamada':'Aclara si no llama desde la calle, desde el rellano o desde ambos puntos, y si a otros vecinos sí les funciona.',
   'No se oye o solo se oye en un sentido':'Indica quién no oye a quién: desde la vivienda a la calle o desde la calle a la vivienda. No abras la placa para preparar el aviso.',
   'No abre la puerta':'Aclara si falla el botón de apertura aunque llamada y audio funcionen, y si el problema afecta a más vecinos. No fuerces la puerta ni manipules el abrepuertas.',
   'Videoportero sin imagen':'Indica si la pantalla está apagada, muestra negro o enciende sin vídeo. Aclara si llamada, conversación y apertura siguen funcionando.',
   'Montaje de un kit Starlink nuevo':'Prepara el modelo del kit, una foto del lugar previsto y el recorrido deseado del cable. La ubicación se comprueba con la aplicación; no subas a la cubierta para hacer fotos.',
   'Reubicación de una antena Starlink':'Explica qué cambia de ubicación y si se conservará el cable. Facilita el modelo del kit para comprobar soporte y accesorios compatibles.',
   'Instalación nueva o renovación':'Indica los equipos actuales y cuántas tomas, viviendas o monitores debe atender el montaje. Una foto exterior ayuda a estudiar la compatibilidad.'
  };
  if(observations[symptom?.value])advice=observations[symptom.value];
  if(/comunidad|varias viviendas/i.test(scope?.value||''))advice+=' Para equipos comunes, indica quién puede autorizar la intervención y facilitar acceso a los cuartos o zonas comunes.';
  else if(/individual|unifamiliar|particular/i.test(property?.value||''))advice+=' En vivienda individual, concreta las plantas, los equipos y el punto de acceso previsto.';
  help.textContent=advice;
 };
 service.addEventListener('change',()=>{if(symptom)symptom.value='';hints();});hints();
 [symptom,scope,property].filter(Boolean).forEach(field=>field.addEventListener('change',hints));
 document.querySelectorAll('[data-request-service]').forEach(a=>a.addEventListener('click',()=>{
  const option=[...service.options].find(o=>o.value===a.dataset.requestService);if(!option)return;
  service.value=option.value;service.dispatchEvent(new Event('change',{bubbles:true}));
  // Ordinary anchor navigation remains functional without JavaScript.
 }));
 if(nucleus){
  const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const clear=()=>{
   if(form.elements.provincia.value!==nucleus.dataset.localProvince||normalize(form.elements.municipio.value)!==nucleus.dataset.localLocation){nucleus.value='';nucleus.removeAttribute('list');}
  };
  form.elements.provincia.addEventListener('change',clear);form.elements.municipio.addEventListener('input',clear);
 }
})();
