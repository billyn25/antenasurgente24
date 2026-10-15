# Antena Televés y amplificación

Las dos fotografías nuevas proceden del catálogo del fabricante Televés. Los derechos de las fotografías y las marcas pertenecen a sus titulares. No son fotografías de trabajos realizados por esta empresa ni justifican presentarse como servicio oficial.

- Antena DAT BOSS: https://www.televes.com/es/distribucion-tv/antenas-terrestres/inteligentes-con-bosstech/serie-dat.html
- Amplificadores monocanal T12: https://www.televes.com/es/distribucion-tv/filtrado-y-amplificacion/amplificacion-monocanal/serie-t12.html

Las URLs de las imágenes se recogen en `scripts/residential.mjs`. El build valida formato PNG, dimensiones, tamaño y calcula SHA256 antes de copiarlas a `dist/assets`. El visitante recibe imágenes del propio sitio, sin peticiones al fabricante. Si las fotografías se añaden a `src/media` con los mismos nombres, el build las utiliza sin descargar de nuevo. Una descarga fallida cancela el build en vez de publicar imágenes rotas.

El catálogo T12 es también la referencia técnica para describir el carácter modular de los amplificadores y su montaje en cabeceras. No se publican cifras de ganancia, compatibilidades universales, canales locales ni plazos de llegada inventados. La recepción, alimentación y compatibilidad se comprueban según cada instalación.
