/* global describe, it */
'use strict';

var should = require('chai').should(); // eslint-disable-line no-unused-vars
var path = require('path');
var gp = require('../index.js').init({
    applicationPath: '',
    yiiPackagesCommand: 'cat ' + path.join(__dirname, 'data', 'bundles.json'),
    isAbsoluteCommandPath: false
});
var validDatas = require(path.join(__dirname, 'data', 'validDatas.json'));

describe('get-packages', function() {
    it('’get’ function', function(done) {
        validDatas.get.should.deep.equal(gp.get());
        done();
    });

    it('’getPackagesDistPath’ function', function(done) {
        validDatas.getPackagesDistPath.should.deep.equal(gp.getPackagesDistPath());
        done();
    });

    it('’getPackagesDistPathWithoutImageDir’ function', function(done) {
        validDatas.getPackagesDistPathWithoutImageDir.should.deep.equal(gp.getPackagesDistPathWithoutImageDir());
        done();
    });

    it('’getStylesPaths’ function', function(done) {
        validDatas.getStylesPaths.should.deep.equal(gp.getStylesPaths());
        done();
    });

    it('’getStylesPathsByFilepath’ function without params', function(done) {
        validDatas.getStylesPathsByFilepath.should.deep.equal(gp.getStylesPathsByFilepath());
        done();
    });

    it('’getStylesPathsByFilepathWithFilePath’ function with filepath', function(done) {
        validDatas.getStylesPathsByFilepathWithFilePath.should.deep.equal(gp.getStylesPathsByFilepath('/sample/protected/assets/desktop/src/scss/main.scss'));
        done();
    });

    it('’getStylesPathsByFilepathWithFilePathAndGlob’ function with filepath and glob', function(done) {
        validDatas.getStylesPathsByFilepathWithFilePathAndGlob.should.deep.equal(gp.getStylesPathsByFilepath('/sample/protected/assets/mobile/src/scss/main.less', path.join('**', '*.less')));
        done();
    });

    it('’getStylesSourcePath’ function', function(done) {
        validDatas.getStylesSourcePath.should.deep.equal(gp.getStylesSourcePath());
        done();
    });

    it('’getStylesSourcePathWithGlob’ function without params', function(done) {
        validDatas.getStylesSourcePathWithGlob.should.deep.equal(gp.getStylesSourcePathWithGlob());
        done();
    });

    it('’getStylesSourcePathWithGlob’ function with glob', function(done) {
        validDatas.getStylesSourcePathWithGlobWithGlob.should.deep.equal(gp.getStylesSourcePathWithGlob(path.join('**', '*.less')));
        done();
    });

    it('’getScriptsSourcePath’ function', function(done) {
        validDatas.getScriptsSourcePath.should.deep.equal(gp.getScriptsSourcePath());
        done();
    });

    it('’getScriptsSourcePathWithoutFile’ function', function(done) {
        validDatas.getScriptsSourcePathWithoutFile.should.deep.equal(gp.getScriptsSourcePathWithoutFile());
        done();
    });

    it('’getScriptsSourcePathWithGlob’ function without params', function(done) {
        validDatas.getScriptsSourcePathWithGlob.should.deep.equal(gp.getScriptsSourcePathWithGlob());
        done();
    });

    it('’getScriptsSourcePathWithGlob’ function with glob', function(done) {
        validDatas.getScriptsSourcePathWithGlobWithGlob.should.deep.equal(gp.getScriptsSourcePathWithGlob(path.join('**', '*.es6')));
        done();
    });

    it('’getScriptsSourcePathBeforeTranspiling’ function', function(done) {
        validDatas.getScriptsSourcePathBeforeTranspiling.should.deep.equal(gp.getScriptsSourcePathBeforeTranspiling());
        done();
    });

    it('’getScriptsSourcePathBeforeTranspilingWithGlob’ function without params', function(done) {
        validDatas.getScriptsSourcePathBeforeTranspilingWithGlob.should.deep.equal(gp.getScriptsSourcePathBeforeTranspilingWithGlob());
        done();
    });

    it('’getScriptsSourcePathBeforeTranspilingWithGlob’ function with glob', function(done) {
        validDatas.getScriptsSourcePathBeforeTranspilingWithGlobWithGlob.should.deep.equal(gp.getScriptsSourcePathBeforeTranspilingWithGlob(path.join('**', '*.es6')));
        done();
    });

    it('’getScriptsToBuild’ function', function(done) {
        validDatas.getScriptsToBuild.should.deep.equal(gp.getScriptsToBuild());
        done();
    });

    it('’getScriptsToTranspiling’ function', function(done) {
        validDatas.getScriptsToTranspiling.should.deep.equal(gp.getScriptsToTranspiling());
        done();
    });

    it('’getImagesPaths’ function', function(done) {
        validDatas.getImagesPaths.should.deep.equal(gp.getImagesPaths());
        done();
    });

    it('’getImagesSourcePath’ function', function(done) {
        validDatas.getImagesSourcePath.should.deep.equal(gp.getImagesSourcePath());
        done();
    });

    it('’getImagesSourcePathWithGlob’ function without params', function(done) {
        validDatas.getImagesSourcePathWithGlob.should.deep.equal(gp.getImagesSourcePathWithGlob());
        done();
    });

    it('’getImagesSourcePathWithGlob’ function with glob', function(done) {
        validDatas.getImagesSourcePathWithGlobWithGlob.should.deep.equal(gp.getImagesSourcePathWithGlob(path.join('**', '*.svg')));
        done();
    });

    it('’getFontsPaths’ function', function(done) {
        validDatas.getFontsPaths.should.deep.equal(gp.getFontsPaths());
        done();
    });

    it('’getOtherPaths’ function', function(done) {
        validDatas.getOtherPaths.should.deep.equal(gp.getOtherPaths());
        done();
    });

    it('’getExtraParamsByModule’ function', function(done) {
        validDatas.getExtraParamsByModule.should.deep.equal(gp.getExtraParamsByModule('app.mobile'));
        done();
    });

    it('’getExtraParamsByModule’ function with no exists package', function(done) {
        gp.getExtraParamsByModule('app.tablet').should.false; // eslint-disable-line no-unused-expressions
        done();
    });
});
