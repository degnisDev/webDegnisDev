# Skills del Proyecto

## Skill: Optimización y Carga de Imágenes

Esta guía detalla el procedimiento estándar para agregar, optimizar y registrar nuevas imágenes en las galerías de la aplicación web.

### 1. Preparación de Archivos Originales
* Guarda las imágenes en formato `.jpeg`, `.jpg` o `.png` dentro del directorio correspondiente en `public/img/`.
* Los nombres de archivo deben ser descriptivos y usar guiones (`-`) para separar las palabras (ej. `tobogan-gigante.jpeg`).

### 2. Conversión a WebP y Respaldo
Para optimizar las imágenes y mover los originales a la carpeta de copias de seguridad de forma automatizada, ejecuta el script de conversión:

```powershell
npm run convert-images
```