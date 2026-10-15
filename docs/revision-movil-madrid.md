# Portada móvil, provincias y distritos de Madrid

La revisión conserva las 4.035 fichas municipales y añade 21 fichas de distrito de Madrid capital. No cuenta distritos como municipios. La provincia conserva 179 municipios. El total previsto pasa a 4.084 páginas y 4.080 URLs en los sitemaps.

Los nombres de distritos y los 131 barrios que los identifican se contrastaron con el índice HTML de Mapas de Distritos y Barrios del Ayuntamiento de Madrid. Fuente y tabla están en config/madrid-districts.mjs. Los barrios se usan como contexto y términos de búsqueda; no generan 131 páginas nuevas ni prueban una presencia comercial física.

Rutas nuevas: /provincias/madrid/madrid/<distrito>/. Enlazadas desde la portada, la provincia y la ficha de Madrid capital. Sitemap: sitemaps/madrid.xml. Cada distrito mantiene la foto de antena Televés y el bloque de amplificación con foto, los tres servicios, el enfoque residencial y el teléfono 614 789 945. El formulario diferencia municipio Madrid y distrito. Si se cambia de provincia o municipio, deja de enviar el distrito anterior.

Portada: eslogan literal Profesional en antenas cerca de tu localidad; foto real de catálogo Televés dentro de la cabecera, textos más breves, dos teléfonos visibles y barra inferior compacta. Amplificación permanece inmediatamente debajo de Videoporteros y antes del bloque viviendas/comunidades. No vuelve la foto rechazada ni la paleta amarilla.

Provincias: enlaces descriptivos Antenista en Madrid, Antenista en Burgos, etc. Se elimina la selección fija de ocho pueblos, que podía parecer el listado completo. El buscador consulta los 4.035 municipios y 21 distritos; las provincias siguen enlazando sus directorios completos sin requerir JavaScript. Los 21 distritos están también en enlaces HTML estáticos. Nunca se etiqueta una selección alfabética como proximidad geográfica.

Pipeline: las pruebas y la auditoría anterior validan la base; la nueva auditoría valida de nuevo toda la salida final, incluidas rutas, anclas entre documentos, canonicals, JSON-LD, teléfonos, fotografías y sitemaps. GitHub Actions añade pruebas de navegador a 320, 390, 430, 768 y 1440 píxeles. Las capturas y métricas se guardan como artefactos. El paquete de navegador solo se instala de forma temporal en CI, no en el despliegue Netlify.

No se cambian dominio, launchReady ni noindex. Publicar la revisión no equivale a habilitar la indexación ni garantiza posiciones de búsqueda.
