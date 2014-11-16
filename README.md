# Get packages
Version: **2.0.0**

Yii Packages command Node.js wrapper

## Installation

Run `npm install get-packages`

## Usage
```javascript
var gp = require('get-packages').init();
```

## API

### Options

Type: `Object | Null`

Default:
```js
{
    applicationPath: 'protected',
    yiiPackagesCommand: 'yiic packages',
    verbose: false,
}
```

- `applicationPath` (String)
- `yiiPackagesCommand` (String)
- `verbose` (Boolean)

### Methods

- gp.init(options)
- gp.build()
- gp.get()
- gp.getPackagesDistPath()
- gp.getStylesPaths()
- gp.getStylesPathsByFilepath(filepath, glob)
- gp.getStylesSourcePath()
- gp.getStylesSourcePathWithGlob(glob)
- gp.getScriptsSourcePath()
- gp.getScriptsToBuild()
- gp.getImagesPaths()
- gp.getImagesSourcePath()
- gp.getImagesSourcePathWithGlob(glob)
- gp.getFontsPaths()
- gp.getExtrasByModule(module)


### Backward compatible methods

This methods were deprecated and will be removed in 2.1.

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
* Yii Packages command

# License
MIT (c) 2014 Gergely Kovács (gg.kovacs@gmail.com)
