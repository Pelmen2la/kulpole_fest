const mongoose = require('mongoose');
const UserModel = mongoose.model('user');

module.exports = {
    getUserList: function(clb) {
        UserModel.find({}, (err, data) => {
            clb(err ? [] : data);
        });
    },
    addUser: function(data, clb) {
        (new UserModel(data)).save((err, userData) => {
            clb(err ? null : userData);
        });
    },
    getUser: function(id, clb) {
        UserModel.findById(id, (err, userData) => {
            clb(err ? null : userData);
        });
    },
    updateUser: function(id, data, clb) {
        UserModel.findOneAndUpdate(id, data, (err, userData) => {
            clb(err ? null : userData);
        });
    },
    deleteUser: function(id, clb) {
        UserModel.findOneAndDelete(id, (err, userData) => {
            clb(err ? null : userData);
        });
    }
};