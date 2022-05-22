const moment = require('moment');
const chalk = require('chalk');


const log = console.log;

function now() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}

function log_(message) {
    log(chalk.grey(`[${now()}] `) + `LOG: ${message}`);
}

function info(message) {
    log(chalk.grey(`[${now()}] `) + chalk.blueBright('INFO: ') + message);
}

function error(errtype, message) {
    log(chalk.grey(`[${now()}] `) + chalk.redBright(`ERROR (${errtype}): `) + message);
}

function warn(message) {
    log(chalk.grey(`[${now()}] `) + chalk.yellowBright('WARN: ') + message);
}

function debug(message) {
    log(chalk.grey(`[${now()}] `) + chalk.greenBright('DEBUG: ') + message);
}
function data(args) {
    log(chalk.grey(`[${now()}] `) + chalk.greenBright('DEBUG-DATA: '));
    for (const [ key, value ] of Object.entries(args)) {
        process.stdout.write(chalk.magenta(`${key}: `));
        log(value);
    }
}


module.exports = {
    error,
    info,
    warn,
    log: log_,
    debug,
    now,
    data
}