# Contenido local y fotografías antes de conectar el dominio

No se modifican `config/site.json`, `launchReady`, dominio, teléfonos, rutas ni sitemaps. Se mantienen 4.035 municipios, 21 distritos y cinco servicios, así como la prioridad de Zona Norte y Castilla y León, las estrellas y el mapa.

## Mejora general
Las 4.056 fichas locales conservan cada servicio y sus fotografías. Los desarrollos compartidos se concentran en las guías de servicios: las fichas muestran el alcance, qué información preparar y un acceso que preselecciona el servicio en el formulario sin enviar mensajes. Un campo opcional permite añadir barrio, pedanía o localidad y se incluye al preparar WhatsApp; se limpia al cambiar de municipio o provincia para no arrastrar una dirección ajena.

## Contexto comprobado
Diez municipios tienen un bloque específico documentado: Zalla, Lerma, Astorga, Puebla de Sanabria, Arenas de San Pedro, Cuéllar, Aguilar de Campoo, Almazán, Ciudad Rodrigo y Reinosa. Las referencias se usan para identificar direcciones y diferenciar municipio de núcleo, no para inventar trabajos o afirmar una disponibilidad. Las fuentes y la fecha de revisión están en `config/local-contexts.json` y son accesibles en cada ficha. Son diez perfiles investigados; no se declara que los 4.035 municipios tengan contenido exclusivo.

En los 21 distritos madrileños, los barrios contrastados en `config/madrid-districts.mjs` se ofrecen como sugerencias en el formulario. No se crean nuevas páginas por cada variante del nombre ni se incorporan barrios como municipios distintos.

## Imágenes
Se generan variantes WebP de las seis fotografías compartidas durante el build, con `sharp` fijado a una versión concreta. Se conservan originales como fallback y las rutas anteriores. `srcset` y `sizes` permiten seleccionar la imagen adecuada. Las variantes llevan huella de contenido y caché inmutable, los originales no se cachean de forma indefinida. No se crean miles de copias por pueblo.

## Pruebas
`npm run check` conserva las auditorías previas y comprueba la salida final. Los tests de navegador añaden cinco anchos, fotos WebP, selección de servicio, barrio en el mensaje y cambio correcto de teléfono. El mensaje se intercepta en las pruebas y no se envía. El test de despliegue verifica también el bloque de Lerma publicado y las nuevas imágenes.

La comparación de similitud se mantiene con la misma metodología de cinco palabras. La cifra no es una puntuación de Google ni un umbral de seguridad. Estos cambios mejoran utilidad y carga; no certifican que todas las fichas deban indexarse ni sustituyen pruebas reales de trabajos locales.

Referencias de criterio: https://developers.google.com/search/docs/essentials/spam-policies y https://developers.google.com/search/docs/fundamentals/creating-helpful-content. Imágenes: https://web.dev/learn/images/responsive-images.
