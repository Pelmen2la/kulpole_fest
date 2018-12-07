const utils = require('./../../helpers/landing/utils');
const commonUtils = require('./../../common/utils');
const mongoose = require('mongoose');
const NewsModel = mongoose.model('news');

const NEWS_PAGE_SIZE = 2;

module.exports = function(app) {
    app.get('/news', function(req, res, next) {
        const pageIndex = req.query.pageIndex || 1;
        const dataQueryOptions = {
            sort: { 'date': -1 },
            skip: NEWS_PAGE_SIZE * (pageIndex - 1),
            limit: NEWS_PAGE_SIZE
        };

        NewsModel.find({}, null, dataQueryOptions, function (err, newsData) {
            newsData.forEach((news) => news.dateString = commonUtils.formatDbDateToWeb(news.date));
            NewsModel.count({}, function(err, totalCount) {
                res.send(utils.getPageHtml('news', req, {
                    newsData: newsData,
                    pageIndex: pageIndex,
                    pagesCount: Math.ceil(totalCount / NEWS_PAGE_SIZE)
                }));
            });
        });
    });
};