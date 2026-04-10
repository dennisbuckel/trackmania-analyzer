const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateFavicons() {
  const inputPath = path.join(__dirname, 'public', 'logo.png');
  
  if (!fs.existsSync(inputPath)) {
    console.error('❌ public/logo.png not found!');
    process.exit(1);
  }

  console.log('🎨 Generating favicons from logo.png...');

  // Generate logo192.png
  await sharp(inputPath)
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(__dirname, 'public', 'logo192.png'));
  console.log('  ✅ logo192.png');

  // Generate logo512.png
  await sharp(inputPath)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(__dirname, 'public', 'logo512.png'));
  console.log('  ✅ logo512.png');

  // Generate favicon as 32x32 PNG (browsers support PNG favicons)
  await sharp(inputPath)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(__dirname, 'public', 'favicon-32.png'));
  console.log('  ✅ favicon-32.png');

  // Generate favicon-16.png
  await sharp(inputPath)
    .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(__dirname, 'public', 'favicon-16.png'));
  console.log('  ✅ favicon-16.png');

  // Generate apple-touch-icon (180x180)
  await sharp(inputPath)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(__dirname, 'public', 'apple-touch-icon.png'));
  console.log('  ✅ apple-touch-icon.png');

  // Copy to src/assets for use in React components
  const assetsDir = path.join(__dirname, 'src', 'assets');
  await sharp(inputPath)
    .resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(assetsDir, 'logo.png'));
  console.log('  ✅ src/assets/logo.png (128px for components)');

  // Generate ICO-compatible PNG for favicon.ico replacement
  await sharp(inputPath)
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(__dirname, 'public', 'favicon-48.png'));
  console.log('  ✅ favicon-48.png');

  console.log('\n🎉 All favicons generated successfully!');
  console.log('💡 Note: Update index.html to use PNG favicons instead of .ico');
}

generateFavicons().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
