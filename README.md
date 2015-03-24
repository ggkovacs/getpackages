# Get packages
Version: **3.0.0**

Node.js requirement: **>= 0.12**

Yii 1/2 Packages command Node.js wrapper

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
    isAbsoluteCommandPath: true,
}
```

- `applicationPath` (String)
- `yiiPackagesCommand` (String)
- `isAbsoluteCommandPath` (Boolean)

### Methods

- gp.init(options)
- gp.build()
- gp.get()
- gp.getPackagesDistPath()
- gp.getPackagesDistPathWithoutImageDir()
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
- gp.getExtraParamsByModule(module)

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
MIT (c) 2015 Gergely Kovács (gg.kovacs@gmail.com)
