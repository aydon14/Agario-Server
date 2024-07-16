class Logger {
    debug() {

    };

    starttext(text) {
        console.log(`[\x1b[34mStarting\x1b[0m] ${text}`);
    };

    info(text) {
        console.log(`[\x1b[34mInfo\x1b[0m] ${text}`);
    };

    warn(text) {
        console.log(`[\x1b[33mWarning\x1b[0m] ${text}`);
    };

    error(text) {
        console.log(`[\x1b[31mError\x1b[0m] ${text}`);
    };

    fatal(text) {
        console.log("Process stopped as a result of an error:");
        console.log(`${text}`);
    };

    success(text) {
        console.log(text);
    };

    print(text) {
        console.log(`${text}`);
    };
};

module.exports = new Logger;