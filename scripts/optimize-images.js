/**
 * Image Optimization Script
 * Converts PNG/JPG images to WebP and AVIF
 */
import { readdir, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';

const PUBLIC_DIR = './public';
const IMAGE_DIRS = ['images/restaurants', 'images/foods'];

async function convertImage(inputPath, outputDir) {
  const filename = basename(inputPath, extname(inputPath));
  const webpPath = join(outputDir, `${filename}.webp`);
  const avifPath = join(outputDir, `${filename}.avif`);
  
  console.log(`📸 Conversion: ${basename(inputPath)}`);
  
  try {
    await sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(webpPath);
    console.log(`  ✅ WebP créé: ${basename(webpPath)}`);
    
    await sharp(inputPath)
      .avif({ quality: 80, effort: 6 })
      .toFile(avifPath);
    console.log(`  ✅ AVIF créé: ${basename(avifPath)}`);
    
    return true;
  } catch (error) {
    console.error(`  ❌ Erreur: ${error.message}`);
    return false;
  }
}

async function processDirectory(dirPath) {
  console.log(`\n📁 Traitement du dossier: ${dirPath}`);
  
  if (!existsSync(dirPath)) {
    console.log(`  ⚠️ Dossier introuvable, ignoré`);
    return;
  }
  
  const files = await readdir(dirPath, { withFileTypes: true });
  let converted = 0;
  
  for (const file of files) {
    const fullPath = join(dirPath, file.name);
    
    if (file.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      const ext = extname(file.name).toLowerCase();
      
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        const success = await convertImage(fullPath, dirPath);
        if (success) converted++;
      }
    }
  }
  
  console.log(`✨ ${converted} image(s) convertie(s) dans ${dirPath}`);
}

async function main() {
  console.log('🚀 Démarrage de l\'optimisation des images...\n');
  
  for (const dir of IMAGE_DIRS) {
    const fullPath = join(PUBLIC_DIR, dir);
    await processDirectory(fullPath);
  }
  
  console.log(`\n📁 Traitement des icônes...`);
  const publicFiles = await readdir(PUBLIC_DIR);
  let iconConverted = 0;
  
  for (const file of publicFiles) {
    const ext = extname(file).toLowerCase();
    if (['.png', '.jpg', '.jpeg'].includes(ext)) {
      const fullPath = join(PUBLIC_DIR, file);
      const success = await convertImage(fullPath, PUBLIC_DIR);
      if (success) iconConverted++;
    }
  }
  
  console.log(`✨ ${iconConverted} icône(s) convertie(s)`);
  console.log('\n✅ Optimisation terminée avec succès!');
  console.log('\n💡 Utilisez <OptimizedImage> dans vos composants pour bénéficier des formats optimisés.');
}

main().catch(console.error);

