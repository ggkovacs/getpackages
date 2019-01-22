'use strict';

const _ = require('lodash');
const minimatch = require('minimatch');

function processPatterns(patternsArg, fnArg) {
  let result = [];

  _.flatten(patternsArg).forEach((p) => {
    let pattern = p;
    const exclusion = pattern.indexOf('!') === 0;

    if (exclusion) {
      pattern = pattern.slice(1);
    }

    const matches = fnArg(pattern);

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

  return processPatterns(patterns, pattern => minimatch.match(filepaths, pattern, options));
};
