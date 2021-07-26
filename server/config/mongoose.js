const mongoose = require('mongoose');
require('require-tree')('./../models');

module.exports = async function (app) {
    await mongoose.connect('mongodb://localhost:27017/kulpole_fest', { useNewUrlParser: true });
};