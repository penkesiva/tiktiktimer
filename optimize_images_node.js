const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
  console.log('🖼️  Optimizing images with Node.js...');
  
  const imagesDir = path.join(__dirname, 'public', 'images');
  const optimizedDir = path.join(imagesDir, 'optimized');
  
  // Create optimized directory
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
  }
  
  const images = [
    { name: 'logo.png', size: 300 },
    { name: 'workout1.png', size: 400 },
    { name: 'workout2.png', size: 400 },
    { name: 'meditation.png', size: 400 }
  ];
  
  for (const image of images) {
    const inputPath = path.join(imagesDir, image.name);
    const outputPath = path.join(optimizedDir, image.name);
    
    if (fs.existsSync(inputPath)) {
      console.log(`📦 Optimizing ${image.name}...`);
      try {
        await sharp(inputPath)
          .resize(image.size, image.size, { fit: 'inside' })
          .png({ quality: 85 })
          .toFile(outputPath);
        console.log(`✅ ${image.name} optimized successfully`);
      } catch (error) {
        console.error(`❌ Error optimizing ${image.name}:`, error.message);
      }
    } else {
      console.log(`⚠️  ${image.name} not found`);
    }
  }
  
  // Show file sizes
  console.log('\n📊 File size comparison:');
  console.log('Original files:');
  const originalFiles = fs.readdirSync(imagesDir).filter(f => f.endsWith('.png') && !f.includes('optimized'));
  originalFiles.forEach(file => {
    const stats = fs.statSync(path.join(imagesDir, file));
    console.log(`  ${file}: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  });
  
  console.log('\nOptimized files:');
  if (fs.existsSync(optimizedDir)) {
    const optimizedFiles = fs.readdirSync(optimizedDir);
    optimizedFiles.forEach(file => {
      const stats = fs.statSync(path.join(optimizedDir, file));
      console.log(`  ${file}: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    });
  }
  
  console.log('\n✅ Optimization complete!');
  console.log('💡 You can now replace the original files with optimized ones:');
  console.log('   mv public/images/optimized/* public/images/');
  console.log('   rm -rf public/images/optimized');
}

optimizeImages().catch(console.error);
