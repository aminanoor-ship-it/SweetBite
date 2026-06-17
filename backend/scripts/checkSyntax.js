const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function walk(folder) {
  return fs.readdirSync(folder, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(folder, entry.name);
    return entry.isDirectory() ? walk(full) : full.endsWith('.js') ? [full] : [];
  });
}

const files = walk(path.join(__dirname, '..')).filter(file => !file.includes('node_modules'));
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status);
}
console.log(`Syntax checked: ${files.length} JavaScript files.`);
