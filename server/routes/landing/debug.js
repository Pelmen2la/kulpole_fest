const mongoose = require('mongoose');
const EventModel = mongoose.model('event');
const EventRequestModel = mongoose.model('event_request');

module.exports = function(app) {
    app.get('/:modelName/getall', function(req, res, next) {
        const model = {
            event: EventModel,
            eventRequest: EventRequestModel
        }[req.params.modelName];
        model.find({}, function(err, data) {
            res.json(err ? 'error' : data);
        });
    });
};