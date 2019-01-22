'use strict';

const path = require('path');

module.exports = function() {
  const s1 = __dirname;
  const s2 = process.cwd();
  let dirname = '';

  for (let i = 0, l = s1.length; i < l; i++) {
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
};
