'use strict';

/**
 * Requires
 */
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');

var files = [
    'index.js',
    'test/test.js',
    'postinstall.js',
];

/**
 * JSHint
 */
gulp.task('jshint', function() {
    return gulp.src(files)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'), {
            verbose: true,
        })
        .pipe(jshint.reporter('fail'));
});

/**
 * JSCS
 */
gulp.task('jscs', function() {
    return gulp.src(files)
        .pipe(jscs('.jscsrc'));
});

/**
 * Test
 */
gulp.task('test', ['jshint', 'jscs'], function() {
    return gulp.src('test/test.js', {read: false})
        .pipe(mocha());
});
