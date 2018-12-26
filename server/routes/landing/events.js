const utils = require('./../../helpers/landing/utils');
const commonUtils = require('./../../common/utils');
const moment = require('moment');
const mongoose = require('mongoose');
const EventModel = mongoose.model('event');
const EventRequestModel = mongoose.model('event_request');
const multer = require('multer');
const upload = multer({ dest: 'upload/' });
const uploadHelper = require('./../../helpers/upload');
const adminDataHelper = require('./../../helpers/admin-workspace/data');
const path = require('path');

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
            addRequestsStatesToEvents(req.session.logedInUserData, eventsData).then((eventsData) => {
                res.send(utils.getPageHtml('events', req, {
                    eventsData: eventsData || []
                }));
            });
        });
    });

    app.get('/events/:eventUid/request/new', function(req, res) {
        if(utils.checkAuth(req, res)) {
            EventModel.findOne({uid: req.params.eventUid}, function(err, eventData) {
                res.send(utils.getPageHtml('add-event-request', req, {
                    eventData: eventData || []
                }));
            });
        }
    });

    app.post('/events/:eventUid/request/new', upload.array('photo', 5), function(req, res, next) {
        if(utils.checkAuth(req, res)) {
            const eventRequestUid = commonUtils.getUid();
            const eventUid = req.params.eventUid;
            EventModel.findOne({uid: eventUid}, function(err, eventData) {
                if(err || !eventData) {
                    res.redirect('/');
                    return;
                }

                const targetPath = getEventRequestPhotoFolderPath(eventUid, eventRequestUid);
                uploadHelper.tryUploadFiles(targetPath, req, (photoUrls) => {
                    var eventRequestData = req.body;
                    Object.assign(eventRequestData, {
                        uid: eventRequestUid,
                        photoUrls,
                        eventId: eventData.get('_id'),
                        userId: new mongoose.Types.ObjectId(req.session.logedInUserData._id)
                    });
                    (new EventRequestModel(eventRequestData)).save((err, data) => {
                        res.redirect('/')
                    });
                });
            });
        }
    });

    app.get('/event_request/:eventRequestUid', function(req, res, next) {
        checkEventRequestAccess(req, res, req.params.eventRequestUid).then((result) => {
            if(result.isHasAccess) {
                res.send(utils.getPageHtml('event-request', req, {
                    eventRequestData: result.eventRequestData
                }));
            } else {
                res.redirect('/events');
            }
        });
    });

    app.post('/event_request/:eventRequestUid/send_msg', function(req, res, next) {
        checkEventRequestAccess(req, res, req.params.eventRequestUid).then((result) => {
            if(result.isHasAccess) {
                adminDataHelper.addEventRequestMessage(result.eventRequestData._id, req.body.text, 'user', (result) => {
                    res.send(result);
                });
            } else {
                res.send({success: false, erroText: 'У вас нет доступа к данной заявке'});
            }
        });
    });

    app.post('/event_request/:eventRequestUid/add_photo', upload.single('photo'), function(req, res, next) {
        var eventRequestId = req.params.eventRequestUid;
        checkEventRequestAccess(req, res, eventRequestId).then((result) => {
            const eventRequest = result.eventRequestData;
            const targetPath = getEventRequestPhotoFolderPath(eventRequest.uid, eventRequest.eventData[0].uid);
            uploadHelper.tryUploadFiles(targetPath, req, (photoUrl) => {
                const photoUrls = (eventRequest.photoUrls || []).concat(photoUrl);
                adminDataHelper.updateEventRequest(eventRequestId, { photoUrls }, () => res.send(photoUrl));
            });
        });
    });
};

function addRequestsStatesToEvents(logedInUserData, eventsData) {
    return new Promise((resolve) => {
        if(!logedInUserData) {
            resolve(eventsData.map((event) => { return { event };}));
            return;
        }
        const eventIds = eventsData.map((e) => e.get('id'));
        const filters = { $and: [{ userId: logedInUserData._id }, { eventId: { $in: eventIds }}]};
        EventRequestModel.find(filters, (err, eventRequestData) => {
            eventsData = eventsData.map((event) => {
                var eventRequest = eventRequestData.find((r) => r.get('eventId') == event.get('id'));
                return {
                    event,
                    request: eventRequest || null
                }
            });

            resolve(eventsData);
        });
    });
};

function checkEventRequestAccess(req, res, eventRequestId) {
    return new Promise((resolve) => {
        if(utils.checkAuth(req, res)) {
            adminDataHelper.getEventRequest(eventRequestId, (eventRequestData) => {
                resolve({
                    isHasAccess: eventRequestData && eventRequestData.userId == req.session.logedInUserData._id,
                    eventRequestData
                });
            });
        }
    });
};

function getEventRequestPhotoFolderPath(eventUid, eventRequestUid) {
    return path.join('event-requests', eventUid, eventRequestUid);
};

function getYearFilter(year) {
    const fromDate = moment(year + '-01-31T00:00:00');
    const toDate = moment(year + '-12-31T23:59:59');
    return { $and: [{ date : {$gt: fromDate}}, { date: {$lt: toDate}}]};
};