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

## Options

N/A


## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request


[lint-staged]: https://github.com/okonet/lint-staged
[npm-image]: https://img.shields.io/npm/v/imagemin-lint-staged.svg?style=flat-square
[npm-url]: https://www.npmjs.org/package/imagemin-lint-staged

[github-workflows-pr-image]: https://github.com/davidsneighbour/imagemin-lint-staged/actions/workflows/pr.yml/badge.svg
[github-workflows-pr-url]: https://github.com/davidsneighbour/imagemin-lint-staged/actions/workflows/pr.yml
