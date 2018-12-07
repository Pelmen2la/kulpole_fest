const fs = require('fs');
const path = require('path');
const moment = require('moment');

module.exports = {
    sendHtmlFileResponse: function(res, fileUrl, prepareHtmlFn) {
        fs.readFile(path.join(global.appRoot, fileUrl), 'utf8', function(err, pageHtml) {
            pageHtml = prepareHtmlFn ? prepareHtmlFn(pageHtml) : pageHtml;
            res.send(pageHtml);
        });
    },
    getUid,
    formatDbDateToWeb
};

function getUid() {
    function getPart() {
        var part = (Math.random() * 46656) | 0;
        return ("000" + part.toString(36)).slice(-3);
    }
    return getPart() + getPart();
};

function formatDbDateToWeb(date) {
    return moment(date).format('DD.MM.YYYY');
};