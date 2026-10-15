# Antenista Urgente 24 Horas

Proyecto nuevo: `billyn25/antenasurgente24`. No modifica Antenas Rapid ni Antenista Cerca.

## Enfoque aprobado

Eslogan literal: **Profesional en antenas cerca de tu localidad**.

Servicios de instalación nueva, reparación y renovación para **viviendas y comunidades de propietarios**. Se destaca en portada, fichas de servicio, provincias y municipios; el formulario permite seleccionar ambos tipos de instalación. Se retira el bloque secundario de negocios.

Antenas TDT, parabólicas, porteros automáticos y videoporteros conservan su contenido. Se añade un bloque visible de amplificación: instalación nueva, previos, fuentes de alimentación, reparación de amplificadores y sistemas monocanal para comunidades, con fotografía de catálogo Televés. Está presente en portada, el servicio de antenas y cada municipio. Cada ficha municipal incorpora además una fotografía de antena Televés DAT BOSS. Ver `docs/fotografias-amplificacion.md`.

## Comprobación y publicación

Node 22 o superior, sin dependencias npm de producción. `npm run check` ejecuta pruebas, generación HTML, composición editorial, enfoque residencial y auditoría. La última fase comprueba las 4.063 páginas, 4.035 municipios y 20 provincias: enlaces, anclas, IDs, títulos, descripciones, teléfonos, WhatsApp, fotos, eslogan, JSON-LD, canonicals y sitemaps.

La portada tiene cinco fotografías distintas, sin recuperar la foto rechazada `hero-obra.webp`. Se mantiene azul/antracita/blanco, con WhatsApp verde. Las cinco estrellas son compromisos de servicio, no reseñas ni puntuaciones de clientes.

Los módulos de presentación se ejecutan en el build, no en el navegador. Si no reconocen una plantilla, cancelan la publicación. Las nuevas fotos se validan y se sirven desde `dist/assets`, no mediante peticiones externas del visitante. Se priorizan copias locales de `src/media` cuando existen.

## Contactos y SEO

Norte: 641 589 394. Madrid, Guadalajara, Toledo y Cuenca: 614 789 945. Se mantienen rutas, tres servicios locales por municipio, sitemaps provinciales y HTML navegable sin JavaScript. El formulario envía también el tipo de inmueble y la consulta de amplificación al teléfono de la provincia.

`dist/build-report.json` recoge el modo de publicación, recuentos y comprobaciones de imágenes. El nombre de un pueblo no convierte una foto de catálogo en un trabajo local. No se inventan sedes, casos realizados, reseñas ni disponibilidad inmediata.

Se conserva `launchReady: false`: esta actualización no cambia dominio, indexación ni datos legales. Antes del lanzamiento deben confirmarse titular/dominio, completarse la información legal y activarse la configuración de producción. Los previews continúan en `noindex,follow`. La cantidad de URLs no garantiza indexación ni posiciones.
