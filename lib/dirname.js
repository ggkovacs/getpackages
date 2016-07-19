var path = require('path');

module.exports = function() {
    var s1 = __dirname;
    var s2 = process.cwd();
    var dirname = '';

    for (var i = 0, l = s1.length; i < l; i++) {
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
