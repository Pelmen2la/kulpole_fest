const pug = require('pug');
const path = require('path');
const adminDataHelper = require('./../admin-workspace/data');
const commonUtils = require('./../../common/utils');

module.exports = {
    getPageHtml,
    checkAuth
};

function getPageHtml(pageName, req, params = {}) {
    return new Promise((resolve) => {
        new Promise(async (extendParamsResolve) => {
            params.formatFns = {
                formatDbDateToWeb: commonUtils.formatDbDateToWeb,
                formatUrlToWeb: commonUtils.formatUrlToWeb
            };
            params.textResources = global.textResources;
            params.appStartTime = global.appStartTime;
            params.yandexMailKey = global.appConfig.yandexMailKey;
            params.currentYear = (new Date()).getFullYear();

            if(req.session.logedInUserData) {
                const userData = req.session.logedInUserData;
                params.logedInUserData = {
                    fullName: userData.name + ' ' + userData.surname,
                    id: userData._id
                };
                const eventRequestsList = await adminDataHelper.getEventRequestList({userId: req.session.logedInUserData._id});
                params.hasEventRequests = eventRequestsList && eventRequestsList.content && eventRequestsList.content.length;
                extendParamsResolve();
            } else {
                extendParamsResolve();
            }
        }).then(() => {
            resolve(pug.renderFile(path.join(global.appRoot, '/static/landing/views/pages', pageName + '.pug'), params));
        });
    });
};

function checkAuth(req, res) {
    if(!req.session.logedInUserData) {
        res.redirect('/');
        return false;
    } else {
        return true;
    }
};