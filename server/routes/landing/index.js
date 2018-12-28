const utils = require('./../../helpers/landing/utils');
const mongoose = require('mongoose');
const NewsModel = mongoose.model('news');

module.exports = function(app) {
    require('./auth')(app);
    require('./news')(app);
    require('./events')(app);
    require('./debug')(app);

    app.get('/', function(req, res, next) {
        NewsModel.find({}, null, { sort: { 'date': -1 }, limit: 3 }, function(err, newsData) {
            utils.getPageHtml('main', req, {newsData: newsData || []}).then((pageHtml) => res.send(pageHtml));
        });
    });

    app.get('*', function(req, res, next) {
        res.redirect('/');
    });
};