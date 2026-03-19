const fs = require('fs');
const path = require('path');

const src = 'C:/Users/LOQ/.gemini/antigravity/brain/8eae437a-7218-4126-a608-e9bfef1acc79';
const dest = 'c:/consultancy2/ar-shopping-frontend/public/images/production';

if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
}

const files = fs.readdirSync(src)
    .filter(f => f.startsWith('media__') && f.endsWith('.png'))
    .map(f => ({ name: f, time: fs.statSync(path.join(src, f)).mtime.getTime() }))
    .sort((a,b) => b.time - a.time)
    .slice(0, 4);

console.log('Found latest files:');
files.forEach((f, i) => {
    console.log(`${f.name} -> step_${i+1}.png`);
    fs.copyFileSync(path.join(src, f.name), path.join(dest, `step_${i+1}.png`));
});
