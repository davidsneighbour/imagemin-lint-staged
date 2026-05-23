import path from 'node:path';
import { stat } from 'node:fs/promises';
import { exec as _exec } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

import { minifyFile } from '../lib/index.js';

const exec = promisify(_exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('index module', () => {
  const FILENAMES =
    './__fixtures__/test.gif ./__fixtures__/test.jpg ./__fixtures__/test.png ./__fixtures__/test.svg'.split(
      ' '
    );

  const stats = () =>
    Promise.all(
      FILENAMES.map(async (f) => {
        const { size } = await stat(path.resolve(__dirname, f));
        return { f, size };
      })
    );

  describe('minifyFile function', () => {
    it('should work as expected', async () => {
      const before = await stats();
      await Promise.all(FILENAMES.map((f) => minifyFile(path.resolve(__dirname, f))));
      const after = await stats();
      await exec('git checkout .');
      expect(after).not.toEqual(before);

      expect(before).toMatchSnapshot();
      expect(after).toMatchSnapshot();
    });
  });
});
