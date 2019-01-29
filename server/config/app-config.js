const path = require('path');
const fs = require('fs');
const appConfigFilePath = '/server/config/app-config.json';

module.exports = function() {
    return new Promise((resolve) => {
        fs.readFile(path.join(global.appRoot, appConfigFilePath), 'utf8', function(err, fileContent) {
            var data = JSON.parse(fileContent);
            global.sessionKey = data.sessionKey;
            global.appPort = data.appPort;
            global.adminLogin = data.adminData.login;
            global.adminPassword = data.adminData.password;

            fs.readFile(path.join(global.appRoot, '/server/common/text-resources.json'), 'utf8', function(err, fileContent) {
                global.textResources = JSON.parse(fileContent);
                resolve({success: true});
            });
        });
    });
};