const mongoose = require('mongoose');
const UserModel = mongoose.model('user');

const ROWS_ON_PAGE = 20;

module.exports = {
    getUserList: function(params, clb) {
        UserModel.find({}, null, getListQueryOptions(params), (err, data) => {
            UserModel.countDocuments({}, function (err, totalData) {
                clb({
                    content: data,
                    totalPages: Math.ceil(totalData / ROWS_ON_PAGE)
                });
            });
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
        delete data._id;
        UserModel.findOneAndUpdate({ _id: id }, data, (err, userData) => {
            clb(err ? null : userData);
        });
    },
    deleteUser: function(id, clb) {
        UserModel.findOneAndDelete(id, (err, userData) => {
            clb(err ? null : userData);
        });
    }
};

function getListQueryOptions(params) {
    return {
        skip: ROWS_ON_PAGE * params.pageIndex,
        limit: ROWS_ON_PAGE
    };
};