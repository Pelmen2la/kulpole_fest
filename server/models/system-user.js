const mongoose = require('mongoose');
const utils = require('./../common/utils');

const SystemUser = new mongoose.Schema({
    uid: {type: String, default: utils.getUid},
    name: String,
    login: String,
    phone: String,
    email: String,
    password: String,
    responsibleForRegions: {type: [String], default: []},
    registrationDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('system_user', SystemUser);