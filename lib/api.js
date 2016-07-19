var path = require('path');
var minimatch = require('minimatch');
var build = require('./build.js');
var deprecatedLog = require('./deprecated-log.js');

var api = {};
var data = {};

module.exports = function(packages) {
    data = build(packages);

    return api;
};

api.get = function() {
    return data.packages;
};

api.getExtraParamsByModule = function(moduleArg) {
    if (data.extraParams[moduleArg]) {
        return data.extraParams[moduleArg];
    }

    return false;
};

api.getPackagesDistPath = function() {
    return data.packagesDistPath;
};

api.getPackagesDistPathWithoutImageDir = function() {
    return data.packagesDistPathWithoutImageDir;
};

api.getStylesPaths = function() {
    return data.stylesPaths;
};

api.getStylesPathsByFilepath = function(filepath, pattern) {
    pattern = pattern || path.join('**', '*.{scss,sass}');

    if (filepath) {
        var rs = [];

        for (var i = 0, l = data.stylesPaths.length; i < l; i++) {
            if (minimatch(filepath, path.join(data.stylesPaths[i].sources, pattern))) {
                rs.push(data.stylesPaths[i]);
            }
        }

        return rs;
    }

    return data.stylesPaths;
};

api.getStylesSourcePath = function() {
    return data.stylesSourcePath;
};

api.getStylesSourcePathWithGlob = function(pattern) {
    var rs = [];

    pattern = pattern || path.join('**', '*.{scss,sass}');

    for (var i = 0, l = data.stylesSourcePath.length; i < l; i++) {
        rs.push(path.join(data.stylesSourcePath[i], pattern));
    }

    return rs;
};

api.getScriptsSourcePath = function() {
    return data.scriptsSourcePath;
};

api.getScriptsSourcePathWithoutFile = function() {
    return data.scriptsSourcePathWithoutFile;
};

api.getScriptsToBuild = function() {
    return data.scriptsToBuild;
};

api.getImagesPaths = function() {
    return data.imagesPaths;
};

api.getImagesSourcePath = function() {
    return data.imagesSourcePath;
};

api.getImagesSourcePathWithGlob = function(pattern) {
    var rs = [];

    pattern = pattern || path.join('**', '*.{png,jpg,jpeg,gif}');

    for (var i = 0, l = data.imagesSourcePath.length; i < l; i++) {
        rs.push(path.join(data.imagesSourcePath[i], pattern));
    }

    return rs;
};

api.getFontsPaths = function() {
    return data.fontsPaths;
};

// ****************************************
// BACKWARD COMPATIBLE METHODS
// ****************************************

api.getCssPaths = function(filepathArg, patternArg) {
    deprecatedLog('getCssPaths', 'getStylesPathsByFilepath');
    return this.getStylesPathsByFilepath(filepathArg, patternArg);
};

api.getAllCssPath = function(patternArg) {
    deprecatedLog('getAllCssPath', 'getStylesSourcePathWithGlob');
    return this.getStylesSourcePathWithGlob(patternArg);
};

api.getAllJsFile = function() {
    deprecatedLog('getAllJsFile', 'getScriptsSourcePath');
    return this.getScriptsSourcePath();
};

api.getAllDistPath = function() {
    deprecatedLog('getAllDistPath', 'getPackagesDistPath');
    return this.getPackagesDistPath();
};

api.getBuildJs = function() {
    deprecatedLog('getBuildJs', 'getScriptsToBuild');
    return this.getScriptsToBuild();
};

api.getImagePaths = function() {
    deprecatedLog('getImagePaths', 'getImagesPaths');
    return this.getImagesPaths();
};

api.getAllImagePaths = function(patternArg) {
    deprecatedLog('getAllImagePaths', 'getImagesSourcePathWithGlob');
    return this.getImagesSourcePathWithGlob(patternArg);
};

api.getFontPaths = function() {
    deprecatedLog('getFontPaths', 'getFontsPaths');
    return this.getFontsPaths();
};
