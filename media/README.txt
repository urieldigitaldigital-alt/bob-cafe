Videos reales de BOB'S — colocar acá:

- hero.mp4              Video del Hero en desktop (pantalla completa, controlado por scroll).
                         Ideal: preparación de café, leche cayendo, waffle, barista, detalles.
- hero-mobile-frames/   Secuencia de imágenes (frame-001.jpg...) del corte vertical/9:16
                         para celulares, generada del video móvil. En mobile se pinta
                         en un <canvas> según el scroll en vez de usar <video> — iOS Safari
                         no repinta un <video> pausado, así que scrubbear currentTime ahí
                         se queda congelado en un frame; una secuencia de imágenes no tiene
                         ese problema en ningún navegador.
                         Para regenerar/actualizar: reemplazar el video fuente y volver a
                         extraer con ffmpeg, ej.:
                         ffmpeg -i video.mp4 -vf "fps=12,scale=540:-1" -q:v 4 \
                           public/media/hero-mobile-frames/frame-%03d.jpg
- hero-poster.jpg       Imagen de poster del video del hero (se muestra mientras carga).
- transition.mp4   Video de la sección de transición de nubes.
                    Ideal: terraza, exterior del local, gente disfrutando un café.

Formato recomendado: MP4 (H.264), sin audio o con audio muteado, orientación
horizontal, idealmente sin cortes bruscos (el scroll controla el currentTime).
Hasta que agregues estos archivos, la web muestra un fondo degradado de marca
en su lugar.
