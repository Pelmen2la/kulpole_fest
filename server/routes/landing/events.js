const utils = require('./../../helpers/landing/utils');
const commonUtils = require('./../../common/utils');
const moment = require('moment');
const mongoose = require('mongoose');
const EventModel = mongoose.model('event');
const EventRequest = mongoose.model('event_request');

const START_YEAR = 2018;

module.exports = function(app) {
    app.get('/events', function(req, res, next) {
        const nowYear = (new Date).getFullYear();
        EventModel.find(getYearFilter(nowYear), function(err, eventsData) {
            eventsData.forEach((event) => {
                event.dateString = commonUtils.formatDbDateToWeb(event.date);
                if(event.date < new Date) {
                    event.set('hasPassed', true);
                }
            });
            addRequestsStatesToEvents(req.session.logedInUserData, eventsData).then(() => {
                res.send(utils.getPageHtml('events', req, {
                    eventsData: eventsData || []
                }));
            });
        });
    });
};

function addRequestsStatesToEvents(logedInUserData, eventsData) {
    return new Promise((resolve) => {
        if(!logedInUserData) {
            resolve(eventsData);
            return;
        }
        const eventIds = eventsData.map((e) => e.get('id'));
        const filters = { $and: [{ userId: logedInUserData._id }, { eventId: { $in: eventIds }}]};
        EventRequest.find(filters, (err, eventRequestData) => {
            eventsData.forEach(function(event) {
                var eventRequest = eventRequestData.find((r) => r.get('eventId') === event.get('id'));
                if(eventRequest) {
                    event.set('requestData', eventRequest);
                }
            });
            resolve(eventsData);
        });
    });
};

function getYearFilter(year) {
    const fromDate = moment(year + '-01-31T00:00:00');
    const toDate = moment(year + '-12-31T23:59:59');
    return { $and: [{ date : {$gt: fromDate}}, { date: {$lt: toDate}}]};
};