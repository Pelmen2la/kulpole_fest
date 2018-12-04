const mongoose = require('mongoose');
const UserModel = mongoose.model('user');
const utils = require('./../../helpers/landing/utils');

const AUTH_URL = '/auth';

module.exports = function(app) {
    app.get(AUTH_URL, function (req, res) {
        sendAuthPage(req, res, {});
    });

    app.post(AUTH_URL, function(req, res) {
        UserModel.findOne({ email: req.body.email, password: req.body.password }, (err, userData) => {
            if(userData) {
                addAuthUserInfoToSession(req, userData);
                sendAuthPage(req, res, {});
            } else {
                sendAuthPage(req, res, { errorText: 'Не верно указан email или пароль.' });
            }
        });
    });

    app.get('/logout', function (req, res) {
        req.session.logedInUserData = null;
        res.redirect('/');
    });

    app.get('/registration', function(req, res, next) {
        res.send(utils.getPageHtml('registration', req, {}));
    });

    app.post('/registration', function(req, res, next) {
        const body = req.body;
        UserModel.findOne({email: body.email}, (err, userData) => {
            if(userData) {
                sendRegistrationPage(req, res, { errorText: 'Данный email-адрес уже используется.', registrationUserData: body });
            } else {
                var newUser = UserModel(req.body);
                newUser.save((err, userData) => {
                    addAuthUserInfoToSession(req, userData);
                    sendRegistrationPage(req, res, { registrationComplete: true, registrationUserData: userData.toObject() });
                });
            }
        });
    });

    app.get('/registration/complete/', function(req, res, next) {

    });

    function sendAuthPage(req, res, params) {
        res.send(utils.getPageHtml('auth', req, params));
    };
    function sendRegistrationPage(req, res, params) {
      res.send(utils.getPageHtml('registration', req, params));
    };
    function addAuthUserInfoToSession(req, userData) {
        req.session.logedInUserData = userData.toObject();
    };
};


