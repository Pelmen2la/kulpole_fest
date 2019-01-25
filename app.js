'use strict';
require('zone.js');

var express = require('express'),
    compression = require('compression'),
    expressContext = require('global-request-context/lib/express-middleware'),
    path = require('path'),
    fs = require('fs'),
    appConfigFilePath = '/server/config/app-config.json',
    app = express();

global.appRoot = path.resolve(__dirname);

app.use(compression());
app.use(expressContext);

var server = app.listen(process.env.PORT || 3003, 'localhost', function() {
    console.log('App listening on port ' + server.address().port);
});

process.on('uncaughtException', function(err) {
    console.error(err);
});

fs.readFile(path.join(global.appRoot, appConfigFilePath), 'utf8', function(err, fileContent) {
    var data = JSON.parse(fileContent);
    global.sessionKey = data.sessionKey;
    global.adminLogin = data.adminData.login;
    global.adminPassword = data.adminData.password;

    fs.readFile(path.join(global.appRoot, '/server/common/text-resources.json'), 'utf8', function(err, fileContent) {
        global.textResources = JSON.parse(fileContent);
        require('./server/config/express')(app);
        require('./server/config/mongoose')(app);
        require('./server/routes/index')(app);
    });
});

