const utils = require('./../../helpers/landing/utils');
const eventsModule = require('./events');
const mongoose = require('mongoose');
const NewsModel = mongoose.model('news');

module.exports = function(app) {
    require('./auth')(app);
    require('./news')(app);
    require('./events')(app);
    require('./debug')(app);

    app.get('/', async function(req, res, next) {
        NewsModel.find({}, null, {sort: {'date': -1}, limit: 3}, async function(err, newsData) {
            var eventsData = await eventsModule.getEventsData(req, (new Date).getFullYear());
            const eventData = eventsData.filter((e) => e.date > new Date()).sort((e1, e2) => e1.date - e2.date)[0];
            const params = {newsData: newsData || [], eventData};
            utils.getPageHtml('main', req, params).then((pageHtml) => res.send(pageHtml));
        });
    });

    app.get('*', function(req, res, next) {
        res.redirect('/');
    });
};