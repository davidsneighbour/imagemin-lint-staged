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

With the current implementation, configuration is searched from the current working directory. For normal `lint-staged` usage this is usually the repository root, because `lint-staged` is run from there.

Supported configuration locations include:

* `package.json`, using the `imagemin-lint-staged` property
* `.imagemin-lint-stagedrc`
* `.imagemin-lint-stagedrc.json`
* `.imagemin-lint-stagedrc.yaml`
* `.imagemin-lint-stagedrc.yml`
* `.imagemin-lint-stagedrc.js`
* `.imagemin-lint-stagedrc.ts`
* `.imagemin-lint-stagedrc.cjs`
* `.config/imagemin-lint-stagedrc`
* `.config/imagemin-lint-stagedrc.json`
* `.config/imagemin-lint-stagedrc.yaml`
* `.config/imagemin-lint-stagedrc.yml`
* `.config/imagemin-lint-stagedrc.js`
* `.config/imagemin-lint-stagedrc.ts`
* `.config/imagemin-lint-stagedrc.cjs`
* `imagemin-lint-staged.config.js`
* `imagemin-lint-staged.config.ts`
* `imagemin-lint-staged.config.cjs`

The package uses cosmiconfig's synchronous API, so `.mjs` configuration files are not supported. If your project uses `"type": "module"`, prefer JSON/YAML configuration or a `.cjs` config file to avoid module format ambiguity.

### Example using `package.json`

```json
{
  "imagemin-lint-staged": {
    "gifsicle": {
      "interlaced": true
    },
    "jpegtran": {
      "progressive": true
    },
    "optipng": {
      "optimizationLevel": 5
    },
    "svgo": {
      "plugins": [
        {
          "name": "preset-default",
          "params": {
            "overrides": {
              "removeViewBox": false
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
    "optimizationLevel": 7
  },
  "svgo": {
    "plugins": [
      {
        "name": "preset-default",
        "params": {
          "overrides": {
            "removeViewBox": false,
            "cleanupIds": false
          }
        }
      }
    ]
  }
}
```

### Example using `imagemin-lint-staged.config.cjs`

```js
module.exports = {
  gifsicle: {
    interlaced: false,
  },
  jpegtran: {
    progressive: true,
  },
  optipng: {
    optimizationLevel: 7,
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
```

## Options

All options are optional. Each top-level key configures one imagemin plugin.

| Option | Plugin | Default |
| --- | --- | --- |
| `gifsicle` | [`imagemin-gifsicle`][imagemin-gifsicle] | `{ "interlaced": true }` |
| `jpegtran` | [`imagemin-jpegtran`][imagemin-jpegtran] | `{ "progressive": true }` |
| `optipng` | [`imagemin-optipng`][imagemin-optipng] | `{ "optimizationLevel": 5 }` |
| `svgo` | [`imagemin-svgo`][imagemin-svgo] | `preset-default` with `removeViewBox: false` |

The option object for each key is passed directly to the matching imagemin plugin.

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
