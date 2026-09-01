Videos reales de BOB'S — colocar acá:

- hero.mp4              Video del Hero en desktop (pantalla completa, controlado por scroll).
                         Ideal: preparación de café, leche cayendo, waffle, barista, detalles.
- hero-mobile.mp4       Corte vertical/9:16 del mismo video, para celulares (evita que
                         object-cover recorte lo importante en pantallas angostas). Si no
                         existe este archivo, se muestra el placeholder de carga en mobile.
                         Re-encodear con ffmpeg -g 1 (todo frame clave) para que el scroll
                         pueda saltar a cualquier punto del video sin depender de decodificar
                         frames anteriores, ej.:
                         ffmpeg -i video.mp4 -an -c:v libx264 -profile:v high \
                           -pix_fmt yuv420p -g 1 -crf 20 -preset medium -movflags +faststart \
                           public/media/hero-mobile.mp4
- hero-poster.jpg       Imagen de poster del video del hero (se muestra mientras carga).
- transition.mp4   Video de la sección de transición de nubes.
                    Ideal: terraza, exterior del local, gente disfrutando un café.

Formato recomendado: MP4 (H.264), sin audio o con audio muteado, orientación
horizontal, idealmente sin cortes bruscos (el scroll controla el currentTime).
Hasta que agregues estos archivos, la web muestra un fondo degradado de marca
en su lugar.
