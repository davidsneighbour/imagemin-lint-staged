#!/usr/bin/env node
import { minifyFile } from '../lib/index.js';

Promise.all(process.argv.slice(2).map(minifyFile)).catch((error) => {
  console.error(error);
  process.exit(1);
});
