const mongoose = require('mongoose');
const utils = require('./../common/utils');

const Club = new mongoose.Schema({
    uid: {type: String, default: utils.getUid},
    name: String,
    isConfirmed: {type: Boolean, default: true},
    registrationDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('club', Club);