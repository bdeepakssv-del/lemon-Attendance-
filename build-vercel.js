const fs = require('fs');
const path = require('path');

console.log('Generating public/ directory for Vercel deployment...');

const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  fs.rmSync(publicDir, { recursive: true, force: true });
}
fs.mkdirSync(publicDir, { recursive: true });

// Copy html files
const filesToCopy = ['index.html', 'admin.html', 'staff.html', 'favicon.ico'];
filesToCopy.forEach(file => {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(publicDir, file));
    console.log(`Copied ${file} -> public/${file}`);
  }
});

// Copy asset directories
const dirsToCopy = ['css', 'js', 'locales', 'image'];
dirsToCopy.forEach(dir => {
  const src = path.join(__dirname, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, path.join(publicDir, dir), { recursive: true });
    console.log(`Copied directory ${dir} -> public/${dir}`);
  }
});

console.log('✅ public/ directory generated successfully for Vercel!');
