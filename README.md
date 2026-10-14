# Antenista Urgente 24 Horas

Proyecto nuevo: billyn25/antenasurgente24. Este cambio no modifica Antenas Rapid ni Antenista Cerca.

## Compilar

Node 22 o superior. Sin dependencias npm de producción. Ejecutar `npm run check`; Netlify publica `dist` solo después de compilar y auditar.

El directorio importa un censo municipal versionado (ver `scripts/municipios.mjs`). Se comprueban los recuentos de las 20 provincias y se cancela el build ante fallos de descarga, municipios ausentes o slugs duplicados; nunca se publica una selección parcial como si fuera completa.

## Arquitectura

- Inicio → provincia → municipio; páginas HTML sin dependencia de JavaScript para navegar.
- Cada municipio reúne antenas, porteros automáticos y videoporteros, con contenido de instalación/reparación y contacto provincial.
- 3 páginas de servicio, directorios alfabéticos con filtro, formulario WhatsApp con provincia preseleccionada y teléfonos independientes para Centro y Norte.
- Sitemaps por provincia y principal, canonical, metadatos sociales, Organization, WebSite, WebPage, Service y BreadcrumbList; sin sedes ni valoraciones ficticias.
- Cinco fotografías originales ya presentes en `src/media`, distintas en la portada. No se sustituyen las fotografías por imágenes de prueba.

## Publicación e indexación

El estado original `launchReady: false` se conserva. GitHub y Netlify pueden publicar la previsualización, pero sigue con `noindex,follow`. No confundir publicar archivos con aparecer en Google.

Para lanzar el dominio definitivo: confirmar dominio y datos completos del titular, completar los textos legales, establecer `launchReady: true` en `config/site.json` y verificar que `URL` de Netlify coincide exactamente con el dominio y `CONTEXT=production`. Los previews continúan en noindex. No usar la opción `LOCAL_FIXTURE` en Netlify ni GitHub Actions.

Las fichas municipales son un directorio de consulta, no una afirmación de disponibilidad inmediata en todos los pueblos. La indexación y la posición no están garantizadas. Los textos técnicos compartidos deben complementarse con datos de servicio y trabajos locales reales cuando el titular los facilite; no se simula contenido exclusivo mediante cambios aleatorios.

`dist/build-report.json` identifica recuentos y modo real de compilación. `npm run audit` comprueba H1, títulos, descripciones, enlaces, fotografías referenciadas, teléfonos, selección de WhatsApp, JSON-LD, canonicals, sitemaps y municipios huérfanos.
