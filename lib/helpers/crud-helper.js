const helpers = require('./index');
const pluralize = require('pluralize');
const fs = require('fs');
const path = require("path")

String.prototype.toFLUpperCase = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}
module.exports = {

  generateFileContent(args, type) {
    if (type == "controllers") {
      return this.generateControllerFile(args)
    }
    else if (type == "routes") {
      return this.generateRouteFile(args)
    }

  },

  generateFile(args, type) {
    this.checkFileExistence(args, type)
    const targetPath = helpers.path.getTargetPath(type, args.name);
    helpers.asset.write(targetPath, this.generateFileContent(args, type));
    helpers.view.log(
      `New ${pluralize.singular(args.name).toLowerCase()}.${pluralize.singular(type)} was created at ${targetPath}`
    );
  },
  generateControllerFile(args) {
    let modelPath = path.relative(process.cwd(), helpers.path.getPath("model"));
    modelPath = modelPath.replace(path.resolve(), '')
    let controllerPath = helpers.path.getPath("controllers")
    modelPath = helpers.path.backSlashes(path.relative(controllerPath, modelPath))
    return helpers.template.render("controller.js", {
      name: pluralize.singular(args.name).toFLUpperCase(),
      modelPath: modelPath

    });
  },
  generateRouteFile(args) {
    let controllerPath = helpers.path.getFilePath("controller", args.name);
    controllerPath = controllerPath.replace(path.resolve(), '')
    let routePath = helpers.path.getPath("routes")
    controllerPath = helpers.path.backSlashes(path.relative(routePath, controllerPath))
    return helpers.template.render("route.js", {
      name: pluralize.singular(args.name).toFLUpperCase(),
      controllerPath,
      model: pluralize.plural(args.name).toLowerCase()

    });
  },
  checkFileExistence(args, type) {
    const force = !!args.force;
    const newFileName = `${pluralize.singular(args.name).toLowerCase()}-${pluralize.singular(type)}.js`
    const filePath = helpers.path.getTargetPath(type, args.name);
    if (!force && fs.existsSync(filePath) === true) {
      helpers.view.notifyAboutExistingFile(newFileName);
    }
    if (force && fs.existsSync(filePath) === true) {
      helpers.view.log(`Deleting the ${newFileName} file.(--force)`);
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        helpers.view.error(e);
      }

    }

  }


};
