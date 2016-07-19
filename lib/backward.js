var deprecatedLog = require('./deprecated-log.js');

var backward = module.exports = {};

backward.getCssPaths = function(filepathArg, patternArg) {
    deprecatedLog('getCssPaths', 'getStylesPathsByFilepath');
    return this.getStylesPathsByFilepath(filepathArg, patternArg);
};

backward.getAllCssPath = function(patternArg) {
    deprecatedLog('getAllCssPath', 'getStylesSourcePathWithGlob');
    return this.getStylesSourcePathWithGlob(patternArg);
};

backward.getAllJsFile = function() {
    deprecatedLog('getAllJsFile', 'getScriptsSourcePath');
    return this.getScriptsSourcePath();
};

backward.getAllDistPath = function() {
    deprecatedLog('getAllDistPath', 'getPackagesDistPath');
    return this.getPackagesDistPath();
};

backward.getBuildJs = function() {
    deprecatedLog('getBuildJs', 'getScriptsToBuild');
    return this.getScriptsToBuild();
};

backward.getImagePaths = function() {
    deprecatedLog('getImagePaths', 'getImagesPaths');
    return this.getImagesPaths();
};

backward.getAllImagePaths = function(patternArg) {
    deprecatedLog('getAllImagePaths', 'getImagesSourcePathWithGlob');
    return this.getImagesSourcePathWithGlob(patternArg);
};

backward.getFontPaths = function() {
    deprecatedLog('getFontPaths', 'getFontsPaths');
    return this.getFontsPaths();
};
