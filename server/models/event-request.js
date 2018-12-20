const mongoose = require('mongoose');
const utils = require('./../common/utils');

const EventRequest = new mongoose.Schema({
    uid: { type: String, default: utils.getUid() },
    userId: mongoose.Schema.ObjectId,
    eventId: mongoose.Schema.ObjectId,
    role: String,
    text: String,
    photoUrls: [String],
    status: {type: String, default: 'new'},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('event_request', EventRequest);

