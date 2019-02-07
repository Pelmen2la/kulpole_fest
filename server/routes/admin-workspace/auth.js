const utils = require('./../../common/utils');
const systemUserModel = require('./../../models/system-user');

const ADMIN_LOGIN_URL = '/admin/auth';

module.exports = function(app) {
    app.all('/admin/workspace', authMiddleware);

    app.post(ADMIN_LOGIN_URL, function(req, res) {
        const login = req.body.login;
        const password = req.body.password;
        if(login == global.adminLogin && password == global.adminPassword) {
            req.session.adminWorkspaceLogedInUserData = {
                isAdmin: true
            };
            res.redirect('/admin/workspace#/main/users');
        } else {
            systemUserModel.findOne({login, password}, (err, systemUserData) => {
                if(err || !systemUserData) {
                    sendAuthPage(res, 'Не правильное имя пользователя или пароль');
                } else {
                    req.session.adminWorkspaceLogedInUserData = Object.assign(systemUserData.toObject(), {
                        isAdmin: false
                    });
                    res.redirect('/admin/workspace#/main/users');
                }
            });
        }
    });

    app.get('/admin/logout', function (req, res) {
        delete req.session.adminWorkspaceLogedInUserData;
        res.redirect(ADMIN_LOGIN_URL);
    });

    app.get(ADMIN_LOGIN_URL, function (req, res) {
        sendAuthPage(res, '');
    });

    function authMiddleware(req, res, next) {
        if(req.session.adminWorkspaceLogedInUserData) {
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
