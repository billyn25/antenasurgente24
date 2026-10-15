'use strict';
(()=>{
 const form=document.getElementById('whatsapp-aviso');if(!form)return;
 const service=form.elements.servicio,help=document.getElementById('service-request-help'),nucleus=form.elements.nucleo;
 const hints=()=>{
  if(!help)return;
  const value=service.value.toLowerCase();
  help.textContent=value.includes('starlink')?'Indica el modelo del kit, el lugar de montaje y dónde necesitas Wi-Fi.':value.includes('amplifica')||value.includes('monocanal')||value.includes('fuentes')?'Indica qué canales fallan, cuántas viviendas están afectadas y si necesitas instalación nueva o reparación.':value.includes('videoportero')?'Indica marca, número de monitores y si fallan imagen, sonido, llamada o apertura.':value.includes('portero')?'Indica marca, número de viviendas y si falla llamada, audio o apertura.':value.includes('antena')?'Indica si fallan todos los canales, cuántos televisores están afectados o cuántas tomas quieres instalar.':'Selecciona el servicio para ver qué información conviene facilitar.';
 };
 service.addEventListener('change',hints);hints();
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
