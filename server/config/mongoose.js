const mongoose = require('mongoose');
require('require-tree')('./../models');

module.exports = function (app) {
    mongoose.connect('mongodb://localhost:27017/kulpole_fest', { useNewUrlParser: true });
};