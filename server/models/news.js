const mongoose = require('mongoose');

const News = new mongoose.Schema({
    title: String,
    seoUrl: String,
    shortDescription: String,
    html: String,
    date: {type: Date, default: Date.now},
});

mongoose.model('news', News);