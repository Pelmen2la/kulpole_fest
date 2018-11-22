var utils = require('./../../common/utils');

const ADMIN_LOGIN_URL = '/admin/auth';

module.exports = function(app) {
    app.all('/admin/workspace', authMiddleware);

    app.post(ADMIN_LOGIN_URL, function(req, res) {
        if(req.body.login != global.adminLogin || req.body.password != global.adminPassword) {
            sendAuthPage(res, 'Не правильное имя пользователя или пароль');
        } else {
            req.session.isLogedIn = true;
            res.redirect('/admin/workspace#/main/users');
        }
    });

    app.get('/admin/logout', function (req, res) {
        req.session.isLogedIn = true;
        res.redirect(ADMIN_LOGIN_URL);
    });

    app.get(ADMIN_LOGIN_URL, function (req, res) {
        sendAuthPage(res, '');
    });

    function authMiddleware(req, res, next) {
        if(req.session.isLogedIn) {
            next();
        } else {
            res.redirect(ADMIN_LOGIN_URL);
        }
    };

    function sendAuthPage(res, errorText) {
        utils.sendHtmlFileResponse(res, '/static/admin-workspace/html/auth.html', function(pageHtml) {
            return pageHtml.replace('{{error_text}}', errorText || '');
        });
    };
};
