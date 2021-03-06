# Get packages [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
Version: **6.0.4**

Yii 1/2 Packages command Node.js wrapper

## Installation

Run `npm install get-packages`

## Usage
```javascript
var gp = require('get-packages').init();
```

## API

### gp.init([options])

#### Options

Type: `String` | `Object`

##### options.applicationPath

- Type: `String`
- Default: `protected`

##### options.yiiPackagesCommand

- Type: `String`
- Default: `yiic packages`

##### options.isAbsoluteCommandPath

- Type: `Boolean`
- Default: `true`

##### options.verbose

- Type: `Boolean`
- Default: `false`

### Methods

- gp.init(options)
- gp.get()
- gp.getPackagesDistPath()
- gp.getPackagesDistPathWithoutImageDir()
- gp.getStylesPaths()
- gp.getStylesPathsByFilepath(filepath, glob)
- gp.getStylesSourcePath()
- gp.getStylesSourcePathWithGlob(glob)
- gp.getScriptsSourcePath()
- gp.getScriptsSourcePathWithoutFile()
- gp.getScriptsSourcePathWithGlob(glob)
- gp.getScriptsSourcePathBeforeTranspiling()
- gp.getScriptsSourcePathBeforeTranspilingWithGlob(glob)
- gp.getScriptsToBuild()
- gp.getScriptsToTranspiling()
- gp.getImagesPaths()
- gp.getImagesSourcePath()
- gp.getImagesSourcePathWithGlob(glob)
- gp.getFontsPaths()
- gp.getOtherPaths()
- gp.getExtraParamsByModule(module)
- gp.getCustomPaths(key)
- gp.getCustomPathsWithGlob(key)

### Backward compatible methods

- gp.getCssPaths(filepath, glob)
- gp.getAllCssPath(glob)
- gp.getAllJsFile()
- gp.getAllDistPaths()
- gp.getBuildJs()
- gp.getImagePaths()
- gp.getAllImagePaths(glob)
- gp.getFontPaths()

#### Utilities
* gp.util.match(filepaths, patterns, options)

## Requirement
* Yii 1/2 Packages command

# License
MIT © 2021 Gergely Kovács (gg.kovacs@gmail.com)

[npm-image]: https://badge.fury.io/js/get-packages.svg
[npm-url]: https://npmjs.org/package/get-packages
[travis-image]: https://travis-ci.com/ggkovacs/getpackages.svg?branch=master
[travis-url]: https://travis-ci.com/ggkovacs/getpackages
[daviddm-image]: https://david-dm.org/ggkovacs/getpackages.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ggkovacs/getpackages
