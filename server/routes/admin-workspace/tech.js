const dataHelper = require('../../helpers/admin-workspace/data');

module.exports = function(app) {
    app.get('/admin/workspace/change_record/:capModelName/:recordId/', async (req, res, next) => {
        const updateFn = dataHelper['update' + req.params.capModelName];
        const recordId = req.params.recordId;

        if(updateFn && recordId) {
            res.send(await updateFn(recordId, req.query));
        } else {
            res.send('No update function or record id');
        }
    });

    app.get('/admin/workspace/:capModelName/update_all/', async (req, res, next) => {
        const updateAllFn = dataHelper['updateAll' + req.params.capModelName];
        if(updateAllFn) {
            res.send(await updateAllFn(req.query));
        } else {
            res.send('No update function');
        }
    });
};