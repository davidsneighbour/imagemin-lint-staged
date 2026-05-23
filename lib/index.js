import { readFile, writeFile } from 'node:fs/promises';
import { cosmiconfigSync } from 'cosmiconfig';
import gifsicle from 'imagemin-gifsicle';
import jpegtran from 'imagemin-jpegtran';
import optipng from 'imagemin-optipng';
import svgo from 'imagemin-svgo';

const explorerSync = cosmiconfigSync('imagemin-lint-staged');
const { config } = explorerSync.search() || { config: false };

const gifsicleConfig =
  config && config.gifsicle
    ? config.gifsicle
    : {
        interlaced: true,
      };

const jpegtranConfig =
  config && config.jpegtran
    ? config.jpegtran
    : {
        progressive: true,
      };

const optipngConfig =
  config && config.optipng
    ? config.optipng
    : {
        optimizationLevel: 5,
      };

const svgoConfig =
  config && config.svgo
    ? config.svgo
    : {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
        ],
      };

const plugins = [
  gifsicle(gifsicleConfig),
  jpegtran(jpegtranConfig),
  optipng(optipngConfig),
  svgo(svgoConfig),
];

export const minifyFile = (filename) =>
  [...plugins, (it) => writeFile(filename, it)].reduce(
    (acc, plugin) => acc.then(plugin),
    readFile(filename)
  );
