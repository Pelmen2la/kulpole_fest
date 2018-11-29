var fs = require('fs'),
    path = require('path');

module.exports = {
    sendHtmlFileResponse: function(res, fileUrl, prepareHtmlFn) {
        fs.readFile(path.join(global.appRoot, fileUrl), 'utf8', function(err, pageHtml) {
            pageHtml = prepareHtmlFn ? prepareHtmlFn(pageHtml) : pageHtml;
            res.send(pageHtml);
        });
    },
    getRandomInt,
    getRandomFloat,
    getListAverage,
    getArrayAverage,
    getArrayRandom,
    getUid
};

function getRandomInt(min, max) {
    return Math.round(getRandomFloat(min, max));
};

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
};

function getListAverage(list) {
    return getArrayAverage(list.toJS());
};

function getArrayAverage(arr) {
    var sum = 0;
    arr.forEach((e) => sum += e);
    return arr.length ? sum / arr.length : 0;
};

function getArrayRandom(arr) {
    return arr[getRandomInt(0, arr.length - 1)];
};

function getUid() {
    function getPart() {
        var part = (Math.random() * 46656) | 0;
        return ("000" + part.toString(36)).slice(-3);
    }
    return getPart() + getPart();
};