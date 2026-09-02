Videos reales de BOB'S — colocar acá:

- hero.mp4         Video del Hero en desktop (pantalla completa, controlado
                    por scroll, solo en la portada).
- hero-mobile.mp4  Mismo video, corte vertical/9:16 para celulares (evita que
                    object-cover recorte lo importante en pantallas angostas).

Re-encodear con ffmpeg -g 1 (todo frame clave) para que el scroll pueda
saltar a cualquier punto del video sin depender de decodificar frames
anteriores, ej.:

  ffmpeg -i video.mp4 -an -c:v libx264 -profile:v high -pix_fmt yuv420p \
    -g 1 -crf 20 -preset medium -movflags +faststart \
    public/media/hero.mp4

Formato recomendado: MP4 (H.264), sin audio, idealmente sin cortes bruscos
(el scroll controla el currentTime). Hasta que agregues estos archivos, la
web muestra un fondo degradado de marca en su lugar.
