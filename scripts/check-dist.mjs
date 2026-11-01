// Fails the build before Cloudflare Pages would reject the deploy (free plan: 20,000 files, 25 MiB per file).
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const files = readdirSync('dist', { recursive: true, withFileTypes: true }).filter((d) => d.isFile());
const big = files.map((d) => join(d.parentPath, d.name)).filter((f) => statSync(f).size > 25 * 1024 * 1024);
console.log(`dist: ${files.length} files`);
if (files.length > 19000) throw new Error(`${files.length} files: near Cloudflare's 20,000 limit`);
if (big.length) throw new Error(`over 25 MiB: ${big.join(', ')}`);
