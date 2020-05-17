
const helpers = require('./index');
const { getYArgs } = require('../core/yargs');
const clc = require("chalk");
const _ = require("lodash")
const args = getYArgs().argv;

module.exports = {
    teaser() {
    },

    log() {
        console.log.apply(this, arguments);
    },

    error(error) {
        let message = error;

        if (error instanceof Error) {
            message = !args.debug
                ? error.message
                : error.stack;
        }

        this.log();
        console.error(`${clc.red('ERROR:')} ${message}`);
        this.log();

        process.exit(1);
    },

    warn(message) {
        this.log(`${clc.yellow('WARNING:')} ${message}`);
    },
    command(message) {
        this.log(`${clc.blueBright('command:')} ${message}`);
    },
    info(message) {
        this.log(`${clc.blueBright(`${message}`)}`);
    },

    notifyAboutExistingFile(file) {
        this.error(
            'The file ' + clc.blueBright(file) + ' already exists. ' +
            'Run command with --force to overwrite it.'
        );
    },


};
