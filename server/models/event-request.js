const mongoose = require('mongoose');
const utils = require('./../common/utils');

const EventRequest = new mongoose.Schema({
    uid: {type: String, default: utils.getUid},
    userId: mongoose.Schema.ObjectId,
    eventId: mongoose.Schema.ObjectId,
    role: String,
    text: String,
    photoUrls: {type: [String], default: []},
    status: {type: String, default: 'new'},
    isCostumeAccepted: {type: Boolean, default: false},
    isArmorAccepted: {type: Boolean, default: false},
    date: {type: Date, default: Date.now},
    userLastActionDate: {type: Date, default: Date.now},
    userLastOpenDate: {type: Date, default: Date.now},
    adminLastActionDate: Date,
    adminLastOpenDate: Date,
});

module.exports = mongoose.model('event_request', EventRequest);

