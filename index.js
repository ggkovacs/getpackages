'use strict';

const path = require('path');
const extend = require('extend');
const minimatch = require('minimatch');
const util = require('./lib/util.js');
const packages = require('./lib/packages.js');
const builder = require('./lib/builder.js');
const getDirname = require('./lib/dirname.js');
const deprecatedLog = require('./lib/deprecated-log.js');

let defaults = {
  applicationPath: 'protected',
  yiiPackagesCommand: 'yiic packages',
  isAbsoluteCommandPath: true,
  verbose: false
};

const getPackages = module.exports = {};
let data = {};

getPackages.init = function(options) {
  if (typeof options === 'string') {
    defaults.applicationPath = options;
  } else if (typeof options === 'object') {
    defaults = extend(true, {}, defaults, options);
  }

  let command = '';

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
    return data.stylesPaths.filter(stylesPath => minimatch(filepath, path.join(stylesPath.sources, pattern)));
  }

  return data.stylesPaths;
};

getPackages.getStylesSourcePath = function() {
  return data.stylesSourcePath;
};

getPackages.getStylesSourcePathWithGlob = function(pattern) {
  pattern = pattern || path.join('**', '*.{scss,sass}');

  return data.stylesSourcePath.map(stylesSourcePath => path.join(stylesSourcePath, pattern));
};

getPackages.getScriptsSourcePath = function() {
  return data.scriptsSourcePath;
};

getPackages.getScriptsSourcePathWithoutFile = function() {
  return data.scriptsSourcePathWithoutFile;
};

getPackages.getScriptsSourcePathWithGlob = function(pattern) {
  pattern = pattern || path.join('**', '*.js');

  return data.scriptsSourcePathWithoutFile.map(scriptsSourcePathWithoutFile => path.join(scriptsSourcePathWithoutFile, pattern));
};

getPackages.getScriptsSourcePathBeforeTranspiling = function() {
  return data.scriptsSourcePathBeforeTranspiling;
};

getPackages.getScriptsSourcePathBeforeTranspilingWithGlob = function(pattern) {
  pattern = pattern || path.join('**', '*.js');

  return data.scriptsSourcePathBeforeTranspiling.map(scriptsSourcePathBeforeTranspiling => path.join(scriptsSourcePathBeforeTranspiling, pattern));
};

getPackages.getScriptsToBuild = function() {
  return data.scriptsToBuild;
};

getPackages.getScriptsToTranspiling = function() {
  return data.scriptsToTranspiling;
};

getPackages.getImagesPaths = function() {
  return data.imagesPaths;
};

getPackages.getImagesSourcePath = function() {
  return data.imagesSourcePath;
};

getPackages.getImagesSourcePathWithGlob = function(pattern) {
  pattern = pattern || path.join('**', '*.{png,jpg,jpeg,gif}');

  return data.imagesSourcePath.map(imagesSourcePath => path.join(imagesSourcePath, pattern));
};

getPackages.getFontsPaths = function() {
  return data.fontsPaths;
};

getPackages.getOtherPaths = function() {
  return data.otherPaths;
};

getPackages.getCustomPaths = function(key) {
  return data.customPaths[key] || [];
};

getPackages.getCustomPathsWithGlob = function(key) {
  if (!data.customPaths[key]) {
    return [];
  }

  return [].concat(...data.customPaths[key].map(customPath => customPath.sources));
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
