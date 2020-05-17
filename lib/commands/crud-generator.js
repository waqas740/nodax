const { _baseOptions, _underscoreOption } = require('../core/yargs');

const helpers = require('../helpers');
exports.builder =
  yargs =>
    _baseOptions(yargs)
      .option('name', {
        describe: 'Defines the name of the new model',
        type: 'string',
        demandOption: true
      }).option('force', {
        describe: 'Will drop the existing .nodax file and re-create it',
        type: 'boolean',
        default: false
      })

      .argv;

exports.handler = function (args) {
  const command = args._[0];
  try {
    switch (command) {

      case "generate:rc":
      case "generate:RC":
        helpers.crud.generateFile(args, "controllers");
        helpers.crud.generateFile(args, "routes");
        break;
      case "generate:controller":
      case "generate:Controller":
        helpers.crud.generateFile(args, "controllers");
        break;
      case "generate:route":
      case "generate:Route":
        helpers.crud.generateFile(args, "routes");
        break;


    }
  } catch (err) {
    helpers.view.error(err.message);
  }
  process.exit(0);
};
