# Servicios equilibrados y mapa en el pie

Revisión de `antenasurgente24`, sin cambios en las otras webs.

La portada muestra cuatro tarjetas equivalentes: antenas TDT/parabólicas, porteros automáticos, videoporteros y amplificación. Se elimina el bloque grande de amplificación de la portada, pero no su detalle técnico en `/servicios/antenas/#amplificacion`, municipios ni distritos. La cuarta tarjeta conserva foto, descripción y acceso al servicio.

El pie compartido incorpora una silueta vectorial local de España con puntos representativos de las 20 provincias del directorio. No son oficinas ni radios de cobertura. Las cifras se calculan desde el informe de generación y la asociación provincial: 4 servicios técnicos, 8 comunidades autónomas, 20 provincias y 4.035 municipios; se mantienen los 21 distritos de Madrid. Comunidades autónomas es una magnitud geográfica, no un número de comunidades de propietarios atendidas. No se inventan trabajos, clientes ni instalaciones.

El SVG se genera localmente durante el build y se sirve como un solo recurso cacheable; no añade mapas externos, seguimiento, API ni dependencias de producción. Los enlaces a las provincias también están disponibles como texto accesible.

## Datos cartográficos y atribución

Contorno peninsular simplificado: Natural Earth, dataset `naturalearth_lowres` incluido en las fixtures de Pyogrio. Natural Earth es de dominio público: https://www.naturalearthdata.com/about/terms-of-use/ .

Contornos insulares simplificados: GSHHG, Paul Wessel y Walter H. F. Smith, distribuido en Basemap. Datos bajo GNU LGPL v3 o posterior: https://www.soest.hawaii.edu/wessel/gshhg/ ; texto de licencia: https://www.gnu.org/licenses/lgpl-3.0.html . El subconjunto y su forma modificable se conservan en `config/spain-outline.json` (campo `islands`, LGPL-3.0-or-later). Se ha aplicado simplificación geométrica y redondeo para esta silueta orientativa. Ceuta/Melilla son referencias puntuales; Canarias aparece en recuadro, no en su posición relativa a la península. No es un mapa de precisión.

Relación administrativa de provincias y comunidades: INE, https://www.ine.es/daco/daco42/codmun/cod_num_muni_provincia_ccaa.htm . Los puntos provinciales son representativos y las comunidades se cuentan a partir de las provincias existentes, sin indicar cobertura integral de una autonomía cuando solo parte está en el directorio.

La revisión conserva todas las URLs, títulos, metadatos, sitemaps, contactos, fotos municipales, estrellas de compromiso, el eslogan aprobado y el estado `noindex` anterior. La auditoría final recorre todas las páginas después de aplicar estos cambios y vuelve a comprobar enlaces, anclas, contadores y mapa.
