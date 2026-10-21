# Servicios breves y reducción de repetición en las fichas locales

## Cambio realizado

Las 4.035 fichas municipales y los 21 distritos conservan los cinco servicios principales. Sus explicaciones pasan de un texto común por servicio a ocho escenarios concretos por servicio: diagnóstico, ampliación, compatibilidad o condiciones de montaje. La selección es estable por URL y no cambia al reconstruir la web.

Las tres tarjetas existentes se aprovechan para mostrar dos servicios complementarios y un caso técnico. Las cinco especialidades nuevas son:

- Modulación COFDM para bares y hoteles, con receptores Movistar u otras fuentes HD cuando sean compatibles.
- Control de acceso para comunidades mediante teclado, código o llaveros de proximidad.
- Resintonización TDT y comprobación de compatibilidad UHD.
- Montaje de soportes de televisión.
- Instalación y revisión de kits de aviso de asistencia para aseos accesibles en locales.

Cada familia tiene seis variantes que tratan necesidades diferentes. Las tres preguntas frecuentes de cada ficha corresponden a sus dos especialidades y a uno de los servicios principales. No se añaden afirmaciones sobre averías habituales, intervenciones realizadas ni características locales sin documentación. Se conservan los diez contextos municipales con fuentes y las referencias de barrios de Madrid.

El formulario permite consultar las cinco especialidades desde cualquier ficha local. Añade local comercial, bar/restaurante y hotel/alojamiento como tipos de inmueble. Cada tarjeta selecciona su servicio; cambiar de servicio borra el síntoma anterior para evitar instrucciones contradictorias. El mensaje de WhatsApp continúa preparándose para revisión del visitante.

Las cinco imágenes de equipo de cada ficha se centran horizontalmente dentro de su bloque, junto con el pie de imagen, tanto en móvil como en escritorio. Se conservan su tamaño y proporciones.

## Comparación con el análisis anterior

Se comparan exactamente las mismas **3.291 URLs municipales**, el **81,56 % de los 4.035 municipios**, y las **5.413.695 parejas** posibles. La cobertura comprende 17 provincias y no constituye una muestra aleatoria. No se extrapolan estas cifras a los 744 municipios sin HTML anterior descargado.

| Indicador | Antes | Después |
|---|---:|---:|
| Similitud media de todas las parejas | 70,8437 % | 11,4641 % |
| Media de la página más parecida a cada municipio | 87,9325 % | 43,8840 % |
| Mayor coincidencia entre dos páginas | 100,0000 % | 69,0141 % |
| Municipios con otra página de similitud ≥90 % | 233 | 0 |
| Municipios con otra página de similitud ≥95 % | 60 | 0 |
| Palabras medias del núcleo editorial | 659,88 | 656,69 |
| Palabras de los cinco bloques de servicios, juntas | 283,00 | 278,62 |
| Palabras de las tres preguntas y respuestas, juntas | 120,00 | 106,53 |

La reducción de la media es de **59,3796 puntos porcentuales**. La longitud editorial media disminuye un **0,48 %**. Por página, 2.058 se acortan, 149 mantienen el número de palabras y 1.084 aumentan; los cambios van de −36 a +28 palabras. El recuento bruto del `body`, que también incluye opciones de formulario y otros elementos auxiliares, pasa de 1.558,94 a 1.592,54 palabras de media.

| Pareja de ejemplo | Antes | Después |
|---|---:|---:|
| Aduna – Asteasu | 73,09 % | 11,71 % |
| Bujalaro – Zizurkil | 95,94 % | 9,67 % |
| Santa María del Campo – Duruelo de la Sierra | 100,00 % | 9,23 % |

La mayor coincidencia restante corresponde a Hormilleja y Aldealengua de Santa María, con un 69,0141 %. Los párrafos de cada servicio tienen ocho versiones reutilizadas. Las FAQ forman 3.093 combinaciones de tres preguntas en las páginas comparadas; esto no equivale a 3.093 preguntas diferentes ni a redacciones independientes para cada municipio.

### Método y límites

Se mantiene el Jaccard de conjuntos de secuencias de cinco palabras: secuencias compartidas divididas entre secuencias diferentes presentes en cualquiera de las dos páginas. Se utilizan las mismas funciones originales de extracción y normalización, verificadas por hash.

El núcleo editorial incluye introducción, contexto, tres tarjetas, cinco servicios y FAQ. Se excluyen navegación, formularios, contacto lateral, grupos de botones, pies de imagen, compromisos y el directorio de localidades próximas. Se normalizan mayúsculas, tildes y puntuación, y se sustituyen municipio, provincia y teléfonos por etiquetas. Los textos de los casos técnicos se protegen para no confundir palabras técnicas con topónimos. Se ha comprobado que los títulos y párrafos de las tres tarjetas nuevas están dentro del contenido medido en las 3.291 páginas.

El antes es el HTML público descargado el 21 de octubre de 2026; el después es la compilación de producción del código de este cambio. La medición local, por sí sola, no acredita un despliegue. Esta cifra expresa coincidencia literal de frases; no mide singularidad semántica, penalizaciones, indexación ni una puntuación de Google. Las fichas siguen compartiendo estructura y textos reutilizables.

## Validación

- `npm run check` completo en modo de producción: correcto.
- `node scripts/audit-indexing.mjs --production`: 4.081 URLs indexables, 21 sitemaps y dominio correcto.
- Auditoría global: 4.085 páginas generadas, 0 enlaces internos rotos, 0 títulos o descripciones duplicados y 0 municipios huérfanos.
- Auditoría local: dos especialidades distintas, un diagnóstico, cinco bloques principales, tres FAQ y once enlaces de consulta por ficha. Todas las consultas tienen una opción de formulario correspondiente.
- Prueba de navegador en 320, 390, 430, 768 y 1.440 píxeles: sin desbordamiento horizontal; cinco imágenes centradas, cinco especialidades seleccionables y mensaje de hotel comprobado mediante interceptación, sin enviar mensajes.
- Se mantienen teléfonos por zona, URLs, canonical e indexación. Las descripciones y los datos estructurados reflejan el alcance ampliado a locales y las especialidades mostradas.

## Referencias técnicas

Las referencias completas y sus notas editoriales están en `scripts/local-specialty-copy.mjs`, dentro de `specialtySources`.

- [Televés: modulador HDMI a DVB-T](https://www.televes.com/downloadfile/MQG09200000_006_105996.pdf/MQG09200000_006_ES-EN-FR-PT-AR_585301.pdf). Una fuente distribuye el programa seleccionado; la compatibilidad de entradas y protecciones debe comprobarse.
- [Movistar: televisión para bares](https://www.movistar.es/autonomos/bar-television/deportes) y [Telefónica: contenidos para hoteles y colectividades](https://www.telefonicaempresas.es/grandes-empresas/servicios/para-tus-clientes/soluciones-de-video/contenidos-para-hoteles-y-colectividades/). No se promete compatibilidad universal de receptores ni de modalidades de servicio.
- [Fermax: lector de proximidad City](https://fermax.com/intl-es/productos/control-accesos-y-abrepuertas/control-accesos/proximidad/f06992-lector-proximidad-city/). La gestión de credenciales y la ampliación dependen del sistema elegido.
- [Televisión Digital: guía de resintonización](https://television.digital.gob.es/atencion-a-la-ciudadania/notas-prensa/tdt/guia-facil-para-la-resintonizacion-de-la-tdt--todos-los-cambios-). Se distingue resintonización, receptor, DVB-T2, HEVC y pantalla UHD; no se anuncian frecuencias locales ni cambios obligatorios de antena sin comprobación.
- [Golmar: kit para aseos accesibles KSLBM-4SE](https://soporte.golmar.es/documentacion/intercomunicacion-y-hospital-14/kit-wc-accesibles-kslbm-4se-12329). Se explica llamada, señalización, cancelación y punto de atención; la instalación del kit no acredita por sí sola la accesibilidad de un local.
