const utils = require('./../../helpers/landing/utils');
const mongoose = require('mongoose');
const NewsModel = mongoose.model('news');

module.exports = function(app) {
    require('./auth')(app);
    require('./news')(app);
    require('./events')(app);

    app.get('/', function(req, res, next) {
        NewsModel.find({}, null, { sort: { 'date': -1 }, limit: 3 }, function(err, newsData) {
            res.send(utils.getPageHtml('main', req, {
                newsData: newsData || []
            }));
        });
    });

    app.get('*', function(req, res, next) {
        res.redirect('/');
    });
};