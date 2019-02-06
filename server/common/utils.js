const fs = require('fs');
const path = require('path');
const moment = require('moment');
const mongoose = require('mongoose');

module.exports = {
    sendHtmlFileResponse: function(res, fileUrl, prepareHtmlFn) {
        fs.readFile(path.join(global.appRoot, fileUrl), 'utf8', function(err, pageHtml) {
            pageHtml = prepareHtmlFn ? prepareHtmlFn(pageHtml) : pageHtml;
            res.send(pageHtml);
        });
    },
    getUid,
    formatDbDateToWeb,
    formatUrlToWeb,
    addModelKeysToObject
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

function formatUrlToWeb(url) {
    if(url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
        return 'http://' + url;
    }
    return url;
};

function addModelKeysToObject(obj, modelName, getValueFn = (field) => 1) {
    let eventRequestModelKeys = {};
    mongoose.model(modelName).schema.eachPath((key) => eventRequestModelKeys[key] = getValueFn(key));
    Object.assign(obj, eventRequestModelKeys);
    return obj;
};