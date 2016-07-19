'use strict';

var execSync = require('child_process').execSync;

module.exports = function(command, options) {
    var packages;

    if (execSync) {
        try {
            packages = execSync(command, {
                encoding: 'utf8'
            });

            return JSON.parse(packages).packages;
        } catch (e) {
            if (options.verbose) {
                console.log(e);
            }
            process.exit(1);
        }
    }

    packages = require('sync-exec')(command);

    if (packages.code > 0 && options.verbose) {
        console.log('Error code: ' + packages.code);
        console.log('Error message: \n' + packages.stdout);
        process.exit(1);
    }

    return JSON.parse(packages.stdout).packages;
};
