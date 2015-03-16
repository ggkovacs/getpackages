'use strict'

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');

gulp.task('jshint', function() {
    return gulp.src('index.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'), {
            verbose: true
        })
        .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function() {
    return gulp.src('index.js')
        .pipe(jscs('.jscsrc'));
});

gulp.task('test', ['jshint', 'jscs']);
