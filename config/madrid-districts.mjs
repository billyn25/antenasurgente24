// División administrativa: Ayuntamiento de Madrid. Comprobada el 15-10-2026.
// Los barrios identifican el distrito; no se generan páginas adicionales de barrio.
export const source='https://www.madrid.es/portales/munimadrid/es/Inicio/El-Ayuntamiento/Estadistica/Areas-de-informacion-estadistica/Territorio-y-medio-ambiente/Territorio/Mapas-de-Distritos-y-Barrios/?vgnextchannel=e59b40ebd232a210VgnVCM1000000b205a0aRCRD&vgnextoid=240d64c49579f410VgnVCM1000000b205a0aRCRD';
const rows=[
 ['Centro','Palacio|Embajadores|Cortes|Justicia|Universidad|Sol'],
 ['Arganzuela','Imperial|Acacias|Chopera|Legazpi|Delicias|Palos de la Frontera|Atocha'],
 ['Retiro','Pacífico|Adelfas|Estrella|Ibiza|Los Jerónimos|Niño Jesús'],
 ['Salamanca','Recoletos|Goya|Fuente del Berro|Guindalera|Lista|Castellana'],
 ['Chamartín','El Viso|Prosperidad|Ciudad Jardín|Hispanoamérica|Nueva España|Castilla'],
 ['Tetuán','Bellas Vistas|Cuatro Caminos|Castillejos|Almenara|Valdeacederas|Berruguete'],
 ['Chamberí','Gaztambide|Arapiles|Trafalgar|Almagro|Ríos Rosas|Vallehermoso'],
 ['Fuencarral-El Pardo','El Pardo|Fuentelarreina|Peñagrande|Pilar|La Paz|Valverde|Mirasierra|El Goloso'],
 ['Moncloa-Aravaca','Casa de Campo|Argüelles|Ciudad Universitaria|Valdezarza|Valdemarín|El Plantío|Aravaca'],
 ['Latina','Los Cármenes|Puerta del Ángel|Lucero|Aluche|Campamento|Cuatro Vientos|Águilas'],
 ['Carabanchel','Comillas|Opañel|San Isidro|Vista Alegre|Puerta Bonita|Buenavista|Abrantes'],
 ['Usera','Orcasitas|Orcasur|San Fermín|Almendrales|Moscardó|Zofio|Pradolongo'],
 ['Puente de Vallecas','Entrevías|San Diego|Palomeras Bajas|Palomeras Sureste|Portazgo|Numancia'],
 ['Moratalaz','Pavones|Horcajo|Marroquina|Media Legua|Fontarrón|Vinateros'],
 ['Ciudad Lineal','Ventas|Pueblo Nuevo|Quintana|La Concepción|San Pascual|San Juan Bautista|Colina|Atalaya|Costillares'],
 ['Hortaleza','Palomas|Piovera|Canillas|Pinar del Rey|Apóstol Santiago|Valdefuentes'],
 ['Villaverde','Villaverde Alto - Casco Histórico de Villaverde|San Cristóbal|Butarque|Los Rosales|Ángeles'],
 ['Villa de Vallecas','Casco Histórico de Vallecas|Santa Eugenia|Ensanche de Vallecas'],
 ['Vicálvaro','Casco Histórico de Vicálvaro|Valdebernardo|Valderrivas|El Cañaveral'],
 ['San Blas-Canillejas','Simancas|Hellín|Amposta|Arcos|Rosas|Rejas|Canillejas|El Salvador'],
 ['Barajas','Alameda de Osuna|Aeropuerto|Casco Histórico de Barajas|Timón|Corralejos']
];
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const districts=rows.map(([name,barrios],i)=>({code:String(i+1).padStart(2,'0'),name,slug:slug(name),barrios:barrios.split('|'),url:'/provincias/madrid/madrid/'+slug(name)+'/'}));
