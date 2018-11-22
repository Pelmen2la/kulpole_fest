var utils = require('./../common/utils');

const ADMIN_LOGIN_URL = '/admin/auth';

module.exports = function(app) {
    require('./admin-workspace/index')(app);
};
