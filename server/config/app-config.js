const path = require('path');
const fs = require('fs');
const appConfigFilePath = '/server/config/app-config.json';

module.exports = function() {
    return new Promise((resolve) => {
        fs.readFile(path.join(global.appRoot, appConfigFilePath), 'utf8', function(err, fileContent) {
            var appConfigData = JSON.parse(fileContent);
            global.appConfig = appConfigData;
            global.appStartTime = (new Date).getTime();

            fs.readFile(path.join(global.appRoot, '/server/common/text-resources.json'), 'utf8', function(err, fileContent) {
                global.textResources = JSON.parse(fileContent);
                resolve({success: true});
            });
        });
    });
};