const mongoose = require('mongoose');
const utils = require('./../common/utils');

const EventRequestMessage = new mongoose.Schema({
    uid: {type: String, default: utils.getUid},
    eventRequestId: mongoose.Schema.ObjectId,
    owner: String,
    date: {type: Date, default: Date.now},
    text: String
});

module.exports = mongoose.model('event_request_message', EventRequestMessage);

