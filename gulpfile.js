'use strict'

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');

var src = 'index.js';

gulp.task('jshint', function() {
    return gulp.src(src)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'));
});

gulp.task('jscs', function() {
    return gulp.src(src)
        .pipe(jscs('.jscsrc'));
});

gulp.task('test', ['jshint', 'jscs']);
