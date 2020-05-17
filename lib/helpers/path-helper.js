const path = require("path");
const fs = require("fs");
const { getYArgs, loadRCFile } = require('../core/yargs');
const pluralize = require('pluralize');
const args = getYArgs().argv;
const RCFILE = loadRCFile()

module.exports = {
  getPath(type) {
    type = pluralize.plural(type);
    let result = args[type + 'Path'] || RCFILE[type];
    if (path.normalize(result) !== path.resolve(result)) {
      // the path is relative
      result = path.resolve(process.cwd(), result);
    }
    return this.backSlashes(result)
  },

  getFileName(type, name, options) {
    name = name ? name : 'unnamed';
    name += `-${type}`
    return this.addFileExtension(
      [
        name
      ].join('-'),
      options
    );
  },

  getFileExtension() {
    return 'js';
  },

  addFileExtension(basename, options) {
    return [basename, this.getFileExtension(options)].join('.');
  },

  getControllerPath(controllerName) {
    return path.resolve(this.getPath('controller'), this.getFileName('controller', controllerName));
  },

  getRoutePath(routeName) {
    return path.resolve(this.getPath('route'), this.getFileName('route', routeName));
  },
  getFilePath(type, fileName) {
    fileName = pluralize.singular(fileName).toLowerCase()
    type = pluralize.singular(type);
    let filePath = path.resolve(this.getPath(type), `${fileName}-${type}`);
    return this.backSlashes(filePath)
  },

  getModelsPath() {
    return args.modelsPath || path.resolve(process.cwd(), 'models');
  },
  getTargetPath(type, name) {
    let targetPath = null;
    name = pluralize.singular(name).toLowerCase()
    switch (pluralize.singular(type)) {
      case "controller":
        targetPath = this.getControllerPath(name);
        break;
      case "route":
        targetPath = this.getRoutePath(name);
        break;
    }
    return targetPath
  },

  getModelPath(modelName) {
    return path.resolve(
      this.getModelsPath(),
      this.addFileExtension(modelName.toLowerCase())
    );
  },
  join() {
    return path.join(...arguments);
  },

  existsSync(pathToCheck) {
    if (fs.accessSync) {
      try {
        fs.accessSync(pathToCheck, fs.R_OK);
        return true;
      } catch (e) {
        return false;
      }
    } else {
      return fs.existsSync(pathToCheck);
    }
  },
  backSlashes(filePath) {
    const filePathArr = filePath.split("\\");
    filePath = filePathArr.length ? filePathArr.join('/') : filePath;
    return filePath;
  }
};
