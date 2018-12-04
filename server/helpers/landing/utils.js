const pug = require('pug');
const path = require('path');

module.exports = {
    getPageHtml
};

function getPageHtml(pageName, req, params = {}) {
    if(req.session.logedInUserData) {
        const userData = req.session.logedInUserData;
        params.logedInUserData = {
            fullName: userData.name + ' ' + userData.surname,
            id: userData._id
        }
    }
    return pug.renderFile(path.join(global.appRoot, '/static/views/pages', pageName + '.pug'), params);
};