const mongoose = require('mongoose');
const utils = require('./../common/utils');

const SystemUser = new mongoose.Schema({
    uid: {type: String, default: utils.getUid},
    name: String,
    login: String,
    phone: String,
    password: String,
    registrationDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('system_user', SystemUser);