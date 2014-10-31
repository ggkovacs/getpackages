/**
 * Get packages
 */
(function(undefined) {
    'use strict';

    /**
     * Requires
     */
    var sh = require('execSync');
    var minimatch = require('minimatch');
    var _ = require('lodash');
    var path = require('path');

    /**
     * Init get packages
     * @type {Object}
     */
    var gp = {
        packages: {},
        cssPaths: [],
        cssSrcPaths: [],
        jsSrcFiles: [],
        distPaths: [],
        imgPaths: [],
        fontPaths: [],
        jsToBuild: []
    };

    /**
     * Defaults
     */
    var DEFAULTS = {
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
         * Debug mode
         * @type {Boolean}
         */
        debug: false
    };

    /**
     * Get dirname
     * @return {String}
     */
    var getDirname = function() {
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
     * Process patterns
     * @param  {Array}   patterns
     * @param  {Function} fn
     * @return {Array}
     */
    var processPatterns = function(patterns, fn) {
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
    };

    /**
     * Init utilities
     * @type {Object}
     */
    gp.util = {};

    /**
     * Init
     * @param  {String|Object} config
     * @return {Object}
     */
    gp.init = function(config) {
        if (typeof config === 'string') {
            DEFAULTS.applicationPath = config;
        } else if (typeof config === 'object') {
            if (config.applicationPath !== undefined) {
                DEFAULTS.applicationPath = config.applicationPath;
            }
            if (config.yiiPackagesCommand !== undefined) {
                DEFAULTS.yiiPackagesCommand = config.yiiPackagesCommand;
            }
            if (config.debug !== undefined) {
                DEFAULTS.debug = config.debug;
            }
        }

        var command = path.join(getDirname(), DEFAULTS.applicationPath, DEFAULTS.yiiPackagesCommand);
        var packages = sh.exec(command);

        if (packages.code > 0) {
            if (DEFAULTS.debug) {
                console.log('Error code: ' + packages.code);
                console.log('yiic packages error: \n' + packages.stdout);
            }
        } else {
            this.packages = JSON.parse(packages.stdout).packages;
            this.build();
        }

        return this;
    };

    /**
     * Build
     */
    gp.build = function() {
        for (var i = 0, l = this.packages.length; i < l; i++) {
            var currentItem = this.packages[i];

            this.distPaths.push(currentItem.dist);

            if (currentItem.cssfiles !== undefined) {
                if (Array.isArray(currentItem.cssfiles[0].sources)) {
                    var sources = currentItem.cssfiles[0].sources[0];
                    if (currentItem.cssfiles[0].sources.length > 1) {
                        sources = '{' + currentItem.cssfiles[0].sources.join(',') + '}';
                    }

                    currentItem.cssfiles[0].sources = path.join(currentItem.sources, sources);
                    this.cssSrcPaths.push(currentItem.cssfiles[0].sources);
                    this.cssPaths.push(currentItem.cssfiles[0]);
                } else {
                    this.cssSrcPaths.push(currentItem.cssfiles[0].sources);
                    this.cssPaths.push(currentItem.cssfiles[0]);
                }
            }

            if (currentItem.jsfiles !== undefined) {
                this.jsSrcFiles = this.jsSrcFiles.concat(currentItem.jsfiles[0].sources);
                var concatFilename = path.basename(currentItem.jsfiles[0].dist);
                this.jsToBuild.push({
                    'sources': currentItem.jsfiles[0].sources,
                    'dest': currentItem.jsfiles[0].dist.replace(concatFilename, ''),
                    'concatFilename': concatFilename
                });
            }

            if (currentItem.imgPath !== undefined) {
                this.imgPaths.push({
                    'sources': path.join(currentItem.sources, currentItem.imgPath),
                    'dest': path.join(currentItem.dist, currentItem.imgPath)
                });
            }

            if (currentItem.fontPath !== undefined) {
                this.fontPaths.push({
                    'sources': path.join(currentItem.sources, currentItem.fontPath),
                    'dest': path.join(currentItem.dist, currentItem.fontPath)
                });
            }
        }
    };

    /**
     * Get
     * @return {Object}
     */
    gp.get = function() {
        return this.packages;
    };

    /**
     * Get css paths
     * @return {Array}
     */
    gp.getCssPaths = function(filepath, glob) {
        glob = glob || path.join('**', '*.{scss,sass}');
        if (filepath) {
            var rs = [];
            for (var i = 0, l = this.cssPaths.length; i < l; i++) {
                if (minimatch(filepath, path.join(this.cssPaths[i].sources, glob))) {
                    rs.push(this.cssPaths[i]);
                }
            }
            return rs;
        }
        return this.cssPaths;
    };

    /**
     * Get all css paths
     * @param  {String} glob
     * @return {Array}
     */
    gp.getAllCssPath = function(glob) {
        glob = glob || path.join('**', '*.{scss,sass}');
        var rs = [];
        for (var i = 0, l = this.cssSrcPaths.length; i < l; i++) {
            rs.push(path.join(this.cssSrcPaths[i], glob));
        }
        return rs;
    };

    /**
     * Get all js file
     * @return {Array}
     */
    gp.getAllJsFile = function() {
        return this.jsSrcFiles;
    };

    /**
     * Get all dist path
     * @return {Array}
     */
    gp.getAllDistPath = function() {
        return this.distPaths;
    };

    /**
     * Get build js
     * @return {Array}
     */
    gp.getBuildJs = function() {
        return this.jsToBuild;
    };

    /**
     * Get image paths
     * @return {Array}
     */
    gp.getImagePaths = function() {
        return this.imgPaths;
    };

    /**
     * Get all image paths
     * @param  {String} glob
     * @return {Array}
     */
    gp.getAllImagePaths = function(glob) {
        glob = glob || path.join('**', '*.{png,jpg,jpeg,gif}');
        var rs = [];
        for (var i = 0, l = this.imgPaths.length; i < l; i++) {
            rs.push(path.join(this.imgPaths[i].sources, glob));
        }
        return rs;
    };

    /**
     * Get font paths
     * @return {Array}
     */
    gp.getFontPaths = function() {
        return this.fontPaths;
    };

    /**
     * Match
     * @param  {Array} filepaths
     * @param  {Array} patterns
     * @param  {Object} options
     * @return {Array}
     */
    gp.util.match = function(filepaths, patterns, options) {
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

    module.exports = gp;

})(undefined);
