const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. Auto-detectar la carpeta de imágenes del proyecto
const POSSIBLE_IMAGE_DIRS = [
  path.resolve(__dirname, '../public/imagenes'),
  path.resolve(__dirname, '../public/img'),
  path.resolve(__dirname, '../public/images'),
  path.resolve(__dirname, '../public/assets'),
  path.resolve(__dirname, '../public'),
  path.resolve(__dirname, '../img')  // Proyectos sin carpeta public/
];

const IMAGES_DIR = POSSIBLE_IMAGE_DIRS.find(dir => fs.existsSync(dir)) || path.resolve(__dirname, '../img');
const BACKUP_DIR = path.resolve(__dirname, '../backups/imagenes-originales');
const SRC_DIR = path.resolve(__dirname, '..');  // Raíz del proyecto

// Función recursiva para obtener archivos filtrados
function getFiles(dir, filter) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath, filter));
    } else if (filter.test(file)) {
      results.push(filePath);
    }
  });
  return results;
}

// Función para formatear el nombre de archivo (SEO: minúsculas, sin acentos, guiones medios)
function sanitizeFilename(name) {
  return name
    .normalize("NFD")                  // Descompone caracteres con acentos
    .replace(/[\u0300-\u036f]/g, "")   // Elimina marcas de acentos (diacríticos)
    .toLowerCase()                     // Convierte a minúsculas
    .replace(/[^a-z0-9]+/g, '-')       // Reemplaza caracteres no alfanuméricos por un guion
    .replace(/^-+|-+$/g, '');          // Remueve guiones sobrantes al inicio y final
}

async function convertImages() {
  console.log(`Iniciando optimización de imágenes en: ${path.relative(path.resolve(__dirname, '..'), IMAGES_DIR)}...`);
  
  // Buscar archivos JPG, JPEG, PNG
  const imageFiles = getFiles(IMAGES_DIR, /\.(jpe?g|png)$/i);
  
  // Filtrar los que estén dentro de la carpeta "logos"
  const filesToConvert = imageFiles.filter(file => {
    const relativePath = path.relative(IMAGES_DIR, file);
    const isLogo = relativePath.startsWith('logos' + path.sep) || relativePath.startsWith('logos/');
    if (isLogo) {
      console.log(`Excluido (es logotipo): ${relativePath}`);
    }
    return !isLogo;
  });

  if (filesToConvert.length === 0) {
    console.log('No se encontraron imágenes nuevas para convertir.');
    return;
  }

  // Filtrar duplicados / thumbnails de WordPress (ej: -400x600)
  const finalFilesToConvert = [];
  for (const file of filesToConvert) {
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    const dir = path.dirname(file);

    const wpDimensionMatch = base.match(/(-\d+x\d+)$/i);
    if (wpDimensionMatch) {
      const suffix = wpDimensionMatch[1];
      const baseWithoutDimensions = base.slice(0, -suffix.length);

      const originalExists = imageFiles.some(otherFile => {
        if (otherFile === file) return false;
        const otherExt = path.extname(otherFile);
        const otherBase = path.basename(otherFile, otherExt);
        const otherDir = path.dirname(otherFile);
        return otherDir === dir && otherBase.toLowerCase() === baseWithoutDimensions.toLowerCase();
      }) || fs.existsSync(path.join(dir, `${baseWithoutDimensions}.webp`));

      if (originalExists) {
        console.log(`Excluido (es miniatura/duplicado de WordPress): ${path.relative(IMAGES_DIR, file)}`);
        try {
          fs.unlinkSync(file);
          console.log(`  ✓ Eliminado archivo original duplicado físico: ${path.relative(IMAGES_DIR, file)}`);
        } catch (e) {}
        continue;
      }
    }
    finalFilesToConvert.push(file);
  }

  if (finalFilesToConvert.length === 0) {
    console.log('No se encontraron imágenes nuevas para convertir (después de filtrar miniaturas).');
    return;
  }

  console.log(`Se encontraron ${finalFilesToConvert.length} imágenes para procesar.`);
  const replacements = [];

  for (const file of finalFilesToConvert) {
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    const dir = path.dirname(file);
    
    // Rutas de destino con nombre sanitizado para SEO
    const sanitizedBase = sanitizeFilename(base);
    const relativeDir = path.relative(IMAGES_DIR, dir);
    const webpFile = path.join(dir, `${sanitizedBase}.webp`);
    const backupFileDir = path.join(BACKUP_DIR, relativeDir);
    const backupFile = path.join(backupFileDir, `${base}${ext}`);

    try {
      // 1. Convertir la imagen a WebP con calidad 80
      await sharp(file)
        .webp({ quality: 80 })
        .toFile(webpFile);
      
      console.log(`✓ Convertido y optimizado SEO: ${path.relative(IMAGES_DIR, file)} -> ${sanitizedBase}.webp`);

      // 2. Crear el directorio de backup correspondiente
      fs.mkdirSync(backupFileDir, { recursive: true });

      // 3. Mover el archivo original al directorio de backup
      if (fs.existsSync(backupFile)) {
        fs.unlinkSync(backupFile);
      }
      fs.renameSync(file, backupFile);
      console.log(`→ Movido original a backup: backups/imagenes-originales/${path.relative(IMAGES_DIR, dir)}/${base}${ext}`);

      // Registrar para el reemplazo en el código
      replacements.push({
        from: `${base}${ext}`,
        to: `${sanitizedBase}.webp`
      });
    } catch (err) {
      console.error(`✗ Error al procesar ${path.relative(IMAGES_DIR, file)}:`, err.message);
    }
  }

  // 4. Actualizar referencias en los archivos de código
  if (replacements.length > 0) {
    console.log('\nBuscando y actualizando referencias en el código...');
    const codeFiles = getFiles(SRC_DIR, /\.(html|css|jsx?|tsx?)$/i);

    for (const codeFile of codeFiles) {
      let content = fs.readFileSync(codeFile, 'utf8');
      let modified = false;

      for (const rep of replacements) {
        if (content.includes(rep.from)) {
          const escapedFrom = rep.from.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(escapedFrom, 'g');
          content = content.replace(regex, rep.to);
          modified = true;
          console.log(`  Actualizada referencia de "${rep.from}" a "${rep.to}" en src/${path.relative(SRC_DIR, codeFile)}`);
        }
      }

      if (modified) {
        fs.writeFileSync(codeFile, content, 'utf8');
      }
    }
  }

  console.log('\n¡Proceso de conversión y actualización completado!');
}

convertImages().catch(err => {
  console.error('Error general en el proceso de conversión:', err);
});
