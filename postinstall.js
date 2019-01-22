'use strict';

const childProcess = require('child_process');
const { execSync } = childProcess;

if (execSync) {
  process.exit(0);
}

console.log('Install sync-exec module...');

childProcess.exec('npm install sync-exec', (err, stdout) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(stdout);
});
