'use strict';

/**
 * Requires
 */
var sh = require('execSync');
var minimatch = require('minimatch');
var _ = require('lodash');
var path = require('path');
var extend = require('extend');

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
 * Get packages
 * @type {Object}
 */
var gp = {
    packages: {},

    packagesDistPath: [],

    stylesPaths: [],
    stylesSourcePath: [],

    scriptsSourcePath: [],
    scriptsToBuild: [],

    imagesPaths: [],
    imagesSourcePath: [],

    fontsPaths: []
}

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
};

/**
 * Get packages
 * @param  {Object} options
 * @return {Object}
 */
function getPackages(options) {
    if (typeof config === 'string') {
        defaults.applicationPath = config;
    } else if (typeof config === 'object') {
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
        gp.packages = JSON.parse(packages.stdout).packages;
        this.build();
    }

    return this;
}

/**
 * Build
 */
getPackages.prototype.build = function() {
    for (var i = 0, l = gp.packages.length; i < l; i++) {
        var currentItem = gp.packages[i];

        if (currentItem.cssfiles) {
            if (Array.isArray(currentItem.cssfiles[0].sources)) {
                var sources = currentItem.cssfiles[0].sources[0];
                if (currentItem.cssfiles[0].sources.length > 1) {
                    sources = '{' + currentItem.cssfiles[0].sources.join(',') + '}';
                }
                currentItem.cssfiles[0].sources = path.join(currentItem.sources, sources);
            }

            currentItem.cssfiles[0].module = currentItem.module;

            gp.stylesSourcePath.push(currentItem.cssfiles[0].sources);
            gp.stylesPaths.push(currentItem.cssfiles[0]);
        }

        if (currentItem.jsfiles) {
            gp.scriptsSourcePath = gp.scriptsSourcePath.concat(currentItem.jsfiles[0].sources);

            var concatFilename = path.basename(currentItem.jsfiles[0].dist);

            this.scriptsToBuild.push({
                'module': currentItem.module,
                'sources': currentItem.jsfiles[0].sources,
                'dest': currentItem.jsfiles[0].dist.replace(concatFilename, ''),
                'concatFilename': concatFilename
            });
        }

        if (currentItem.imgPath) {
            gp.imagesPaths.push({
                'module': currentItem.module,
                'sources': path.join(currentItem.sources, currentItem.imgPath),
                'dest': path.join(currentItem.dist, currentItem.imgPath)
            });

            gp.imagesSourcePath.push(currentItem.sources, currentItem.imgPath);
        }

        if (currentItem.fontPath) {
            gp.fontsPaths.push({
                'module': currentItem.module,
                'sources': path.join(currentItem.sources, currentItem.fontPath),
                'dest': path.join(currentItem.dist, currentItem.fontPath)
            });
        }
    }
}

/**
 * Get
 * @return {Object}
 */
getPackages.prototype.get = function() {
    return gp.packages;
}

/**
 * Get packages dist path
 * @return {Array}
 */
getPackages.prototype.getPackagesDistPath = function() {
    return gp.packagesDistPath;
}

/**
 * Get styles paths
 * @return {Array}
 */
getPackages.prototype.getStylesPaths = function() {
    return gp.stylesPaths;
}

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
        for (var i = 0, l = gp.stylesPaths.length; i < l; i++) {
            if (minimatch(filepath, path.join(gp.stylesPaths[i].sources, glob))) {
                rs.push(gp.stylesPaths[i]);
            }
        }
        return rs;
    }
    return gp.stylesPaths;
}

/**
 * Get styles source path
 * @return {Array}
 */
getPackages.prototype.getStylesSourcePath = function() {
    return gp.stylesSourcePath;
}

/**
 * Get styles source path with glob
 * @param  {String} glob
 * @return {Array}
 */
getPackages.prototype.getStylesSourcePathWithGlob = function(glob) {
    glob = glob || path.join('**', '*.{scss,sass}');
    var rs = [];
    for (var i = 0, l = gp.stylesSourcePath.length; i < l; i++) {
        rs.push(path.join(gp.stylesSourcePath[i], glob));
    }
    return rs;
}

/**
 * Get scripts source path
 * @return {Array}
 */
getPackages.prototype.getScriptsSourcePath = function() {
    return gp.scriptsSourcePath;
}

/**
 * Get scripts to build
 * @return {Array}
 */
getPackages.prototype.getScriptsToBuild = function() {
    return gp.scriptsToBuild;
}

/**
 * Get images paths
 * @return {Array}
 */
getPackages.prototype.getImagesPaths = function() {
    return gp.imagesPaths;
}

/**
 * Get images source path
 * @return {Array}
 */
getPackages.prototype.getImagesSourcePath = function() {
    return gp.imagesSourcePath;
}

/**
 * Get images source path with glob
 * @param  {String} glob
 * @return {Array}
 */
getPackages.prototype.getImagesSourcePathWithGlob = function(glob) {
    glob = glob || path.join('**', '*.{png,jpg,jpeg,gif}');
    var rs = [];
    for (var i = 0, l = gp.imagesSourcePath.length; i < l; i++) {
        rs.push(path.join(this.imagesSourcePath[i], glob));
    }
    return rs;
}

/**
 * Get fonts paths
 * @return {Array}
 */
getPackages.prototype.getFontsPaths = function() {
    return gp.fontsPaths;
}

module.exports = getPackages;
