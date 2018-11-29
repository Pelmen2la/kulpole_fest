var dataHelper = require('../../helpers/admin-workspace/data');

module.exports = function(app) {
    for(var key in dataHelper.dataModelsCfg) {
        var cfg = dataHelper.dataModelsCfg[key],
            multName = cfg.hasMultipleName ? key + 's' : key;
        createCRUD(app, key, multName);
    }
};

function createCRUD(app, mnemonic, multMnemonic) {
    const capMnemonic = mnemonic[0].toUpperCase() + mnemonic.substring(1),
        idParamName = mnemonic + 'Id';
    app.get('/admin/workspace/' + multMnemonic, function(req, res, next) {
        dataHelper['get' + capMnemonic + 'List'](req.query, (result) => res.json(result));
    });
    app.get('/admin/workspace/' + multMnemonic + '/:' + idParamName, function(req, res, next) {
       dataHelper['get' + capMnemonic](req.params[idParamName], (result) =>  res.json(result));
    });
    app.post('/admin/workspace/' + multMnemonic + '/', function(req, res, next) {
        dataHelper['add' + capMnemonic](req.body, (result) => {
            res.json({success: true, data: result});
        });
    });
    app.put('/admin/workspace/' + multMnemonic + '/:' + idParamName, function(req, res, next) {
        dataHelper['update' + capMnemonic](req.params[idParamName], req.body, (result) => {
            res.json({success: true, data: result});
        });
    });
    app.delete('/admin/workspace/' + multMnemonic + '/:' + idParamName, function(req, res, next) {
        dataHelper['delete' + capMnemonic](req.params[idParamName], (result) => {
            res.json({success: true});
        });
    });
}