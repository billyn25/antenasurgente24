# Diez servicios visibles — 21 de octubre de 2026

## Problema corregido

La versión `398bca9b5f87636ec75bd3daa46a08241d995677` incorporó las cinco especialidades nuevas a las consultas y a dos casos seleccionados por ficha. La portada, el índice local, el contador y los enlaces del pie todavía presentaban únicamente los servicios anteriores. El formulario de portada tampoco permitía elegir las cinco especialidades.

## Presentación

- Portada: diez tarjetas numeradas. Las cinco nuevas tienen un título explícito, una frase breve y una acción que selecciona su servicio en el formulario.
- Municipios y distritos: un índice visible «Los 10 servicios», con los cinco bloques principales y cinco accesos directos a consulta. Se conservan los dos casos complementarios seleccionados en cada ficha.
- Formularios: las cinco especialidades y las opciones local, bar y hotel están disponibles en todas las páginas con formulario, sin duplicar las opciones locales existentes.
- Pie: diez enlaces de servicios y contador actualizado a diez. Se conserva el acceso al directorio municipal.
- Datos estructurados: catálogo de portada y tipos de servicio locales coherentes con los diez servicios visibles.

Las especialidades son COFDM para bares y hoteles; acceso con teclado o llavero; resintonización TDT y comprobación UHD; soportes de televisión; y kits de aviso para aseos accesibles.

Los textos breves de portada proceden del alcance ya documentado en `scripts/local-specialty-copy.mjs`: la compatibilidad de Movistar u otras fuentes HD se comprueba, y la resintonización no implica prometer compatibilidad UHD de cualquier receptor.

## Extensión y comparación anterior

No se añaden los cinco párrafos de portada a cada municipio. El cambio local es un índice de nombres y acciones; permanecen los párrafos técnicos, los casos y las preguntas de la revisión anterior.

Se compararon los hashes del texto editorial normalizado de los mismos **3.291 municipios** de `docs/comparacion-pueblos-20261021.json`: **3.291 iguales; 0 modificados**. Por tanto, se mantiene el resultado de aquella comparación para ese texto y esa muestra. La navegación, los formularios y el pie quedan excluidos de esa métrica; sí crece su listado común de servicios. No es un porcentaje calculado por Google ni una garantía de posicionamiento.

## Comprobaciones

- Compilación y auditorías de las 4.085 páginas, incluidos 4.035 municipios y 21 distritos: diez servicios visibles, anclas válidas, opciones sin duplicados y contactos conservados.
- Catálogo y botones revisados en navegador a 320, 390, 430, 768 y 1.440 píxeles. Las cinco imágenes locales siguen centradas.
- Cinco selecciones nuevas verificadas en portada y en cada una de cinco fichas. Los mensajes de prueba se interceptan; no se envían consultas.
- Catálogo local legible sin JavaScript; comportamiento previo del formulario y la privacidad conservado.
- Indexación: 4.081 URLs de sitemap, dominio de producción correcto y sin cambios de rutas.

La transformación se aplica en `closure`, después de Starlink. Los controles intermedios de tres, cuatro y cinco servicios siguen comprobando sus fases; los controles del resultado final exigen diez.
