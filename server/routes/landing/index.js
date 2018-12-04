const auth = require('./auth');
const utils = require('./../../helpers/landing/utils');

module.exports = function(app) {
    auth(app);

    app.get('/', function(req, res, next) {
        res.send(utils.getPageHtml('main', req, {}));
    });

    app.get('*', function(req, res, next) {
        res.redirect('/');
    });
};