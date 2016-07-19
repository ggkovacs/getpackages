var chalk = require('chalk');

module.exports = function(deprecatedFunctionName, functionName) {
    if (process.env.NODE_ENV === 'test') {
        return;
    }

    console.log(chalk.red('This ' + deprecatedFunctionName + ' method was deprecated. ') + chalk.green('Use ' + functionName + ' instead.'));
};
