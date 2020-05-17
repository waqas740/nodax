const fs = require('fs-extra');
const path = require('path');

const assets = {
    copy: (from, to) => {
        fs.copySync(path.resolve(__dirname, '..', 'assets', from), to);
    },

    read: assetPath => {
        return fs.readFileSync(path.resolve(__dirname, '..', 'assets', assetPath)).toString();
    },

    write: (targetPath, content) => {
        fs.writeFileSync(targetPath, content);
    },

    inject: (filePath, token, content) => {
        const fileContent = fs.readFileSync(filePath).toString();
        fs.writeFileSync(filePath, fileContent.replace(token, content));
    },

    mkdirp: pathToCreate => {
        fs.mkdirpSync(pathToCreate);
    },
    assetPath: (innerPath) => {
        if (innerPath)
            return path.resolve(__dirname, '..', 'assets', innerPath)
        return path.resolve(__dirname, '..', 'assets')

    }
};

module.exports = assets;
module.exports.default = assets;