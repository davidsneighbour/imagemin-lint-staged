import { jest, describe, it, expect } from '@jest/globals';
import path from 'node:path';
import { cp, mkdtemp, readFile, readdir, stat } from 'node:fs/promises';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIXTURE_DIR = path.resolve(__dirname, '__fixtures__');
const FILENAMES = ['test.gif', 'test.jpg', 'test.png', 'test.svg'];

const passthroughWithMarker = (marker) => () => async (buffer) =>
  Buffer.concat([buffer, Buffer.from(marker)]);

jest.unstable_mockModule('imagemin-gifsicle', () => ({
  default: passthroughWithMarker('\n/* gifsicle optimized */'),
}));

jest.unstable_mockModule('imagemin-jpegtran', () => ({
  default: passthroughWithMarker('\n/* jpegtran optimized */'),
}));

jest.unstable_mockModule('imagemin-optipng', () => ({
  default: passthroughWithMarker('\n/* optipng optimized */'),
}));

jest.unstable_mockModule('imagemin-svgo', () => ({
  default: passthroughWithMarker('\n<!-- svgo optimized -->'),
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
      for (const entry of after) {
        expect(entry.contents).toContain('/* gifsicle optimized */');
        expect(entry.contents).toContain('/* jpegtran optimized */');
        expect(entry.contents).toContain('/* optipng optimized */');
        expect(entry.contents).toContain('<!-- svgo optimized -->');
      }

      await readdir(tempDir);
    });
  });
});
