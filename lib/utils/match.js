'use strict';

var _ = require('lodash');
var minimatch = require('minimatch');

function processPatterns(patternsArg, fnArg) {
    var result = [];

    _.flatten(patternsArg).forEach(function(p) {
        var pattern = p;
        var exclusion = pattern.indexOf('!') === 0;

        if (exclusion) {
            pattern = pattern.slice(1);
        }

        var matches = fnArg(pattern);

        if (exclusion) {
            result = _.difference(result, matches);
        } else {
            result = _.union(result, matches);
        }
    });

    return result;
}

module.exports = function(filepaths, patterns, options) {
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
