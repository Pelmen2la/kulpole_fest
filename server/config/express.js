'use strict';

var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cookieSession = require('cookie-session'),
    cacheTime = 86400000 * 7; //7 days

module.exports = function(app) {
    app.use(express.static(path.join(global.appRoot, 'static'), {maxAge: cacheTime}));
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieSession({
        name: 'session',
        keys: [global.appConfig.sessionKey],
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }));
    app.use(bodyParser.json());
};