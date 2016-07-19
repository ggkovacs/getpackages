var chalk = require('chalk');

module.exports = function(deprecatedFunctionName, functionName) {
    console.log(chalk.red('This ' + deprecatedFunctionName + ' method was deprecated. ') + chalk.green('Use ' + functionName + ' instead.'));
};
