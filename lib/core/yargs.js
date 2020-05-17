const path = require("path")
const fs = require("fs");
const yargs = require("yargs");

function loadRCFile(optionsPath) {
    const rcFile = optionsPath || path.resolve(process.cwd(), '.nodaxrc');
    const rcFileResolved = path.resolve(rcFile);
    return fs.existsSync(rcFileResolved)
        ? JSON.parse(JSON.stringify(require(rcFileResolved)))
        : {
            'controllers': path.resolve('', 'controllers'),
            'routes': path.resolve('', 'routes'),
            'models': path.resolve('', 'models')
        };
}
const args = yargs
    .help(false)
    .version(false)


function getYArgs() {
    return args;
}
function _baseOptions(yargs) {
    return yargs

}

function _underscoreOption(yargs) {
    return yargs
        .option('underscored', {
            describe: "Use snake case for the timestamp's attribute names",
            default: false,
            type: 'boolean'
        });
}

module.exports = { getYArgs, _baseOptions, _underscoreOption, loadRCFile }
