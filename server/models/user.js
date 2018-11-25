const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    phone: String,
    password: String,
    team: String,
    registrationDate: { type: Date, default: Date.now }
});

mongoose.model('user', User);