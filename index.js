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
    var sep = require('path').sep;

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

        if (dirname.substr(-1) !== sep) {
            dirname += sep;
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

        var packages = sh.exec(getDirname() + DEFAULTS.applicationPath + sep + DEFAULTS.yiiPackagesCommand);

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
                this.cssPaths.push(currentItem.cssfiles[0]);
                this.cssSrcPaths.push(currentItem.cssfiles[0].sources + sep + '**' + sep + '*.{scss,sass}');
            }

            if (currentItem.jsfiles !== undefined) {
                this.jsSrcFiles = this.jsSrcFiles.concat(currentItem.jsfiles[0].sources);

                var dist = currentItem.jsfiles[0].dist.split(sep);
                var concatFilename = dist.pop();

                this.jsToBuild.push({
                    'sources': currentItem.jsfiles[0].sources,
                    'dest': dist.join(sep),
                    'concatFilename': concatFilename
                });
            }

            if (currentItem.imgPath !== undefined) {
                this.imgPaths.push({
                    'sources': currentItem.sources + sep + currentItem.imgPath,
                    'dest': currentItem.dist + sep + currentItem.imgPath
                });
            }

            if (currentItem.fontPath !== undefined) {
                this.fontPaths.push({
                    'sources': currentItem.sources + sep + currentItem.fontPath,
                    'dest': currentItem.dist + sep + currentItem.fontPath
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
    gp.getCssPaths = function() {
        return this.cssPaths;
    };

    /**
     * Get all css paths
     * @return {Array}
     */
    gp.getAllCssPath = function() {
        return this.cssSrcPaths;
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
