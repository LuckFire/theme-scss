import chalk from 'chalk';

/**
 * Log a compile notice message.
 * @param message The message to log.
 */
function compiling(message: string) {
    const tag = chalk.bold.blue('[COMPILING]');
    console.log(tag, message);
}

/**
 * Log a watching notice message.
 * @param message The message to log.
 */
function watching(message: string) {
    const tag = chalk.bold.blue('[WATCHING]');
    console.log(tag, message);
}

/**
 * Log an info message.
 * @param message The message to log.
 */
function info(message: string) {
    const tag = chalk.bold.blue('[INFO]');
    console.log(tag, message);
}

/**
 * Log a success message.
 * @param message The message to log.
 */
function success(message: string) {
    const tag = chalk.bold.green('[SUCCESS]');
    console.log(tag, message);
}

/**
 * Log a warning message.
 * @param message The message to log.
 */
function warning(message: string) {
    const tag = chalk.bold.yellow('[WARNING]');
    console.log(tag, message);
}

/**
 * Log an error message.
 * @param message The message to log.
 * @param exit Whether or not the process should quit on error.
 */
function error(message: Error | string, exit?: boolean) {
    const tag = chalk.bold.red('[ERROR]');
    console.log(tag, message);

    if (exit) process.exit(1);
}

/**
 * Makes text yellow.
 * @param text The text to color
 */
function yellow(text: string) {
    return chalk.yellow(text);
}

export default {
    notices: {
        compiling,
        watching,
        info,
        success,
        warning,
        error
    },
    dye: {
        yellow
    }
};
