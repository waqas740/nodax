const _ = require('lodash');
const beautify = require('js-beautify');
const pretty = require('pretty');
const helpers = require('./index');
const ejs = require("ejs")
const util = require('util')
module.exports = {
  render(path, locals, options) {
    options = _.assign({
      beautify: true,
      indent_size: 2,
      preserve_newlines: false
    }, options || {});

    const template = helpers.asset.read(path);
    let content = _.template(template)(locals || {});

    if (options.beautify) {
      content = beautify(content, options);
    }

    return content;
  },
  /**
 * Load template file.
 */
  loadTemplate(path, locals) {
    var contents = helpers.asset.read(path)
    return ejs.render(contents, locals, {
      escape: util.inspect
    })



  },
  beautifyContent(content) {
    return pretty(content, { ocd: true });
  }


};
