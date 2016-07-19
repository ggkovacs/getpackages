var path = require('path');
var extend = require('extend');
var util = require('./lib/util.js');
var api = require('./lib/api.js');
var packages = require('./lib/packages.js');
var getDirname = require('./lib/dirname.js');

var defaults = {
    applicationPath: 'protected',
    yiiPackagesCommand: 'yiic packages',
    isAbsoluteCommandPath: true,
    verbose: false
};

var getPackages = module.exports = {};

getPackages.init = function(options) {
    if (typeof options === 'string') {
        defaults.applicationPath = options;
    } else if (typeof options === 'object') {
        defaults = extend(true, {}, defaults, options);
    }

    var command = '';
    if (defaults.isAbsoluteCommandPath) {
        command = getDirname();
    }
    command = path.join(command, defaults.applicationPath, defaults.yiiPackagesCommand);

    getPackages = extend(true, {}, getPackages, api(packages(command, defaults)));
    getPackages.util = util;

    return getPackages;
};
