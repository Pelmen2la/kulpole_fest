var dataHelper = require('./data');

module.exports = function(app) {
    createCRUD(app, 'user');
};

function createCRUD(app, mnemonic) {
    const capMnemonic = mnemonic[0].toUpperCase() + mnemonic.substring(1),
        idParamName = mnemonic + 'Id',
        multMnemonic = mnemonic + 's';
    app.get('/admin/workspace/get_' + multMnemonic, function(req, res, next) {
        dataHelper['get' + capMnemonic + 'List']((result) => res.json(result));
    });
    app.get('/admin/workspace/' + mnemonic + '/:' + idParamName, function(req, res, next) {
       dataHelper['get' + capMnemonic](req.params[idParamName], (result) =>  res.json(result));
    });
    app.post('/admin/workspace/' + mnemonic + '/', function(req, res, next) {
        dataHelper['add' + capMnemonic](req.body, (result) => {
            res.json({success: true, data: result});
        });
    });
    app.put('/admin/workspace/' + mnemonic + '/:' + idParamName, function(req, res, next) {
        dataHelper['update' + capMnemonic](req.params[idParamName], req.body, (result) => {
            res.json({success: true, data: result});
        });
    });
    app.delete('/admin/workspace/' + mnemonic + '/:' + idParamName, function(req, res, next) {
        dataHelper['delete' + capMnemonic](req.params[idParamName], (result) => {
            res.json({success: true});
        });
    });
}