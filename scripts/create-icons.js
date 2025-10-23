const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const createIcon = (size) => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="${size}" height="${size}" rx="${size/8}" fill="#3b82f6"/>
<svg x="${size/4}" y="${size/4}" width="${size/2}" height="${size/2}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="m21 10-10-10-10 10"/>
<path d="m11 10-10-10"/>
<path d="m11 10-10 10"/>
<circle cx="12" cy="12" r="3"/>
</svg>
</svg>`;
};

// Create icons
const icon192 = createIcon(192);
const icon512 = createIcon(512);

// Write icon files
fs.writeFileSync(path.join(__dirname, '../public/icon-192.svg'), icon192);
fs.writeFileSync(path.join(__dirname, '../public/icon-512.svg'), icon512);

console.log('Icons created successfully!');
