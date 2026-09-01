Videos reales de BOB'S — colocar acá:

- bg-desktop.mp4   Video de fondo fijo (horizontal), detrás de TODA la página
                    (Hero, menú, reservas, etc.). Su currentTime avanza/retrocede
                    con el scroll total de la página (ScrollBackgroundVideo.tsx).
- bg-mobile.mp4     Mismo video, corte vertical/9:16 para celulares — se elige
                    dinámicamente según el ancho de pantalla (max-width: 767px),
                    reactivo a resize/rotación, no solo al cargar la página.

Re-encodear con GOP corto (todo seek queda cerca de un keyframe → rápido) y
CRF alto (el video va atenuado al 45% de opacidad + overlay oscuro encima, no
necesita máxima calidad), ej.:

  ffmpeg -i video.mp4 -an -c:v libx264 -profile:v high -pix_fmt yuv420p \
    -g 8 -crf 28 -preset medium -movflags +faststart \
    public/media/bg-desktop.mp4

Formato recomendado: MP4 (H.264), sin audio, idealmente sin cortes bruscos
(el scroll controla el currentTime). Hasta que agregues estos archivos, el
fondo queda negro liso (sin video, solo el overlay oscuro).
