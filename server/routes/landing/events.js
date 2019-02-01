const utils = require('./../../helpers/landing/utils');
const commonUtils = require('./../../common/utils');
const moment = require('moment');
const mongoose = require('mongoose');
const eventModel = mongoose.model('event');
const eventRequestModel = mongoose.model('event_request');
const userModel = mongoose.model('user');
const clubModel = mongoose.model('club');
const multer = require('multer');
const upload = multer({dest: 'upload/'});
const uploadHelper = require('./../../helpers/upload');
const adminDataHelper = require('./../../helpers/admin-workspace/data');
const path = require('path');

const START_YEAR = 2018;

module.exports = function(app) {
    app.get('/events', function(req, res, next) {
        sendEventsPageHtml(req, res, (new Date).getFullYear());
    });

    app.get('/events/:year', function(req, res, next) {
        sendEventsPageHtml(req, res, parseInt(req.params.year));
    });

    app.get('/events/:eventUid/request/new', function(req, res) {
        if(utils.checkAuth(req, res)) {
            eventModel.findOne({uid: req.params.eventUid}, (err, eventData) => {
                clubModel.find({}, (err, clubsData) => {
                    const params = {eventData: eventData || {}, clubsData: clubsData || []};
                    utils.getPageHtml('add-event-request', req, params).then((pageHtml) => res.send(pageHtml));
                });
            });
        }
    });

    app.post('/events/:eventUid/request/new', upload.array('photo', 5), function(req, res, next) {
        if(utils.checkAuth(req, res)) {
            const eventRequestUid = commonUtils.getUid();
            const eventUid = req.params.eventUid;
            eventModel.findOne({uid: eventUid}, function(err, eventData) {
                if(err || !eventData) {
                    res.redirect('/');
                    return;
                }

                const targetPath = getEventRequestPhotoFolderPath(eventUid, eventRequestUid);
                uploadHelper.tryUploadFiles(targetPath, req, (photoUrls) => {
                    var eventRequestData = req.body;
                    const link = eventRequestData.socialNetworkLink;
                    const club = eventRequestData.club;
                    clubModel.findOne({name: new RegExp(`^${club}$`, 'i')}, (err, clubData) => {
                        if(!clubData) {
                            (new clubModel({name: club})).save();
                        }
                    });
                    Object.assign(eventRequestData, {
                        uid: eventRequestUid,
                        photoUrls,
                        eventId: eventData.get('_id'),
                        userId: new mongoose.Types.ObjectId(req.session.logedInUserData._id)
                    });
                    if(link.indexOf('http://') !== 0 && link.indexOf('https://') !== 0) {
                        eventRequestData.socialNetworkLink = 'http://' + link;
                    }
                    (new eventRequestModel(eventRequestData)).save((err, data) => {
                        res.redirect('/user_event_requests/')
                    });
                });
            });
        }
    });

    app.get('/event_request/:eventRequestUid', function(req, res, next) {
        tryGetEventRequestData(req, res, req.params.eventRequestUid).then((result) => {
            if(result.eventRequestData) {
                if(result.canEdit) {
                    adminDataHelper.updateEventRequestLastOpenDate(result.eventRequestData._id, 'user');
                }
                const params = {eventRequestData: result.eventRequestData, isCanEdit: result.canEdit};
                utils.getPageHtml('event-request', req, params).then((pageHtml) => res.send(pageHtml));
            } else {
                res.redirect('/events');
            }
        });
    });

    app.post('/event_request/:eventRequestUid/send_msg', function(req, res, next) {
        tryGetEventRequestData(req, res, req.params.eventRequestUid).then((result) => {
            if(result.eventRequestData) {
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
        tryGetEventRequestData(req, res, eventRequestId).then((result) => {
            const eventRequestData = result.eventRequestData;
            if(eventRequestData) {
                const targetPath = getEventRequestPhotoFolderPath(eventRequestData.uid, eventRequestData.eventData[0].uid);
                uploadHelper.tryUploadFiles(targetPath, req, (photoUrl) => {
                    const photoUrls = (eventRequestData.photoUrls || []).concat(photoUrl);
                    adminDataHelper.updateEventRequest(eventRequestId, {photoUrls}, () => res.send(photoUrl));
                    adminDataHelper.updateEventRequestLastActionDate(eventRequestId, 'user');
                });
            } else {
                res.send('');
            }
        });
    });

    app.get('/user_event_requests/', function(req, res, next) {
        if(utils.checkAuth(req, res)) {
            adminDataHelper.getEventRequestList({userId: req.session.logedInUserData._id}, (eventRequestList) => {
                const params = {
                    eventRequestList: eventRequestList.content,
                    showEventName: true,
                    showUserName: false
                };
                utils.getPageHtml('event-requests', req, params).then((pageHtml) => res.send(pageHtml));
            });
        }
    });
};

function sendEventsPageHtml(req, res, eventsYear) {
    getEventYears().then((yearList) => {
        if(isNaN(eventsYear)) {
            res.redirect('/');
            return;
        }
        if(yearList.indexOf(eventsYear) === -1) {
            eventsYear = yearList[0] || (new Date).getFullYear();
        }

        getEventsData(req, eventsYear).then((eventsData) => {
            const params = {eventsYear, yearList, eventsData: eventsData || []};
            utils.getPageHtml('events', req, params).then((pageHtml) => res.send(pageHtml));
        });
    });
};

function getEventsData(req, eventsYear) {
    return new Promise((resolve) => {
        let aggArgs = [{$match: getYearFilter(eventsYear)}, {$sort: {date: -1}}];
        if(req.session.logedInUserData) {
            aggArgs = aggArgs.concat([{
                $lookup: {
                    from: eventRequestModel.collection.collectionName,
                    localField: '_id',
                    foreignField: 'eventId',
                    as: 'eventRequests'
                }
            }, {
                $unwind: {
                    path: '$eventRequests',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $unwind: {
                    path: '$eventRequests.userId',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from: userModel.collection.collectionName,
                    localField: 'eventRequests.userId',
                    foreignField: '_id',
                    as: 'eventRequests.users'
                }
            }, {
                $project: commonUtils.addModelKeysToObject({
                    'userEventRequest': 1,
                    'eventRequests._id': 1,
                    'eventRequests.uid': 1,
                    'eventRequests.userId': 1,
                    'eventRequests.isCostumeAccepted': 1,
                    'eventRequests.isArmorAccepted': 1,
                    'eventRequests.user': {$arrayElemAt: ['$eventRequests.users', 0]}
                }, 'event')
            }, {
                $group: {
                    _id: '$_id',
                    eventRequests: {$push: '$eventRequests'},
                    uid: {$first: '$uid'},
                    title: {$first: '$title'},
                    html: {$first: '$html'},
                    date: {$first: '$date'}
                }
            }, {
                $project: commonUtils.addModelKeysToObject({
                    eventRequests: 1,
                    userEventRequests: {
                        $filter: {
                            input: '$eventRequests',
                            as: 'er',
                            cond: {
                                $eq: ['$$er.userId', mongoose.Types.ObjectId(req.session.logedInUserData._id)]
                            }
                        }
                    }
                }, 'event')
            }, {
                $project: commonUtils.addModelKeysToObject({
                    eventRequests: 1,
                    userEventRequest: {$arrayElemAt: ['$userEventRequests', 0]}
                }, 'event')
            }]);
        }
        eventModel.aggregate(aggArgs).exec().then(function(eventsData) {
            resolve(eventsData)
        });
    });
};

function addRequestsStatesToEvents(logedInUserData, eventsData) {
    return new Promise((resolve) => {
        if(!logedInUserData) {
            resolve(eventsData.map((event) => {
                return {event};
            }));
            return;
        }
        const eventIds = eventsData.map((e) => e.get('id'));
        const filters = {$and: [{userId: logedInUserData._id}, {eventId: {$in: eventIds}}]};
        eventRequestModel.find(filters, (err, eventRequestData) => {
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

function getEventYears() {
    return new Promise((resolve) => {
        eventModel.aggregate([
            {$project: {year: {$year: '$date'}}},
            {$sort: {year: 1}},
            {$group: {_id: null, years: {$addToSet: '$year'}}}
        ]).exec().then(function(data) {
            resolve(data.length ? data[0].years : [(new Date).getFullYear()]);
        });
    });
};

function tryGetEventRequestData(req, res, eventRequestId) {
    return new Promise((resolve) => {
        if(utils.checkAuth(req, res)) {
            adminDataHelper.getEventRequest(eventRequestId, (eventRequestData) => {
                resolve({
                    canEdit: eventRequestData && eventRequestData.userId.toString() == req.session.logedInUserData._id,
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
    const fromDate = moment(year + '-01-01T00:00:00').toDate();
    const toDate = moment(year + '-12-31T23:59:59').toDate();
    return {$and: [{date: {$gt: fromDate}}, {date: {$lt: toDate}}]};
};