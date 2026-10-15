/** Footer-only contact panel, derived from the existing regional configuration. */
import assert from 'node:assert/strict';
import {contactForProvince} from './contacts.mjs';
export const footerContactsVersion='telefonos-pie-v1';
const central=contactForProvince('madrid'),north=contactForProvince('bizkaia');
const centralDisplay=central.whatsapp.slice(2).replace(/(\d{3})(\d{2})(\d{2})(\d{2})/,'$1 $2 $3 $4');
export const footerContacts=[
 {key:'centro',label:'Madrid, Guadalajara, Toledo y Cuenca',...central,display:centralDisplay},
 {key:'norte',label:'Zona norte y Castilla y León',...north,display:north.phone}
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function footerContactsHtml(){
 return `<section class="wrap footer-contact-zones" id="telefonos-pie" data-footer-contacts="${footerContactsVersion}" aria-labelledby="footer-contact-title"><h2 id="footer-contact-title">Teléfonos por zona</h2><div class="footer-contact-grid">${footerContacts.map(c=>`<div class="footer-contact-card" data-footer-zone="${c.key}"><h3>${esc(c.label)}</h3><a class="footer-contact-number" href="tel:${c.tel}" aria-label="Llamar a ${esc(c.label)}: ${esc(c.display)}">${esc(c.display)}</a><a class="btn btn-green footer-contact-whatsapp" href="https://wa.me/${c.whatsapp}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp para ${esc(c.label)}">WhatsApp ↗</a></div>`).join('')}</div></section>`;
}
export function verifyFooterContacts(html,label='Página'){
 const footers=[...html.matchAll(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi)];
 assert.equal(footers.length,1,label+': debe existir un único pie');
 const footer=footers[0][0];
 assert.equal((html.match(/id="telefonos-pie"/g)||[]).length,1,label+': panel duplicado o ausente');
 assert(footer.includes(footerContactsHtml()),label+': números, etiquetas o enlaces de pie incorrectos');
 assert.equal((footer.match(/href="tel:/g)||[]).length,2,label+': número de llamadas del pie');
 assert.equal((footer.match(/href="https:\/\/wa.me\//g)||[]).length,2,label+': número de WhatsApp del pie');
 return {phoneLinks:2,whatsappLinks:2};
}
export function addFooterContacts(html){
 if(html.includes('data-footer-contacts=')){verifyFooterContacts(html);return html;}
 const opening='<footer class="footer">';
 assert.equal(html.split(opening).length,2,'No se reconoce un único pie de página');
 const panel=footerContactsHtml(),result=html.replace(opening,opening+panel);
 assert.equal(result.replace(panel,''),html,'El cambio debe limitarse al panel del pie');
 verifyFooterContacts(result);return result;
}
export const footerContactStyles=`
/* Regional numbers remain visible in the footer without JavaScript. */
.footer .footer-contact-zones{padding:0 0 36px;margin-bottom:36px;border-bottom:1px solid #40536d}
.footer .footer-contact-zones h2{font-size:1.35rem;line-height:1.3;letter-spacing:-.02em;margin:0 0 20px;color:#fff}
.footer .footer-contact-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
.footer .footer-contact-card{display:flex;flex-direction:column;align-items:flex-start;gap:10px;min-width:0;padding:22px 24px;border:1px solid #637c9e;border-radius:12px;background:#1c3454}
.footer .footer-contact-card h3{color:#e5eeff;font-size:.95rem;line-height:1.5;font-weight:650;letter-spacing:0;margin:0;min-height:2.85rem}
.footer .footer-contact-number{display:inline-flex;align-items:center;min-height:48px;color:#fff;font-size:2rem;font-weight:800;line-height:1.2;letter-spacing:-.035em;white-space:nowrap;padding:0;margin:0}
.footer .footer-contact-whatsapp{margin-top:4px;min-height:46px;background:#087f48;color:#fff}
.footer .footer-contact-zones a:focus-visible{outline:3px solid #ffda63;outline-offset:4px}
@media(max-width:760px){.footer .footer-contact-grid{grid-template-columns:minmax(0,1fr);gap:14px}.footer .footer-contact-card{padding:20px}.footer .footer-contact-card h3{min-height:0}.footer .footer-contact-number{font-size:1.85rem}.footer .footer-contact-zones{padding-bottom:28px;margin-bottom:28px}}
`;
