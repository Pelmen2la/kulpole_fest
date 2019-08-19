const mongoose = require('mongoose');
const utils = require('./../common/utils');

const EventRequestChange = new mongoose.Schema({
    uid: {type: String, default: utils.getUid},
    eventRequestId: mongoose.Schema.ObjectId,
    changeBody: String,
    userName: String,
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('event_request_change', EventRequestChange);