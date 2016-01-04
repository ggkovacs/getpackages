'use strict';

var execSync = require('child_process').execSync;
var minimatch = require('minimatch');
var _ = require('lodash');
var path = require('path');
var extend = require('extend');
var chalk = require('chalk');

var defaults = {
    applicationPath: 'protected',
    yiiPackagesCommand: 'yiic packages',
    isAbsoluteCommandPath: true,
    verbose: false
};

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

var getPackages = module.exports = {};

getPackages.util = {};

function getDirname() {
    var s1 = __dirname;
    var s2 = process.cwd();
    var dirname = '';
    var i;
    var l;

    for (i = 0, l = s1.length; i < l; i++) {
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

function processPatterns(patternsArg, fnArg) {
    var result = [];
    var exclusion;
    var matches;
    var pattern;

    _.flatten(patternsArg).forEach(function(p) {
        pattern = p;
        exclusion = pattern.indexOf('!') === 0;

        if (exclusion) {
            pattern = pattern.slice(1);
        }

        matches = fnArg(pattern);

        if (exclusion) {
            result = _.difference(result, matches);
        } else {
            result = _.union(result, matches);
        }
    });

    return result;
}

function deprecatedLog(deprecatedFunctionNameArg, functionNameArg) {
    var message = '';

    message += chalk.red('This ' + deprecatedFunctionNameArg + ' method was deprecated. ');
    message += chalk.green('Use ' + functionNameArg + ' instead.');

    console.log(message);
}

getPackages.init = function(optionsArg) {
    var command = '';
    var packages;

    if (typeof optionsArg === 'string') {
        defaults.applicationPath = optionsArg;
    } else if (typeof optionsArg === 'object') {
        defaults = extend(true, {}, defaults, optionsArg);
    }

    if (defaults.isAbsoluteCommandPath) {
        command = getDirname();
    }

    command = path.join(command, defaults.applicationPath, defaults.yiiPackagesCommand);

    if (execSync) {
        try {
            packages = execSync(command, {
                encoding: 'utf8'
            });

            data.packages = JSON.parse(packages).packages;

            this.build();
        } catch (e) {
            process.exit(1);
        }
    } else {
        packages = require('sync-exec')(command);

        if (packages.code > 0) {
            if (defaults.verbose) {
                console.log('Error code: ' + packages.code);
                console.log('Error message: \n' + packages.stdout);
            }
        } else {
            data.packages = JSON.parse(packages.stdout).packages;
            this.build();
        }
    }

    return this;
};

getPackages.build = function() {
    var i;
    var l;
    var currentItem;
    var packageName;
    var sources;
    var stylesPaths;
    var concatFilename;

    for (i = 0, l = data.packages.length; i < l; i++) {
        currentItem = data.packages[i];
        packageName = currentItem.package || null;

        data.packagesDistPath.push(currentItem.dist);

        if (currentItem.imgPath) {
            data.packagesDistPathWithoutImageDir.push(path.join(currentItem.dist, '*'));
            data.packagesDistPathWithoutImageDir.push(path.join('!', currentItem.dist, currentItem.imgPath));
        }

        if (currentItem.cssfiles) {
            if (Array.isArray(currentItem.cssfiles[0].sources)) {
                sources = currentItem.cssfiles[0].sources[0];
                if (currentItem.cssfiles[0].sources.length > 1) {
                    sources = '{' + currentItem.cssfiles[0].sources.join(',') + '}';
                }

                currentItem.cssfiles[0].sources = path.join(currentItem.sources, sources);
            }

            stylesPaths = extend(true, {}, currentItem.cssfiles[0]);
            stylesPaths.module = currentItem.module;
            stylesPaths.package = packageName;

            data.stylesSourcePath.push(currentItem.cssfiles[0].sources);
            data.stylesPaths.push(stylesPaths);
        }

        if (currentItem.jsfiles) {
            data.scriptsSourcePath = data.scriptsSourcePath.concat(currentItem.jsfiles[0].sources);

            concatFilename = path.basename(currentItem.jsfiles[0].dist);

            data.scriptsToBuild.push({
                module: currentItem.module,
                package: packageName,
                sources: currentItem.jsfiles[0].sources,
                dest: currentItem.jsfiles[0].dist.replace(concatFilename, ''),
                concatFilename: concatFilename
            });
        }

        if (currentItem.imgPath) {
            data.imagesPaths.push({
                module: currentItem.module,
                package: packageName,
                sources: path.join(currentItem.sources, currentItem.imgPath),
                dest: path.join(currentItem.dist, currentItem.imgPath)
            });

            data.imagesSourcePath.push(path.join(currentItem.sources, currentItem.imgPath));
        }

        if (currentItem.fontPath) {
            data.fontsPaths.push({
                module: currentItem.module,
                package: packageName,
                sources: path.join(currentItem.sources, currentItem.fontPath),
                dest: path.join(currentItem.dist, currentItem.fontPath)
            });
        }

        if (currentItem.extraParams) {
            if (currentItem.package) {
                data.extraParams[currentItem.package] = currentItem.extraParams;
            } else {
                data.extraParams[currentItem.module] = currentItem.extraParams;
            }
        }
    }
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

getPackages.getStylesPathsByFilepath = function(filepathArg, patternArg) {
    var rs;
    var i;
    var l;
    var pattern = patternArg || path.join('**', '*.{scss,sass}');

    if (filepathArg) {
        rs = [];

        for (i = 0, l = data.stylesPaths.length; i < l; i++) {
            if (minimatch(filepathArg, path.join(data.stylesPaths[i].sources, pattern))) {
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

getPackages.getStylesSourcePathWithGlob = function(patternArg) {
    var rs = [];
    var i;
    var l;
    var pattern = patternArg || path.join('**', '*.{scss,sass}');

    for (i = 0, l = data.stylesSourcePath.length; i < l; i++) {
        rs.push(path.join(data.stylesSourcePath[i], pattern));
    }

    return rs;
};

getPackages.getScriptsSourcePath = function() {
    return data.scriptsSourcePath;
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

getPackages.getImagesSourcePathWithGlob = function(patternArg) {
    var rs = [];
    var i;
    var l;
    var pattern = patternArg || path.join('**', '*.{png,jpg,jpeg,gif}');

    for (i = 0, l = data.imagesSourcePath.length; i < l; i++) {
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

getPackages.util.match = function(filepathsArg, patternsArg, optionsArg) {
    var filepaths = filepathsArg;
    var patterns = patternsArg;
    var options = optionsArg;

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
