'use strict';
const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const search=document.querySelector('[data-town-filter]');
if(search){
 const rows=[...document.querySelectorAll('[data-town]')],count=document.getElementById('filter-status');
 search.addEventListener('input',()=>{
  const q=norm(search.value.trim());let visible=0;
  for(const row of rows){row.hidden=!norm(row.dataset.town).includes(q);if(!row.hidden)visible++;}
  for(const group of document.querySelectorAll('.town-group'))group.hidden=![...group.querySelectorAll('[data-town]')].some(row=>!row.hidden);
  count.textContent=visible?`${visible} municipios encontrados`:'No hay coincidencias. Prueba con parte del nombre.';
 });
}
const form=document.getElementById('whatsapp-aviso');
if(form){
 const status=document.getElementById('whatsapp-status'),province=form.elements.provincia,district=form.elements.distrito;
 const syncDistrict=()=>{if(!district)return;const active=province.value==='madrid'&&norm(form.elements.municipio.value.trim())==='madrid';district.disabled=!active;district.closest('label').hidden=!active;};
 const update=()=>{const option=province.selectedOptions[0];status.textContent=option?.dataset.phone?`Tu consulta se preparará para ${option.dataset.phone}. Tú decides cuándo enviarla.`:'Selecciona la provincia para usar el teléfono correcto.';syncDistrict();};
 province.addEventListener('change',update);form.elements.municipio.addEventListener('input',syncDistrict);update();
 form.addEventListener('submit',event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const option=province.selectedOptions[0],number=option?.dataset.whatsapp;
  if(!/^34[6789]\d{8}$/.test(number||'')){status.textContent='Selecciona una provincia válida o utiliza el teléfono de contacto.';return;}
  const data=new FormData(form);
  const message=['Hola, necesito información sobre '+data.get('servicio')+'.',data.get('inmueble')?'Tipo de instalación: '+data.get('inmueble')+'.':'','Municipio: '+String(data.get('municipio')).trim()+'.',data.get('distrito')?'Distrito: '+String(data.get('distrito')).trim()+'.':'','Provincia: '+option.textContent+'.',data.get('nucleo')?'Barrio o localidad: '+String(data.get('nucleo')).trim()+'.':'','Consulta: '+String(data.get('averia')).trim(),data.get('telefono')?'Mi teléfono: '+String(data.get('telefono')).trim():''].filter(Boolean).join('\n');
  const url='https://wa.me/'+number+'?text='+encodeURIComponent(message);
  const link=document.createElement('a');link.href=url;link.textContent='Abrir de nuevo la consulta en WhatsApp';link.target='_blank';link.rel='noopener noreferrer';
  status.replaceChildren(document.createTextNode('Mensaje preparado. '),link);window.open(url,'_blank','noopener,noreferrer');
 });
}
