import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const directories = [
  'public',
  'public/images'
];

async function optimizeImages() {
  console.log('--- Starting Image Optimization (PNG to WebP) ---');
  
  for (const dir of directories) {
    const absoluteDir = path.resolve(dir);
    if (!fs.existsSync(absoluteDir)) {
      console.log(`Directory does not exist: ${dir}`);
      continue;
    }
    
    const files = fs.readdirSync(absoluteDir);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.png') {
        const inputPath = path.join(absoluteDir, file);
        const baseName = path.basename(file, ext);
        const outputPath = path.join(absoluteDir, `${baseName}.webp`);
        
        console.log(`Optimizing: ${file} -> ${baseName}.webp`);
        
        try {
          await sharp(inputPath)
            .webp({ quality: 80 })
            .toFile(outputPath);
            
          const originalSize = fs.statSync(inputPath).size;
          const optimizedSize = fs.statSync(outputPath).size;
          const savingPercent = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
          
          console.log(`  Success! Size: ${(originalSize / 1024).toFixed(1)} KB -> ${(optimizedSize / 1024).toFixed(1)} KB (${savingPercent}% saved)`);
          
          // Delete original PNG
          fs.unlinkSync(inputPath);
          console.log(`  Deleted original: ${file}`);
        } catch (err) {
          console.error(`  Error optimizing ${file}:`, err);
        }
      }
    }
  }
  
  console.log('--- Image Optimization Complete ---');
}

optimizeImages().catch(err => {
  console.error('Fatal error during image optimization:', err);
  process.exit(1);
});
