const mongoose = require('mongoose');
const utils = require('./../common/utils');

const PhotoProps = new mongoose.Schema({
    uid: {type: String, default: utils.getUid},
    url: {type:String, default: ''},
    description: { type: String, default: '' }
});

const EventRequest = new mongoose.Schema({
    uid: {type: String, default: utils.getUid},
    userId: mongoose.Schema.ObjectId,
    eventId: mongoose.Schema.ObjectId,
    role: String,   // Статус участника
    text: String,
    club: String,
    clubName: String,
    city: String,
    region: String,
    socialNetworkLink: String,
    photosProps: {type: [PhotoProps], default: []},
    status: {type: String, default: 'new'},
    hideChat: {type: Boolean, default: false},
    isCostumeAccepted: {type: Boolean, default: false},
    isArmorAccepted: {type: Boolean, default: false},
    date: {type: Date, default: Date.now},
    userLastActionDate: {type: Date, default: Date.now},
    userLastOpenDate: {type: Date, default: Date.now},
    adminLastActionDate: Date,
    adminLastOpenDate: Date,
});

module.exports = mongoose.model('event_request', EventRequest);

