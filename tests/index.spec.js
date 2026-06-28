import { jest, describe, it, expect } from '@jest/globals';
import path from 'node:path';
import { cp, mkdtemp, readFile, readdir, stat } from 'node:fs/promises';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIXTURE_DIR = path.resolve(__dirname, '__fixtures__');
const FILENAMES = ['test.gif', 'test.jpg', 'test.png', 'test.svg'];

jest.unstable_mockModule('sharp', () => ({
  default: (buffer) => ({
    jpeg: (_options) => ({
      toBuffer: () => Promise.resolve(Buffer.concat([buffer, Buffer.from('\n/* sharp:jpeg */')])),
    }),
    png: (_options) => ({
      toBuffer: () => Promise.resolve(Buffer.concat([buffer, Buffer.from('\n/* sharp:png */')])),
    }),
    gif: (_options) => ({
      toBuffer: () => Promise.resolve(Buffer.concat([buffer, Buffer.from('\n/* sharp:gif */')])),
    }),
  }),
}));

jest.unstable_mockModule('imagemin-svgo', () => ({
  default: () => async (buffer) => Buffer.concat([buffer, Buffer.from('\n<!-- svgo optimized -->')]),
}));

const { minifyFile } = await import('../lib/index.js');

describe('index module', () => {
  describe('minifyFile function', () => {
    it('optimizes staged image files in place', async () => {
      const tempDir = await mkdtemp(path.join(os.tmpdir(), 'imagemin-lint-staged-test-'));
      await Promise.all(
        FILENAMES.map((filename) =>
          cp(path.join(FIXTURE_DIR, filename), path.join(tempDir, filename))
        )
      );

      const before = await Promise.all(
        FILENAMES.map(async (filename) => {
          const filepath = path.join(tempDir, filename);
          const [contents, { size }] = await Promise.all([readFile(filepath), stat(filepath)]);
          return { filename, size, contents: contents.toString('utf8') };
        })
      );

      await Promise.all(FILENAMES.map((filename) => minifyFile(path.join(tempDir, filename))));

      const after = await Promise.all(
        FILENAMES.map(async (filename) => {
          const filepath = path.join(tempDir, filename);
          const [contents, { size }] = await Promise.all([readFile(filepath), stat(filepath)]);
          return { filename, size, contents: contents.toString('utf8') };
        })
      );

      expect(after).not.toEqual(before);
      expect(after.every((entry, index) => entry.size > before[index].size)).toBe(true);

      const byName = Object.fromEntries(after.map((e) => [e.filename, e]));

      expect(byName['test.gif'].contents).toContain('/* sharp:gif */');
      expect(byName['test.jpg'].contents).toContain('/* sharp:jpeg */');
      expect(byName['test.png'].contents).toContain('/* sharp:png */');
      expect(byName['test.svg'].contents).toContain('<!-- svgo optimized -->');

      await readdir(tempDir);
    });
  });
});
