import { readFile, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';
import { cosmiconfig } from 'cosmiconfig';
import sharp from 'sharp';
import svgo from 'imagemin-svgo';

const explorer = cosmiconfig('imagemin-lint-staged');

const defaultConfig = {
  jpeg: {
    progressive: true,
    quality: 85,
  },
  png: {
    compressionLevel: 9,
  },
  gif: {
    effort: 10,
  },
  svgo: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
            cleanupIds: false,
            removeDesc: false,
          },
        },
      },
    ],
  },
};

let configPromise;

const getCachedConfig = () => {
  configPromise = configPromise || explorer.search().then((result) => (result ? result.config : {}));
  return configPromise;
};

const resolve = (config, key) => (config && config[key]) ? config[key] : defaultConfig[key];

export const minifyFile = async (filename) => {
  const config = await getCachedConfig();
  const ext = extname(filename).toLowerCase();
  const input = await readFile(filename);
  let output;

  if (ext === '.jpg' || ext === '.jpeg') {
    output = await sharp(input).jpeg(resolve(config, 'jpeg')).toBuffer();
  } else if (ext === '.png') {
    output = await sharp(input).png(resolve(config, 'png')).toBuffer();
  } else if (ext === '.gif') {
    output = await sharp(input).gif(resolve(config, 'gif')).toBuffer();
  } else if (ext === '.svg') {
    output = await svgo(resolve(config, 'svgo'))(input);
  } else {
    output = input;
  }

  await writeFile(filename, output);
};
