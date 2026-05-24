import { readFile, writeFile } from 'node:fs/promises';
import { cosmiconfig } from 'cosmiconfig';
import gifsicle from 'imagemin-gifsicle';
import jpegtran from 'imagemin-jpegtran';
import optipng from 'imagemin-optipng';
import svgo from 'imagemin-svgo';

const explorer = cosmiconfig('imagemin-lint-staged');

const defaultConfig = {
  gifsicle: {
    interlaced: true,
  },
  jpegtran: {
    progressive: true,
  },
  optipng: {
    optimizationLevel: 5,
  },
  svgo: {
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
  },
};

let pluginsPromise;

const getPluginConfig = (config, pluginName) =>
  config && config[pluginName] ? config[pluginName] : defaultConfig[pluginName];

const createPlugins = async () => {
  const result = await explorer.search();
  const config = result ? result.config : false;

  return [
    gifsicle(getPluginConfig(config, 'gifsicle')),
    jpegtran(getPluginConfig(config, 'jpegtran')),
    optipng(getPluginConfig(config, 'optipng')),
    svgo(getPluginConfig(config, 'svgo')),
  ];
};

const getPlugins = () => {
  pluginsPromise = pluginsPromise || createPlugins();

  return pluginsPromise;
};

export const minifyFile = async (filename) => {
  const plugins = await getPlugins();

  return [...plugins, (it) => writeFile(filename, it)].reduce(
    (acc, plugin) => acc.then(plugin),
    readFile(filename)
  );
};
