var utils = require('./../../common/utils');

module.exports = function(app) {
    require('./auth')(app);
    require('./api')(app);

    app.get('/admin/workspace/', function(req, res, next) {
        utils.sendHtmlFileResponse(res, '/static/admin-workspace/html/index.html')
    });
};