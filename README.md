# Antenista Urgente 24 Horas

Proyecto nuevo: `billyn25/antenasurgente24`. No modifica Antenas Rapid ni Antenista Cerca.

## Compilar y comprobar

Node 22 o superior, sin dependencias npm. `npm run check` ejecuta pruebas, generación de HTML, presentación editorial y auditoría final. Netlify publica `dist` únicamente después de superar este proceso.

El generador municipal conserva 4.035 municipios de 20 provincias y 4.063 páginas HTML. Importa un inventario versionado y comprueba recuentos y slugs. `scripts/presentation.mjs` aplica la composición editorial a HTML estático: no depende de JavaScript del visitante. Si una plantilla cambia y no se reconoce, el build falla en vez de ignorar el cambio.

## Presentación azul / confianza

- Paleta azul, antracita y blanco; WhatsApp conserva su verde. Favicon y botones también azules.
- Eslogan: «Señal clara. Puertas que responden.»
- Retirada la foto inferior `hero-obra.webp` de la publicación. Portada con cuatro fotografías distintas ya presentes en el proyecto.
- Cinco compromisos de servicio con estrellas decorativas. No son reseñas, nota media ni testimonios; no se publica marcado Review o AggregateRating.
- Nuevos contenidos de vivienda/comunidad/negocio, síntomas y alcance del presupuesto. Ampliación específica de los tres servicios y de la preparación de visitas municipales.
- CSS versionado para evitar que la caché conserve el diseño anterior.

## SEO y contactos

Inicio → provincia → municipio. HTML con todos los enlaces, directorio alfabético y filtro opcional. Las fichas conservan antenista en pueblo, instalación de antenas, porteros automáticos y videoporteros; teléfono y formulario WhatsApp preseleccionados por provincia.

Teléfono Norte: 641 589 394. Madrid, Guadalajara, Toledo y Cuenca: 614 789 945. Canonicals, metadatos, JSON-LD y sitemaps principal/provinciales se mantienen. No se anuncian sedes físicas en todos los municipios ni se garantiza disponibilidad inmediata.

`dist/build-report.json` muestra recuentos, modo de indexación y versión editorial. La auditoría comprueba todas las páginas: H1, títulos, descripciones, enlaces, anclas, IDs, fotos, teléfonos, WhatsApp, JSON-LD, canonicals, sitemaps y municipios huérfanos.

## Indexación y datos legales

Se conserva `launchReady: false`. Esta revisión visual no habilita la indexación ni da por completados los datos legales. Para lanzar el dominio definitivo deben confirmarse titular y dominio, completar la información legal y activar la configuración de producción. Los previews siguen en `noindex,follow`.

El contenido técnico común no se presenta como trabajo realizado en cada pueblo. Los datos y fotografías de intervenciones locales solo deben añadirse cuando sean reales y verificables. La cantidad de URLs no garantiza indexación ni posiciones.
