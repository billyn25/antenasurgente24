import site from '../config/site.json' with {type:'json'};

const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const digits=s=>String(s||'').replace(/\D/g,'');
export const centralProvinces=new Set(site.centralProvinces.map(normalize));
export function contactForProvince(provinceSlug){
 const central=centralProvinces.has(normalize(provinceSlug));
 const phone=central?site.centralPhone:site.primaryPhone;
 if(!phone)throw new Error('Teléfono no configurado para '+provinceSlug);
 const number=digits(phone);
 if(!/^[6789]\d{8}$/.test(number))throw new Error('Teléfono español inválido en '+provinceSlug);
 return {phone,tel:'+34'+number,whatsapp:'34'+number,zone:central?'centro':'resto'};
}
export function contactsForHome(){
 return [
  {label:'Madrid, Guadalajara, Toledo y Cuenca',...contactForProvince('madrid')},
  {label:'Zona Norte y otras provincias de cobertura',...contactForProvince('bizkaia')}
 ];
}
