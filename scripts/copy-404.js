import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve('dist');
copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'));
console.log('404.html criado para GitHub Pages (SPA fallback)');
