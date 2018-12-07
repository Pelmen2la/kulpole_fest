const utils = require('./../../helpers/landing/utils');

module.exports = function(app) {
    require('./auth')(app);
    require('./news')(app);

    app.get('/', function(req, res, next) {
        res.send(utils.getPageHtml('main', req, {}));
    });

    app.get('*', function(req, res, next) {
        res.redirect('/');
    });
};