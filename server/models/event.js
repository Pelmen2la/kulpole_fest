const mongoose = require('mongoose');
const utils = require('./../common/utils');

const Event = new mongoose.Schema({
    uid: {type: String, default: utils.getUid},
    title: String,
    html: String,
    date: {type: Date, default: Date.now},
    createDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('event', Event);