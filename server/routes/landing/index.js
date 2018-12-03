var utils = require('./../../common/utils'),
    path = require('path'),
    pug = require('pug');

module.exports = function(app) {
    app.get('/', function(req, res, next) {
        res.send(getPageHtml('main', {}));
    });

    function getPageHtml(pageName, opts) {
        return pug.renderFile(path.join(global.appRoot, '/static/views/pages', pageName + '.pug'), opts);
    };
};