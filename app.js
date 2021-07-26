'use strict';
require('zone.js');

const express = require('express');
const compression = require('compression');
const expressContext = require('global-request-context/lib/express-middleware');
const appConfig = require('./server/config/app-config');
const path = require('path');
const app = express();

global.appRoot = path.resolve(__dirname);

process.on('uncaughtException', function(err) {
    console.error(err);
});

app.use(compression());
app.use(expressContext);

appConfig().then(async () => {
    require('./server/config/express')(app);
    await require('./server/config/mongoose')(app);
    require('./server/routes/index')(app);

    const server = app.listen(global.appConfig.appPort, 'localhost', function() {
        console.log('App listening on port ' + server.address().port);
    });
});

