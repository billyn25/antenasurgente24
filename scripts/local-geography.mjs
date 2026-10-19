import data from '../config/local-geography.json' with {type:'json'};
import population from '../config/local-population.json' with {type:'json'};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const geography=data;
export const byRoute=new Map(Object.entries(data.municipalities).map(([code,m])=>[m.url,{...m,population:population.municipalities[code]}]));
export function municipalFacts(record){
 if(!Number.isInteger(record.population))throw Error('Falta población INE para '+record.url);
 return `<dl class="municipal-facts"><div><dt>Población municipal · ${population.year}</dt><dd>${record.population.toLocaleString('es-ES')} habitantes</dd></div><div><dt>Capital municipal</dt><dd>${esc(record.capital)}</dd></div></dl><p class="availability"><a href="${population.source_page}" target="_blank" rel="noopener noreferrer">INE · Censo anual de población ${population.year}, ambos sexos</a>. La cifra corresponde al conjunto del municipio.</p>`;
}
export function nearbySection(record){
 return `<section class="section wrap" id="municipios-proximos"><span class="kicker">Comprueba tu municipio</span><h2>Localidades próximas a ${esc(record.name)}</h2><p>Si la instalación está en otro municipio, abre su ficha para preparar el aviso con la localidad y el contacto correspondientes.</p><ul class="town-grid">${record.nearby.map(([code,km])=>{const m=data.municipalities[code];return `<li><a href="${m.url}">${esc(m.name)} <small>· ${km.toLocaleString('es-ES')} km en línea recta</small></a></li>`;}).join('')}</ul><p class="availability">Referencias aproximadas del IGN entre los municipios incluidos en el directorio. No son distancias por carretera ni tiempos de llegada. <a href="${data.source_page}" target="_blank" rel="noopener noreferrer">Fuente geográfica y capital municipal: IGN</a> · ${esc(data.credit)}.</p></section>`;
}
export function addLocalGeography(html,p){
 if(p.type!=='town')return html;
 const record=byRoute.get(p.url);if(!record)throw Error('Falta geografía municipal: '+p.url);
 const alphabetical=/<section class="section wrap"><span class="kicker">Directorio de [\s\S]*?<\/section>/;
 if(!alphabetical.test(html))throw Error('Directorio local no reconocido: '+p.url);
 html=html.replace(alphabetical,()=>nearbySection(record).replace('<ul class="town-grid">',municipalFacts(record)+'<ul class="town-grid">'));
 if(record.capital.localeCompare(record.name,'es',{sensitivity:'base'})!==0){
  const anchor='<label class="wide local-address-field">';
  html=html.replace(anchor,`<p class="wide local-capital">El IGN identifica <strong>${esc(record.capital)}</strong> como capital municipal de ${esc(record.name)}. Si tu dirección está en otro núcleo del término, escríbelo junto con la calle y el número.</p>`+anchor);
 }
 return html;
}
