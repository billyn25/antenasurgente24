'use strict';
// Informational panel: no consent is requested when no optional cookies exist.
// Does not write cookies, localStorage or sessionStorage.
(()=>{
 const panel=document.getElementById('privacy-panel');if(!panel||typeof panel.showModal!=='function')return;
 let opener;
 document.querySelectorAll('[data-privacy-open]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();opener=a;if(!panel.open)panel.showModal();}));
 panel.querySelectorAll('[data-privacy-close]').forEach(b=>b.addEventListener('click',()=>panel.close()));
 panel.addEventListener('click',e=>{if(e.target===panel){const r=panel.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)panel.close();}});
 panel.addEventListener('close',()=>opener?.focus({preventScroll:true}));
})();
