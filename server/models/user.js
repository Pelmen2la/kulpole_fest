const mongoose = require('mongoose');
const utils = require('./../common/utils');

const User = new mongoose.Schema({
    uid: { type: String, default: utils.getUid() },
    name: String,
    surname: String,
    email: String,
    phone: String,
    password: String,
    club: String,
    registrationDate: { type: Date, default: Date.now }
});

mongoose.model('user', User);