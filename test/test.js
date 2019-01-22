/* global describe, it */

'use strict';

const should = require('chai').should(); // eslint-disable-line no-unused-vars
const path = require('path');
const gp = require('../index.js').init({
  applicationPath: '',
  yiiPackagesCommand: `cat ${path.join(__dirname, 'data', 'bundles.json')}`,
  isAbsoluteCommandPath: false
});
const validDatas = require(path.join(__dirname, 'data', 'validDatas.json'));

describe('get-packages', () => {
  it('’get’ function', (done) => {
    validDatas.get.should.deep.equal(gp.get());
    done();
  });

  it('’getPackagesDistPath’ function', (done) => {
    validDatas.getPackagesDistPath.should.deep.equal(gp.getPackagesDistPath());
    done();
  });

  it('’getPackagesDistPathWithoutImageDir’ function', (done) => {
    validDatas.getPackagesDistPathWithoutImageDir.should.deep.equal(gp.getPackagesDistPathWithoutImageDir());
    done();
  });

  it('’getStylesPaths’ function', (done) => {
    validDatas.getStylesPaths.should.deep.equal(gp.getStylesPaths());
    done();
  });

  it('’getStylesPathsByFilepath’ function without params', (done) => {
    validDatas.getStylesPathsByFilepath.should.deep.equal(gp.getStylesPathsByFilepath());
    done();
  });

  it('’getStylesPathsByFilepathWithFilePath’ function with filepath', (done) => {
    validDatas.getStylesPathsByFilepathWithFilePath.should.deep.equal(gp.getStylesPathsByFilepath('/sample/protected/assets/desktop/src/scss/main.scss'));
    done();
  });

  it('’getStylesPathsByFilepathWithFilePathAndGlob’ function with filepath and glob', (done) => {
    validDatas.getStylesPathsByFilepathWithFilePathAndGlob.should.deep.equal(gp.getStylesPathsByFilepath('/sample/protected/assets/mobile/src/scss/main.less', path.join('**', '*.less')));
    done();
  });

  it('’getStylesSourcePath’ function', (done) => {
    validDatas.getStylesSourcePath.should.deep.equal(gp.getStylesSourcePath());
    done();
  });

  it('’getStylesSourcePathWithGlob’ function without params', (done) => {
    validDatas.getStylesSourcePathWithGlob.should.deep.equal(gp.getStylesSourcePathWithGlob());
    done();
  });

  it('’getStylesSourcePathWithGlob’ function with glob', (done) => {
    validDatas.getStylesSourcePathWithGlobWithGlob.should.deep.equal(gp.getStylesSourcePathWithGlob(path.join('**', '*.less')));
    done();
  });

  it('’getScriptsSourcePath’ function', (done) => {
    validDatas.getScriptsSourcePath.should.deep.equal(gp.getScriptsSourcePath());
    done();
  });

  it('’getScriptsSourcePathWithoutFile’ function', (done) => {
    validDatas.getScriptsSourcePathWithoutFile.should.deep.equal(gp.getScriptsSourcePathWithoutFile());
    done();
  });

  it('’getScriptsSourcePathWithGlob’ function without params', (done) => {
    validDatas.getScriptsSourcePathWithGlob.should.deep.equal(gp.getScriptsSourcePathWithGlob());
    done();
  });

  it('’getScriptsSourcePathWithGlob’ function with glob', (done) => {
    validDatas.getScriptsSourcePathWithGlobWithGlob.should.deep.equal(gp.getScriptsSourcePathWithGlob(path.join('**', '*.es6')));
    done();
  });

  it('’getScriptsSourcePathBeforeTranspiling’ function', (done) => {
    validDatas.getScriptsSourcePathBeforeTranspiling.should.deep.equal(gp.getScriptsSourcePathBeforeTranspiling());
    done();
  });

  it('’getScriptsSourcePathBeforeTranspilingWithGlob’ function without params', (done) => {
    validDatas.getScriptsSourcePathBeforeTranspilingWithGlob.should.deep.equal(gp.getScriptsSourcePathBeforeTranspilingWithGlob());
    done();
  });

  it('’getScriptsSourcePathBeforeTranspilingWithGlob’ function with glob', (done) => {
    validDatas.getScriptsSourcePathBeforeTranspilingWithGlobWithGlob.should.deep.equal(gp.getScriptsSourcePathBeforeTranspilingWithGlob(path.join('**', '*.es6')));
    done();
  });

  it('’getScriptsToBuild’ function', (done) => {
    validDatas.getScriptsToBuild.should.deep.equal(gp.getScriptsToBuild());
    done();
  });

  it('’getScriptsToTranspiling’ function', (done) => {
    validDatas.getScriptsToTranspiling.should.deep.equal(gp.getScriptsToTranspiling());
    done();
  });

  it('’getImagesPaths’ function', (done) => {
    validDatas.getImagesPaths.should.deep.equal(gp.getImagesPaths());
    done();
  });

  it('’getImagesSourcePath’ function', (done) => {
    validDatas.getImagesSourcePath.should.deep.equal(gp.getImagesSourcePath());
    done();
  });

  it('’getImagesSourcePathWithGlob’ function without params', (done) => {
    validDatas.getImagesSourcePathWithGlob.should.deep.equal(gp.getImagesSourcePathWithGlob());
    done();
  });

  it('’getImagesSourcePathWithGlob’ function with glob', (done) => {
    validDatas.getImagesSourcePathWithGlobWithGlob.should.deep.equal(gp.getImagesSourcePathWithGlob(path.join('**', '*.svg')));
    done();
  });

  it('’getFontsPaths’ function', (done) => {
    validDatas.getFontsPaths.should.deep.equal(gp.getFontsPaths());
    done();
  });

  it('’getOtherPaths’ function', (done) => {
    validDatas.getOtherPaths.should.deep.equal(gp.getOtherPaths());
    done();
  });

  it('’getExtraParamsByModule’ function', (done) => {
    validDatas.getExtraParamsByModule.should.deep.equal(gp.getExtraParamsByModule('app.mobile'));
    done();
  });

  it('’getExtraParamsByModule’ function with no exists bundle', (done) => {
    gp.getExtraParamsByModule('app.tablet').should.false; // eslint-disable-line no-unused-expressions
    done();
  });

  it('’getCustomPaths’ function', (done) => {
    validDatas.getCustomPaths.should.deep.equal(gp.getCustomPaths('svg'));
    done();
  });

  it('’getCustomPaths’ function with no exists bundle', (done) => {
    gp.getCustomPaths('no-exists').should.deep.equal([]);
    done();
  });

  it('`getCustomPathsWithGlob` function', (done) => {
    validDatas.getCustomPathsWithGlob.should.deep.equal(gp.getCustomPathsWithGlob('video'));
    done();
  });

  it('`getCustomPathsWithGlob` function with no exists bundle', (done) => {
    gp.getCustomPathsWithGlob('no-exists').should.deep.equal([]);
    done();
  });
});
