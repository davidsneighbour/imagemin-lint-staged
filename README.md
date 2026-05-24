# imagemin-lint-staged

> imagemin CLI designed for lint-staged usage with sensible defaults

[![Version][npm-image]][npm-url] [![PR Workflow][github-workflows-pr-image]][github-workflows-pr-url]

This started as a fork of [tomchentw/imagemin-lint-staged](https://github.com/tomchentw/imagemin-lint-staged), but the original repository seems to be [unmaintained](https://github.com/tomchentw/imagemin-lint-staged/issues) and I wanted the error messages to disappear. So I took the liberty to update the dependencies and make it work again. If you are the original author and want to merge this back, please let me know.

## Installation

```sh
npm i --save-dev @davidsneighbour/imagemin-lint-staged
```

## Usage

Use in conjunction with [lint-staged][lint-staged]. In your `package.json`

```json
"lint-staged": {
  "*.{png,jpeg,jpg,gif,svg}": ["imagemin-lint-staged"]
},
```

## Configuration

The package uses [cosmiconfig][cosmiconfig] with the module name `imagemin-lint-staged`. This means you can configure the imagemin plugins from a project-level configuration file instead of changing the package source.

Configuration is searched from the current working directory. For normal `lint-staged` usage this is usually the repository root, because `lint-staged` is run from there.

Supported configuration locations include:

* `package.json`, using the `imagemin-lint-staged` property
* `.imagemin-lint-stagedrc`
* `.imagemin-lint-stagedrc.{json,yaml,yml,js,ts,mjs,cjs}`
* `.config/imagemin-lint-stagedrc`
* `.config/imagemin-lint-stagedrc.{json,yaml,yml,js,ts,mjs,cjs}`
* `imagemin-lint-staged.config.{js,ts,mjs,cjs}`

The package uses cosmiconfig's asynchronous API, so ESM configuration files are supported. In ESM projects, prefer `imagemin-lint-staged.config.js` or `imagemin-lint-staged.config.mjs` with `export default`.

### Default configuration

The built-in defaults are configured for lossless optimisation. They favour smaller files while avoiding settings that intentionally reduce image quality, resize images, remove required SVG scaling behaviour, or remove basic SVG accessibility metadata.

```js
export default {
  gifsicle: {
    interlaced: false,
    optimizationLevel: 3,
  },
  jpegtran: {
    progressive: true,
  },
  optipng: {
    optimizationLevel: 7,
    bitDepthReduction: true,
    colorTypeReduction: true,
    paletteReduction: true,
    interlaced: null,
    errorRecovery: false,
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
```

### Example using `package.json`

```json
{
  "imagemin-lint-staged": {
    "gifsicle": {
      "interlaced": false,
      "optimizationLevel": 3
    },
    "jpegtran": {
      "progressive": true
    },
    "optipng": {
      "optimizationLevel": 7,
      "bitDepthReduction": true,
      "colorTypeReduction": true,
      "paletteReduction": true,
      "interlaced": null,
      "errorRecovery": false
    },
    "svgo": {
      "plugins": [
        {
          "name": "preset-default",
          "params": {
            "overrides": {
              "removeViewBox": false,
              "cleanupIds": false,
              "removeDesc": false
            }
          }
        }
      ]
    }
  }
}
```

### Example using `.imagemin-lint-stagedrc.json`

```json
{
  "optipng": {
    "optimizationLevel": 7,
    "bitDepthReduction": true,
    "colorTypeReduction": true,
    "paletteReduction": true,
    "interlaced": null,
    "errorRecovery": false
  },
  "svgo": {
    "plugins": [
      {
        "name": "preset-default",
        "params": {
          "overrides": {
            "removeViewBox": false,
            "cleanupIds": false,
            "removeDesc": false
          }
        }
      }
    ]
  }
}
```

### Example using `imagemin-lint-staged.config.mjs`

```js
export default {
  gifsicle: {
    interlaced: false,
    optimizationLevel: 3,
  },
  jpegtran: {
    progressive: true,
  },
  optipng: {
    optimizationLevel: 7,
    bitDepthReduction: true,
    colorTypeReduction: true,
    paletteReduction: true,
    interlaced: null,
    errorRecovery: false,
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
```

### Example using `imagemin-lint-staged.config.js` in an ESM project

When your project has `"type": "module"` in `package.json`, `.js` config files can use ESM syntax:

```js
export default {
  optipng: {
    optimizationLevel: 7,
  },
};
```

## Options

All options are optional. Each top-level key configures one imagemin plugin.

| Option | Plugin | Default |
| --- | --- | --- |
| `gifsicle` | [`imagemin-gifsicle`][imagemin-gifsicle] | `{ "interlaced": false, "optimizationLevel": 3 }` |
| `jpegtran` | [`imagemin-jpegtran`][imagemin-jpegtran] | `{ "progressive": true }` |
| `optipng` | [`imagemin-optipng`][imagemin-optipng] | `{ "optimizationLevel": 7, "bitDepthReduction": true, "colorTypeReduction": true, "paletteReduction": true, "interlaced": null, "errorRecovery": false }` |
| `svgo` | [`imagemin-svgo`][imagemin-svgo] | `preset-default` with `removeViewBox: false`, `cleanupIds: false`, and `removeDesc: false` |

The option object for each key is passed directly to the matching imagemin plugin.

### Default option details

* `gifsicle.interlaced` is set to `false` because interlacing can increase GIF file size. This does not reduce image quality; it only disables progressive-style loading for GIF files.
* `gifsicle.optimizationLevel` is set to `3`, the strongest optimisation level supported by gifsicle through this plugin. It tries more optimisation methods and is slower than lower levels, but usually gives smaller files.
* `jpegtran.progressive` is set to `true` because jpegtran can convert JPEG files to progressive JPEG losslessly. This keeps image data intact while often improving file size and loading behaviour.
* `optipng.optimizationLevel` is set to `7`, the strongest optimisation level exposed by this plugin. It is slower than the previous default of `5`, but performs more compression trials.
* `optipng.bitDepthReduction`, `optipng.colorTypeReduction`, and `optipng.paletteReduction` are enabled because these are lossless PNG reductions when optipng can prove that the resulting image remains equivalent.
* `optipng.interlaced` is set to `null` so optipng preserves the input file's interlace state. This avoids changing progressive-loading behaviour unless you explicitly configure it.
* `optipng.errorRecovery` is set to `false` so corrupt or invalid PNG files fail instead of being silently recovered during a pre-commit optimisation step.
* `svgo.removeViewBox` is disabled because removing `viewBox` can break SVG scaling.
* `svgo.cleanupIds` is disabled because renamed or minified IDs can cause collisions or broken references when SVGs are inlined, styled, scripted, or referenced externally.
* `svgo.removeDesc` is disabled so existing `<desc>` elements are preserved for accessibility and documentation context.

Important behaviour:

* If no configuration file is found, all defaults listed above are used.
* If a plugin key is missing, that plugin uses its package default listed above.
* If a plugin key is present, its value replaces the package default for that plugin. The configuration is not deep-merged.
* All four plugins are always loaded. The current implementation does not support disabling one plugin via configuration.
* Invalid options are not validated by this package. They are passed to the underlying imagemin plugin.

For plugin-specific options, refer to the individual plugin documentation linked in the table.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request


[lint-staged]: https://github.com/okonet/lint-staged
[cosmiconfig]: https://github.com/cosmiconfig/cosmiconfig
[imagemin-gifsicle]: https://github.com/imagemin/imagemin-gifsicle
[imagemin-jpegtran]: https://github.com/imagemin/imagemin-jpegtran
[imagemin-optipng]: https://github.com/imagemin/imagemin-optipng
[imagemin-svgo]: https://github.com/imagemin/imagemin-svgo
[npm-image]: https://img.shields.io/npm/v/imagemin-lint-staged.svg?style=flat-square
[npm-url]: https://www.npmjs.org/package/imagemin-lint-staged

[github-workflows-pr-image]: https://github.com/davidsneighbour/imagemin-lint-staged/actions/workflows/pr.yml/badge.svg
[github-workflows-pr-url]: https://github.com/davidsneighbour/imagemin-lint-staged/actions/workflows/pr.yml
