'use strict';
// Progressive enhancement: all municipalities and districts remain linked in HTML.
const normal=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
let pendingIndex;
function loadIndex(){if(!pendingIndex)pendingIndex=fetch('/assets/location-index.json').then(r=>{if(!r.ok)throw Error('Directorio no disponible');return r.json();}).catch(e=>{pendingIndex=null;throw e;});return pendingIndex;}
for(const finder of document.querySelectorAll('[data-location-finder]')){
 const query=finder.querySelector('[name="localidad"]'),province=finder.querySelector('[name="zona"]'),status=finder.querySelector('[role="status"]'),results=finder.querySelector('.finder-results'),browse=finder.querySelector('[data-browse-province]');
 let sequence=0,timer;
 async function render(){
  const request=++sequence,q=normal(query.value).replace(/^antenista en /,'');
  browse.href=province.value?'/provincias/'+province.value+'/':'/#provincias';
  browse.textContent=province.value?'Ver todo el directorio de '+province.selectedOptions[0].textContent+' ↗':'Ver todas las provincias ↓';
  results.replaceChildren();results.hidden=true;
  if(q.length<2){status.textContent='Escribe al menos dos letras. El listado completo está organizado por provincias.';return;}
  status.textContent='Buscando en el directorio completo…';
  try{
   const index=await loadIndex();if(request!==sequence)return;
   const words=q.split(/\s+/),matches=index.filter(x=>(!province.value||x.province===province.value)&&words.every(w=>normal(x.name+' '+x.provinceName+' '+(x.barrios||[]).join(' ')).includes(w)));
   matches.sort((a,b)=>Number(normal(b.name)===q)-Number(normal(a.name)===q)||Number(normal(b.name).startsWith(q))-Number(normal(a.name).startsWith(q))||a.name.localeCompare(b.name,'es'));
   const visible=matches.slice(0,20);
   status.textContent=matches.length?`${matches.length} resultados.${matches.length>20?' Se muestran 20; escribe más letras o elige una provincia para concretar.':''}`:'No hay coincidencias. Prueba con parte del nombre o revisa la provincia.';
   for(const item of visible){
    const li=document.createElement('li'),a=document.createElement('a'),title=document.createElement('strong'),note=document.createElement('small');
    if(!/^\/provincias\/[a-z0-9/-]+\/$/.test(item.url))continue;
    a.href=item.url;title.textContent='Antenista en '+item.name;note.textContent=item.type==='district'?'Distrito de Madrid capital':'Municipio · '+item.provinceName;
    a.append(title,note);li.append(a);results.append(li);
   }
   results.hidden=!visible.length;
  }catch{if(request===sequence)status.textContent='El buscador no ha podido cargar. Puedes entrar en tu provincia y consultar el directorio completo.';}
 }
 query.addEventListener('input',()=>{sequence++;clearTimeout(timer);timer=setTimeout(render,150);});province.addEventListener('change',render);
}
