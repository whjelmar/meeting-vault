import fs from 'fs';
import path from 'path';

const plugins: any[] = [];

fs.readdirSync(__dirname).forEach(file => {
  if (file !== 'index.ts' && file.endsWith('.ts')) {
    const plugin = require(path.join(__dirname, file)).default;
    plugins.push(plugin);
  }
});

export default plugins;
