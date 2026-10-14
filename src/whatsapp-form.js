document.addEventListener('DOMContentLoaded',()=>{
 const form=document.querySelector('#whatsapp-aviso');if(!form)return;
 const status=document.querySelector('#whatsapp-status');
 form.addEventListener('submit',e=>{
  e.preventDefault();
  const data=new FormData(form);
  const province=String(data.get('provincia')||'');
  const town=String(data.get('municipio')||'').trim();
  const issue=String(data.get('averia')||'').trim();
  const contact=String(data.get('telefono')||'').trim();
  if(!province||!town||!issue){status.textContent='Completa provincia, municipio y avería.';return;}
  const central=['madrid','guadalajara','toledo','cuenca'].includes(province);
  const phone=central?'34614789945':'34641589394';
  const msg=['Hola, necesito asistencia técnica.','Servicio: '+data.get('servicio'),'Provincia: '+province,'Municipio: '+town,'Avería o instalación: '+issue,contact?'Mi teléfono: '+contact:''].filter(Boolean).join('\n');
  status.textContent='Se abrirá WhatsApp con tu mensaje preparado.';
  window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(msg),'_blank','noopener,noreferrer');
 });
});
