'use strict';

var childProcess = require('child_process');
var execSync = childProcess.execSync;

if (execSync) {
    process.exit(0);
}

console.log('Install execSync...');

childProcess.exec('npm install execSync', function(err, stdout) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log(stdout);
});
