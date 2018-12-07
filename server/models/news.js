const mongoose = require('mongoose');
const utils = require('./../common/utils');

const News = new mongoose.Schema({
    uid: { type: String, default: utils.getUid() },
    title: String,
    seoUrl: String,
    shortDescription: String,
    html: String,
    date: {type: Date, default: Date.now},
});

mongoose.model('news', News);