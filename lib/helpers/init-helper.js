const helpers = require('./index');
const path = require('path');
const fs = require('fs');
const { loadRCFile } = require('../core/yargs');
const sortedObject = require("sorted-object");
const RC = loadRCFile()
function createFolder(folderName, folder, force) {
    if (force && fs.existsSync(folder) === true) {
        helpers.view.log('Deleting the ' + folderName + ' folder. (--force)');

        try {
            fs.readdirSync(folder).forEach(filename => {
                fs.unlinkSync(path.resolve(folder, filename));
            });
        } catch (e) {
            helpers.view.error(e);
        }

        try {
            fs.rmdirSync(folder);
            helpers.view.log('Successfully deleted the ' + folderName + ' folder.');
        } catch (e) {
            helpers.view.error(e);
        }
    }

    try {
        if (fs.existsSync(folder) === false) {
            helpers.asset.mkdirp(folder);
            helpers.view.log('Successfully created ' + folderName + ' folder at "' + folder + '".');
        } else {
            helpers.view.log(folderName + ' folder at "' + folder + '" already exists.');
        }
    } catch (e) {
        helpers.view.error(e);
    }
};

const init = {
    appName: "nodax-app",
    app: {},
    www: {},
    pkg: {},
    createControlerFolder: force => {
        createFolder('controllers', RC.controllers, force);
    },

    createRouteFolder: force => {
        createFolder('routes', RC.routes, force);
    },

    createModelsFolder: force => {
        createFolder('models', RC.models, false);
    },
    createApp(args) {

        const destinationPath = args._[1] || "nodax-app"
        const program = args
        // App name
        const appName = this.createAppName(path.resolve(destinationPath)) || 'nodax-app';
        this.createDirectories(appName);
        this.createPackageJsonFile(appName);
        this.createEntryPointFiles(appName, program);
        helpers.asset.write(helpers.path.join(appName, 'package.json'), JSON.stringify(this.pkg, null, 2) + '\n')
        const nodaxrc = helpers.template.loadTemplate("templates/nodaxrc.ejs", { appName });
        helpers.asset.write(helpers.path.join(appName, '.nodaxrc'), nodaxrc)
        this.createEnvFiles(appName)
        this.createWelcomeView(appName);
        this.createInitialRoute(appName);
        this.createUtilFile(appName);
        helpers.view.log('Successfully initialize application setup. App Name is ' + destinationPath);
        helpers.view.info("Install dependencies:");
        helpers.view.log(` $ cd ${appName} && npm install && npm run sequelize init && npm run start-app`);
        return;



    },
    /**
     * Create an app name from a directory path
     *
     * @param {String} pathName
     */

    createAppName(pathName) {

        return path.basename(pathName)
            .replace(/[^A-Za-z0-9.-]+/g, '-')
            .replace(/^[-_.]+|-+$/g, '')
            .toLowerCase()
    },
    createPackageJsonFile(name) {
        this.pkg = {
            name: name,
            version: '0.0.0',
            private: true,
            scripts: {
                nodemon: "nodemon",
                start: "nodemon ./bin/www",
                "start-app": "open-cli http://localhost:3000 && nodemon ./bin/www",
                sequelize: "sequelize",
                "migrate:prod": "sequelize db:migrate --env production --config config/config.json",
                "migrate:test": "sequelize db:migrate --env=test-server --config config/config.json",
                "migrate:dev": "sequelize -- db:migrate --env=development --config config/config.json"
            },
            dependencies: {
                'debug': '~2.6.9',
                'express': '~4.16.1',
                "dotenv-flow": "^3.1.0",
                "glob": "^7.1.6",
                "lodash": "^4.17.15",
                "mysql2": "^2.1.0",
                "sequelize": "~5.21.9",
                "sequelize-cli": "~5.5.1",


            },
            devDependencies: {
                "nodemon": "^2.0.4",
                "open-cli": "^6.0.1"
            }
        }


    },
    createEntryPointFiles(dir, program) {
        // JavaScript
        app = {}
        var www = {}
        // App name
        www.name = dir;

        // App modules
        app.localModules = {}
        app.modules = {}
        app.mounts = []
        app.uses = []

        // Request logger
        app.modules.logger = 'morgan'
        app.uses.push("logger('dev')")
        this.pkg.dependencies.morgan = '~1.9.1'

        // Body parsers
        app.uses.push('express.json()')
        app.uses.push('express.urlencoded({ extended: false })')

        // Cookie parser
        app.modules.cookieParser = 'cookie-parser'
        app.uses.push('cookieParser()')
        this.pkg.dependencies['cookie-parser'] = '~1.4.4'

        app.modules.methodOverride = 'method-override'
        app.uses.push("methodOverride('_method')")
        this.pkg.dependencies['method-override'] = '^3.0.0'

        // Template support
        switch (program.view) {
            case 'dust':
                app.modules.adaro = 'adaro'
                app.view = {
                    engine: 'dust',
                    render: 'adaro.dust()'
                }
                this.pkg.dependencies.adaro = '~1.0.4'
                break
            case 'ejs':
                app.view = { engine: 'ejs' }
                this.pkg.dependencies.ejs = '~2.6.1'
                break
            case 'hbs':
                app.view = { engine: 'hbs' }
                this.pkg.dependencies.hbs = '~4.0.4'
                break
            case 'hjs':
                app.view = { engine: 'hjs' }
                this.pkg.dependencies.hjs = '~0.0.6'
                break
            case 'jade':
                app.view = { engine: 'jade' }
                this.pkg.dependencies.jade = '~1.11.0'
                break
            case 'pug':
                app.view = { engine: 'pug' }
                this.pkg.dependencies.pug = '2.0.0-beta11'
                break
            case 'twig':
                app.view = { engine: 'twig' }
                this.pkg.dependencies.twig = '~0.10.3'
                break
            case 'vash':
                app.view = { engine: 'vash' }
                this.pkg.dependencies.vash = '~0.12.6'
                break
            default:
                app.view = false
                break
        }

        // Static files
        app.uses.push("express.static(path.join(__dirname, 'public'))")

        // sort dependencies like npm(1)
        this.pkg.dependencies = sortedObject(this.pkg.dependencies)

        // write files


        const appContent = helpers.template.loadTemplate("templates/js/app.js.ejs", app);
        const wwwContent = helpers.template.loadTemplate("templates/js/www.ejs", www);
        helpers.asset.write(helpers.path.join(dir, 'app.js'), appContent)
        return helpers.asset.write(helpers.path.join(dir, 'bin/www'), wwwContent)
    },
    createDirectories(dir) {
        if (dir !== '.') {
            helpers.asset.mkdirp(dir);

        }

        helpers.asset.mkdirp(helpers.path.join(dir, "routes"));
        helpers.asset.mkdirp(helpers.path.join(dir, "controllers"));
        helpers.asset.mkdirp(helpers.path.join(dir, "bin"));
        helpers.asset.mkdirp(helpers.path.join(dir, "public/assets/js"));
        helpers.asset.mkdirp(helpers.path.join(dir, "public/assets/img"));
        helpers.asset.mkdirp(helpers.path.join(dir, "public/assets/css"));
        helpers.asset.mkdirp(helpers.path.join(dir, "views/partials"));
        //  helpers.asset.mkdirp(helpers.path.join(dir, "views/pages"));
        helpers.asset.mkdirp(helpers.path.join(dir, "utils"));


    },
    createWelcomeView(dir) {
        helpers.asset.copy("templates/public/assets/css/style.css", helpers.path.join(dir, 'public/assets/css/style.css'))
        helpers.asset.copy("templates/views/partials/header.ejs", helpers.path.join(dir, 'views/partials/header.ejs'))
        helpers.asset.copy("templates/views/partials/footer.ejs", helpers.path.join(dir, 'views/partials/footer.ejs'))
        helpers.asset.copy("templates/views/index.ejs", helpers.path.join(dir, 'views/index.ejs'))
        helpers.asset.copy("templates/views/error.ejs", helpers.path.join(dir, 'views/error.ejs'))
    },
    createEnvFiles(appName) {
        helpers.asset.write(helpers.path.join(appName, '.env'), "APP_PORT=3000 \nNODE_ENV=development")
        helpers.asset.write(helpers.path.join(appName, '.env.development'), "APP_PORT=3000")
        helpers.asset.write(helpers.path.join(appName, '.env.production'), "APP_PORT=3000  \nNODE_ENV=production")
        helpers.asset.write(helpers.path.join(appName, '.env.test'), "APP_PORT=3000  \nNODE_ENV=test")

    },
    createInitialRoute(dir) {
        const indexContent = helpers.template.loadTemplate("templates/js/routes/index.js");
        helpers.asset.write(helpers.path.join(dir, 'routes/index.js'), indexContent)
    },

    createUtilFile(dir) {
        let templatePath = "templates/js/utils"
        fs.readdirSync(helpers.asset.assetPath(templatePath)).forEach(filename => {
            helpers.asset.copy(helpers.path.join(templatePath, filename), helpers.path.join(dir, "utils", filename))
        });

    }



};

module.exports = init;
module.exports.default = init;
