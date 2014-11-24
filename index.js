'use strict';

/**
 * Requires
 */
var sh = require('execSync');
var minimatch = require('minimatch');
var _ = require('lodash');
var path = require('path');
var extend = require('extend');
var chalk = require('chalk');

/**
 * Defaults
 */
var defaults = {
    /**
     * Application path
     * @type {String}
     */
    applicationPath: 'protected',

    /**
     * Yii packages command
     * @type {String}
     */
    yiiPackagesCommand: 'yiic packages',

    /**
     * Verbose mode
     * @type {Boolean}
     */
    verbose: false
};

/**
 * Data
 * @type {Object}
 */
var data = {
    packages: {},

    packagesDistPath: [],
    packagesDistPathWithoutImageDir: [],

    stylesPaths: [],
    stylesSourcePath: [],

    scriptsSourcePath: [],
    scriptsToBuild: [],

    imagesPaths: [],
    imagesSourcePath: [],

    fontsPaths: [],

    extraParams: {}
};

/**
 * Get dirname
 * @return {String}
 */
function getDirname() {
    var s1 = __dirname;
    var s2 = process.cwd();
    var dirname = '';

    for (var i = 0, l = s1.length; i < l; i++) {
        if (s1[i] === s2[i]) {
            dirname += s1[i];
        } else {
            break;
        }
    }

    if (dirname.substr(-1) !== path.sep) {
        dirname += path.sep;
    }

    return dirname;
}

/**
 * Process patterns
 * @param  {Array}   patterns
 * @param  {Function} fn
 * @return {Array}
 */
function processPatterns(patterns, fn) {
    var result = [];

    _.flatten(patterns).forEach(function(pattern) {
        var exclusion = pattern.indexOf('!') === 0;
        if (exclusion) {
            pattern = pattern.slice(1);
        }
        var matches = fn(pattern);
        if (exclusion) {
            result = _.difference(result, matches);
        } else {
            result = _.union(result, matches);
        }
    });

    return result;
}

/**
 * Deprecated log
 * @param {String} deprecatedFunctionName
 * @param {String} functionName
 */
function deprecatedLog(deprecatedFunctionName, functionName) {
    console.log(chalk.red('This ' + deprecatedFunctionName + ' method was deprecated and will be removed in 2.1. ') + chalk.green('Use ' + functionName + ' instead.'));
}

/**
 * Get packages
 */
var getPackages = function() {};

/**
 * Init
 * @param  {Object|String} options
 * @return {Object}
 */
getPackages.prototype.init = function(options) {
    if (typeof options === 'string') {
        defaults.applicationPath = options;
    } else if (typeof options === 'object') {
        defaults = extend(true, {}, defaults, options);
    }

    var command = path.join(getDirname(), defaults.applicationPath, defaults.yiiPackagesCommand);
    var packages = sh.exec(command);

    if (packages.code > 0) {
        if (defaults.verbose) {
            console.log('Error code: ' + packages.code);
            console.log('yiic packages error: \n' + packages.stdout);
        }
    } else {
        data.packages = JSON.parse(packages.stdout).packages;
        this.build();
    }

    return this;
};

/**
 * Build
 */
getPackages.prototype.build = function() {
    for (var i = 0, l = data.packages.length; i < l; i++) {
        var currentItem = data.packages[i];

        data.packagesDistPath.push(currentItem.dist);

        if (currentItem.imgPath) {
            data.packagesDistPathWithoutImageDir.push(path.join(currentItem.dist, '*'));
            data.packagesDistPathWithoutImageDir.push(path.join('!', currentItem.dist, currentItem.imgPath));
        }

        if (currentItem.cssfiles) {
            if (Array.isArray(currentItem.cssfiles[0].sources)) {
                var sources = currentItem.cssfiles[0].sources[0];
                if (currentItem.cssfiles[0].sources.length > 1) {
                    sources = '{' + currentItem.cssfiles[0].sources.join(',') + '}';
                }
                currentItem.cssfiles[0].sources = path.join(currentItem.sources, sources);
            }

            currentItem.cssfiles[0].module = currentItem.module;

            data.stylesSourcePath.push(currentItem.cssfiles[0].sources);
            data.stylesPaths.push(currentItem.cssfiles[0]);
        }

        if (currentItem.jsfiles) {
            data.scriptsSourcePath = data.scriptsSourcePath.concat(currentItem.jsfiles[0].sources);

            var concatFilename = path.basename(currentItem.jsfiles[0].dist);

            data.scriptsToBuild.push({
                'module': currentItem.module,
                'sources': currentItem.jsfiles[0].sources,
                'dest': currentItem.jsfiles[0].dist.replace(concatFilename, ''),
                'concatFilename': concatFilename
            });
        }

        if (currentItem.imgPath) {
            data.imagesPaths.push({
                'module': currentItem.module,
                'sources': path.join(currentItem.sources, currentItem.imgPath),
                'dest': path.join(currentItem.dist, currentItem.imgPath)
            });

            data.imagesSourcePath.push(currentItem.sources, currentItem.imgPath);
        }

        if (currentItem.fontPath) {
            data.fontsPaths.push({
                'module': currentItem.module,
                'sources': path.join(currentItem.sources, currentItem.fontPath),
                'dest': path.join(currentItem.dist, currentItem.fontPath)
            });
        }

        if (currentItem.extraParams) {
            data.extraParams[currentItem.module] = currentItem.extraParams;
        }
    }
};

/**
 * Get
 * @return {Object}
 */
getPackages.prototype.get = function() {
    return data.packages;
};

/**
 * Get extra params by module
 * @return {Object|Boolean}
 */
getPackages.prototype.getExtraParamsByModule = function(module) {
    if (data.extraParams[module]) {
        return data.extraParams[module];
    }
    return false;
};

/**
 * Get packages dist path
 * @return {Array}
 */
getPackages.prototype.getPackagesDistPath = function() {
    return data.packagesDistPath;
};

/**
 * Get packages dist path without image directory
 * @return {Array}
 */
getPackages.prototype.getPackagesDistPathWithoutImageDir = function() {
    return data.packagesDistPathWithoutImageDir;
};

/**
 * Get styles paths
 * @return {Array}
 */
getPackages.prototype.getStylesPaths = function() {
    return data.stylesPaths;
};

/**
 * Get styles paths by file path
 * @param  {String} filepath
 * @param  {String} glob
 * @return {Array}
 */
getPackages.prototype.getStylesPathsByFilepath = function(filepath, glob) {
    glob = glob || path.join('**', '*.{scss,sass}');
    if (filepath) {
        var rs = [];
        for (var i = 0, l = data.stylesPaths.length; i < l; i++) {
            if (minimatch(filepath, path.join(data.stylesPaths[i].sources, glob))) {
                rs.push(data.stylesPaths[i]);
            }
        }
        return rs;
    }
    return data.stylesPaths;
};

/**
 * Get styles source path
 * @return {Array}
 */
getPackages.prototype.getStylesSourcePath = function() {
    return data.stylesSourcePath;
};

/**
 * Get styles source path with glob
 * @param  {String} glob
 * @return {Array}
 */
getPackages.prototype.getStylesSourcePathWithGlob = function(glob) {
    glob = glob || path.join('**', '*.{scss,sass}');
    var rs = [];
    for (var i = 0, l = data.stylesSourcePath.length; i < l; i++) {
        rs.push(path.join(data.stylesSourcePath[i], glob));
    }
    return rs;
};

/**
 * Get scripts source path
 * @return {Array}
 */
getPackages.prototype.getScriptsSourcePath = function() {
    return data.scriptsSourcePath;
};

/**
 * Get scripts to build
 * @return {Array}
 */
getPackages.prototype.getScriptsToBuild = function() {
    return data.scriptsToBuild;
};

/**
 * Get images paths
 * @return {Array}
 */
getPackages.prototype.getImagesPaths = function() {
    return data.imagesPaths;
};

/**
 * Get images source path
 * @return {Array}
 */
getPackages.prototype.getImagesSourcePath = function() {
    return data.imagesSourcePath;
};

/**
 * Get images source path with glob
 * @param  {String} glob
 * @return {Array}
 */
getPackages.prototype.getImagesSourcePathWithGlob = function(glob) {
    glob = glob || path.join('**', '*.{png,jpg,jpeg,gif}');
    var rs = [];
    for (var i = 0, l = data.imagesSourcePath.length; i < l; i++) {
        rs.push(path.join(this.imagesSourcePath[i], glob));
    }
    return rs;
};

/**
 * Get fonts paths
 * @return {Array}
 */
getPackages.prototype.getFontsPaths = function() {
    return data.fontsPaths;
};

// ****************************************
// BACKWARD COMPATIBLE METHODS
// ****************************************

/**
 * Utilities object
 * @type {Object}
 */
getPackages.prototype.util = {};

/**
 * Get css paths
 * @return {Array}
 */
getPackages.prototype.getCssPaths = function(filepath, glob) {
    deprecatedLog('getCssPaths', 'getStylesPathsByFilepath');
    return this.getStylesPathsByFilepath(filepath, glob);
};

/**
 * Get all css paths
 * @param  {String} glob
 * @return {Array}
 */
getPackages.prototype.getAllCssPath = function(glob) {
    deprecatedLog('getAllCssPath', 'getStylesSourcePathWithGlob');
    return this.getStylesSourcePathWithGlob(glob);
};

/**
 * Get all js file
 * @return {Array}
 */
getPackages.prototype.getAllJsFile = function() {
    deprecatedLog('getAllJsFile', 'getScriptsSourcePath');
    return this.getScriptsSourcePath();
};

/**
 * Get all dist path
 * @return {Array}
 */
getPackages.prototype.getAllDistPath = function() {
    deprecatedLog('getAllDistPath', 'getPackagesDistPath');
    return this.getPackagesDistPath();
};

/**
 * Get build js
 * @return {Array}
 */
getPackages.prototype.getBuildJs = function() {
    deprecatedLog('getBuildJs', 'getScriptsToBuild');
    return this.getScriptsToBuild();
};

/**
 * Get image paths
 * @return {Array}
 */
getPackages.prototype.getImagePaths = function() {
    deprecatedLog('getImagePaths', 'getImagesPaths');
    return this.getImagesPaths();
};

/**
 * Get all image paths
 * @param  {String} glob
 * @return {Array}
 */
getPackages.prototype.getAllImagePaths = function(glob) {
    deprecatedLog('getAllImagePaths', 'getImagesSourcePathWithGlob');
    return this.getImagesSourcePathWithGlob(glob);
};

/**
 * Get font paths
 * @return {Array}
 */
getPackages.prototype.getFontPaths = function() {
    deprecatedLog('getFontPaths', 'getFontsPaths');
    return this.getFontsPaths();
};

/**
 * Match
 * @param  {Array} filepaths
 * @param  {Array} patterns
 * @param  {Object} options
 * @return {Array}
 */
getPackages.prototype.util.match = function(filepaths, patterns, options) {
    if (typeof filepaths === 'undefined' || typeof patterns === 'undefined') {
        return [];
    }

    if (!Array.isArray(filepaths)) {
        filepaths = [filepaths];
    }

    if (!Array.isArray(patterns)) {
        patterns = [patterns];
    }

    if (patterns.length === 0 || filepaths.length === 0) {
        return [];
    }

    return processPatterns(patterns, function(pattern) {
        return minimatch.match(filepaths, pattern, options);
    });
};

module.exports = new getPackages();
