const utils = require('./../../common/utils');
const dataHelper = require('./../../helpers/admin-workspace/data');
const commonUtils = require('./../../common/utils');
const pug = require('pug');
const path = require('path');

module.exports = function(app) {
    require('./auth')(app);
    require('./api')(app);
    require('./tech')(app);
    require('./upload')(app);
    require('./clubs')(app);
    require('./event-request')(app);

    app.get('/admin/workspace/', function(req, res, next) {
        const params = {
            textResourcesJsonString: JSON.stringify(global.textResources),
            isAdmin: req.session.adminWorkspaceLogedInUserData.isAdmin,
            formatFns: {
                formatDbDateToWeb: commonUtils.formatDbDateToWeb,
                formatUrlToWeb: commonUtils.formatUrlToWeb
            }
        };
        res.send((pug.renderFile(path.join(global.appRoot, '/static/admin-workspace/views/index.pug'), params)));
    });
};