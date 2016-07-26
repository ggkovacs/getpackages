'use strict';

var path = require('path');
var extend = require('extend');
var minimatch = require('minimatch');
var util = require('./lib/util.js');
var packages = require('./lib/packages.js');
var builder = require('./lib/builder.js');
var getDirname = require('./lib/dirname.js');
var deprecatedLog = require('./lib/deprecated-log.js');

var defaults = {
    applicationPath: 'protected',
    yiiPackagesCommand: 'yiic packages',
    isAbsoluteCommandPath: true,
    verbose: false
};

var getPackages = module.exports = {};
var data = {};

getPackages.init = function(options) {
    if (typeof options === 'string') {
        defaults.applicationPath = options;
    } else if (typeof options === 'object') {
        defaults = extend(true, {}, defaults, options);
    }

    var command = '';

    if (defaults.isAbsoluteCommandPath) {
        command = getDirname();
    }

    command = path.join(command, defaults.applicationPath, defaults.yiiPackagesCommand);

    data = builder(packages(command, defaults));

    getPackages.util = util;

    return getPackages;
};

getPackages.get = function() {
    return data.packages;
};

getPackages.getExtraParamsByModule = function(moduleArg) {
    if (data.extraParams[moduleArg]) {
        return data.extraParams[moduleArg];
    }

    return false;
};

getPackages.getPackagesDistPath = function() {
    return data.packagesDistPath;
};

getPackages.getPackagesDistPathWithoutImageDir = function() {
    return data.packagesDistPathWithoutImageDir;
};

getPackages.getStylesPaths = function() {
    return data.stylesPaths;
};

getPackages.getStylesPathsByFilepath = function(filepath, pattern) {
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

getPackages.getStylesSourcePath = function() {
    return data.stylesSourcePath;
};

getPackages.getStylesSourcePathWithGlob = function(pattern) {
    var rs = [];

    pattern = pattern || path.join('**', '*.{scss,sass}');

    for (var i = 0, l = data.stylesSourcePath.length; i < l; i++) {
        rs.push(path.join(data.stylesSourcePath[i], pattern));
    }

    return rs;
};

getPackages.getScriptsSourcePath = function() {
    return data.scriptsSourcePath;
};

getPackages.getScriptsSourcePathWithoutFile = function() {
    return data.scriptsSourcePathWithoutFile;
};

getPackages.getScriptsSourcePathWithGlob = function(pattern) {
    var rs = [];

    pattern = pattern || path.join('**', '*.js');

    for (var i = 0, l = data.scriptsSourcePathWithoutFile.length; i < l; i++) {
        rs.push(path.join(data.scriptsSourcePathWithoutFile[i], pattern));
    }

    return rs;
};

getPackages.getScriptsToBuild = function() {
    return data.scriptsToBuild;
};

getPackages.getImagesPaths = function() {
    return data.imagesPaths;
};

getPackages.getImagesSourcePath = function() {
    return data.imagesSourcePath;
};

getPackages.getImagesSourcePathWithGlob = function(pattern) {
    var rs = [];

    pattern = pattern || path.join('**', '*.{png,jpg,jpeg,gif}');

    for (var i = 0, l = data.imagesSourcePath.length; i < l; i++) {
        rs.push(path.join(data.imagesSourcePath[i], pattern));
    }

    return rs;
};

getPackages.getFontsPaths = function() {
    return data.fontsPaths;
};

// ****************************************
// BACKWARD COMPATIBLE METHODS
// ****************************************

getPackages.getCssPaths = function(filepathArg, patternArg) {
    deprecatedLog('getCssPaths', 'getStylesPathsByFilepath');
    return this.getStylesPathsByFilepath(filepathArg, patternArg);
};

getPackages.getAllCssPath = function(patternArg) {
    deprecatedLog('getAllCssPath', 'getStylesSourcePathWithGlob');
    return this.getStylesSourcePathWithGlob(patternArg);
};

getPackages.getAllJsFile = function() {
    deprecatedLog('getAllJsFile', 'getScriptsSourcePath');
    return this.getScriptsSourcePath();
};

getPackages.getAllDistPath = function() {
    deprecatedLog('getAllDistPath', 'getPackagesDistPath');
    return this.getPackagesDistPath();
};

getPackages.getBuildJs = function() {
    deprecatedLog('getBuildJs', 'getScriptsToBuild');
    return this.getScriptsToBuild();
};

getPackages.getImagePaths = function() {
    deprecatedLog('getImagePaths', 'getImagesPaths');
    return this.getImagesPaths();
};

getPackages.getAllImagePaths = function(patternArg) {
    deprecatedLog('getAllImagePaths', 'getImagesSourcePathWithGlob');
    return this.getImagesSourcePathWithGlob(patternArg);
};

getPackages.getFontPaths = function() {
    deprecatedLog('getFontPaths', 'getFontsPaths');
    return this.getFontsPaths();
};
