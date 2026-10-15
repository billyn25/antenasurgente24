# Publicación del dominio e indexación

Corrección solicitada por el titular tras conectar antenistaurgente24horas.com: el sitemap público aún enlazaba a la prepublicación de Netlify porque launchReady permanecía desactivado.

Se activa launchReady. En producción, el índice y sus 21 sitemaps usan exclusivamente https://antenistaurgente24horas.com, igual que las 4.081 URLs de contenido, sus canonicals y los datos estructurados. Se elimina el noindex global del contenido público. Aviso legal, privacidad, cookies, la página 404 e informes técnicos conservan sus exclusiones anteriores.

Los previews y las ramas no se abren a Google. La dirección principal de Netlify redirige al .com conservando la ruta. El build se cancela si el dominio principal de Netlify no coincide con config/site.json; nunca se publica silenciosamente el sitemap de pruebas como sustituto del público.

CI compila y audita por separado preview y producción. scripts/audit-indexing.mjs comprueba todos los dominios de los sitemaps, todos los meta robots, los canonicals y las cabeceras generadas. tests/publication-live.mjs comprueba la publicación real: índice, cada sitemap provincial, recuento de URLs, páginas de muestra, cabeceras HTTP, robots.txt, redirecciones, móvil y privacidad. No utiliza el resultado de un build local como prueba de indexación por Google.

Después del despliegue, reenviar sitemap.xml en la propiedad antenistaurgente24horas.com de Search Console. Abrir indexación y corregir sitemaps permite el rastreo; no garantiza cuántas páginas indexará Google ni cuándo actualizará el informe.
