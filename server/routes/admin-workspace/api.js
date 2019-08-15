const dataHelper = require('../../helpers/admin-workspace/data');

module.exports = function(app) {
    for(var key in dataHelper.dataModelsCfg) {
        var cfg = dataHelper.dataModelsCfg[key],
            multName = cfg.hasMultipleName ? key + 's' : key;
        createCRUD(app, key, multName);
    }

    app.post('/admin/workspace/send_event_request_msg/:eventRequestId', function(req, res, next) {
        dataHelper.addEventRequestMessage(req, req.params.eventRequestId, req.body.text, 'admin', (result) => res.send(result));
    });
};

function createCRUD(app, mnemonic, multMnemonic) {
    const capMnemonic = mnemonic[0].toUpperCase() + mnemonic.substring(1),
        idParamName = mnemonic + 'Id';
    app.get('/admin/workspace/' + multMnemonic, async function(req, res, next) {
        const result = await dataHelper['get' + capMnemonic + 'List'](req.query);
        res.json(result)
    });
    app.get('/admin/workspace/' + multMnemonic + '/:' + idParamName, async function(req, res, next) {
        const result = await dataHelper['get' + capMnemonic](req.params[idParamName]);
        res.json(result);
        onOpen(mnemonic, result);
    });
    app.post('/admin/workspace/' + multMnemonic + '/', async function(req, res, next) {
        const result = await dataHelper['add' + capMnemonic](req.body);
        res.json({success: true, data: result});
    });
    app.put('/admin/workspace/' + multMnemonic + '/:' + idParamName, async function(req, res, next) {
        const result = await dataHelper['update' + capMnemonic](req.params[idParamName], req.body);
        onUpdate(mnemonic, result);
        res.json({success: true, data: result});
    });
    app.delete('/admin/workspace/' + multMnemonic + '/:' + idParamName, async function(req, res, next) {
        await dataHelper['delete' + capMnemonic](req.params[idParamName]);
        res.json({success: true});
    });
};

function onOpen(modelName, entryData) {
    if(modelName === 'eventRequest') {
        dataHelper.updateEventRequestLastOpenDate(entryData._id, 'admin');
    }
};

function onUpdate(modelName, entryData) {
    if(modelName === 'eventRequest' && entryData) {
        dataHelper.updateEventRequestLastActionDate(entryData.get('id'), 'admin');
    }
};