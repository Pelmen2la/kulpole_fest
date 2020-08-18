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
const emailHelper = require('./../../helpers/email');
const path = require('path');

const START_YEAR = 2018;

module.exports = function(app) {
    app.get('/events', function(req, res, next) {
        sendEventsPageHtml(req, res, (new Date).getFullYear());
    });

    app.get('/event_request_manual', async (req, res, next) => {
        res.send(await utils.getPageHtml('event-request-manual', req));
    });

    app.get('/events/:year', function(req, res, next) {
        sendEventsPageHtml(req, res, parseInt(req.params.year));
    });

    app.get('/events/:eventUid/request/new', function(req, res) {
        if(utils.checkAuth(req, res)) {
            eventModel.findOne({uid: req.params.eventUid}, (err, eventData) => {
                clubModel.find({}, async (err, clubsData) => {
                    const eventRequestReference = req.query.event_request_reference;
                    const eventRequestData = eventRequestReference ? await adminDataHelper.getEventRequest(eventRequestReference) : {};
                    const params = {eventData: eventData || {}, clubsData: clubsData || [], eventRequestData};
                    utils.getPageHtml('add-event-request', req, params).then((pageHtml) => res.send(pageHtml));
                });
            });
        } else {
            res.redirect('/');
        }
    });

    app.post('/events/:eventUid/request/new', upload.array('photo[]', 10), function(req, res, next) {
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
                    const photoDescriptions = req.body.photoDescriptions.split(',');
                    const photosProps = (photoUrls || []).map((url, i) => ({ url, description: photoDescriptions[i]}));

                    if(eventRequestData.eventRequestReferencePhotoUrls) {
                        const photoUrls = eventRequestData.eventRequestReferencePhotoUrls.split(',');
                        const photoDescriptions = eventRequestData.eventRequestReferencePhotoDescriptions.split(',');
                        photoUrls.forEach((url, i) => {
                            photosProps.push({url, description: photoDescriptions[i]});
                        })
                    }

                    clubModel.findOne({name: new RegExp(`^${club}$`, 'i')}, (err, clubData) => {
                        if(!clubData) {
                            (new clubModel({name: club})).save();
                        }
                    });
                    Object.assign(eventRequestData, {
                        uid: eventRequestUid,
                        photosProps,
                        eventId: eventData.get('_id'),
                        userId: new mongoose.Types.ObjectId(req.session.logedInUserData._id),
                    });
                    if(!eventRequestData.participantName) {
                        eventRequestData.participantName = `${req.session.logedInUserData.surname} ${req.session.logedInUserData.name}`;
                    }
                    eventRequestData.hideChat = eventRequestData.hideChat === 'true';
                    if(link.indexOf('http://') !== 0 && link.indexOf('https://') !== 0) {
                        eventRequestData.socialNetworkLink = 'http://' + link;
                    }
                    (new eventRequestModel(eventRequestData)).save((err, newEventRequestdata) => {
                        emailHelper.sendNewEventRequestNotification(req, newEventRequestdata);
                        res.redirect('/user_event_requests/')
                    });
                });
            });
        }
    });

    app.get('/event_request/:eventRequestUid', async function(req, res, next) {
        const result = await tryGetEventRequestData(req, res, req.params.eventRequestUid);
        if(result.eventRequestData) {
            if(result.canEdit) {
                adminDataHelper.updateEventRequestLastOpenDate(result.eventRequestData._id, 'user');
            } else {
                res.redirect('/events');
            }
            const params = {eventRequestData: result.eventRequestData, isCanEdit: result.canEdit};
            utils.getPageHtml('event-request', req, params).then((pageHtml) => res.send(pageHtml));
        } else {
            res.redirect('/events');
        }
    });

    app.put('/event_request/:eventRequestId', async (req, res) => {
        const eventRequestId = req.params.eventRequestId;
        const result = await tryGetEventRequestData(req, res, eventRequestId);
        const eventRequestData = result.eventRequestData;
        if(eventRequestData && result.canEdit) {
            adminDataHelper.updateEventRequestData(eventRequestData._id, req.body, () => {
                res.send({success: true});
            });
        } else {
            res.json({success: false});
        }
    });

    app.get('/event_request/:eventRequestUid/copy_event_request', async function(req, res, next) {
        const events = await getEventsData(req);
        res.redirect(`/events/${events[0].uid}/request/new?event_request_reference=${req.params.eventRequestUid}`);
    });

    app.put('/event_request/:eventRequestUid/set_hide_chat/', async function(req, res, next) {
        const result = await tryGetEventRequestData(req, res, req.params.eventRequestUid);
        if(result.eventRequestData) {
            eventRequestModel.findOneAndUpdate({_id: result.eventRequestData._id}, req.body, (err, eventRequestData) => {
                res.send({success: !err, data: eventRequestData});
            });
        } else {
            res.send({success: false, errorText: 'У вас нет доступа к данной заявке'});
        }
    });

    app.put('/event_request/:eventRequestUid/update_photo_description/', async function(req, res, next) {
        const result = await tryGetEventRequestData(req, res, req.params.eventRequestUid);
        if(result.eventRequestData) {
            result.eventRequestData.photosProps[req.body.photoIndex].description = req.body.description;
            const updateData = {photosProps: result.eventRequestData.photosProps};
            eventRequestModel.findOneAndUpdate({_id: result.eventRequestData._id}, updateData, (err, eventRequestData) => {
                res.send({success: !err, data: eventRequestData});
            });
        } else {
            res.send({success: false, errorText: 'У вас нет доступа к данной заявке'});
        }
    });

    app.post('/event_request/:eventRequestUid/send_msg', async function(req, res, next) {
        const result = await tryGetEventRequestData(req, res, req.params.eventRequestUid);
        const eventRequestData = result.eventRequestData;
        if(eventRequestData) {
            adminDataHelper.addEventRequestMessage(req, result.eventRequestData._id, req.body.text, 'user', async (result) => {
                res.send(result);
            });
        } else {
            res.send({success: false, errorText: 'У вас нет доступа к данной заявке'});
        }
    });

    app.post('/event_request/:eventRequestId/add_photo', upload.single('photo'), async function(req, res, next) {
        const eventRequestId = req.params.eventRequestId;
        const result = await tryGetEventRequestData(req, res, eventRequestId);
        const eventRequestData = result.eventRequestData;
        if(eventRequestData) {
            const targetPath = getEventRequestPhotoFolderPath(eventRequestData.eventData[0].uid, eventRequestData.uid);
            uploadHelper.tryUploadFiles(targetPath, req, async (photoUrl) => {
                const photosProps = (eventRequestData.photosProps || []).concat({url: photoUrl});
                await adminDataHelper.updateEventRequest(eventRequestId, {photosProps});
                res.send(photoUrl);
                adminDataHelper.updateEventRequestLastActionDate(eventRequestId, 'user');
            });
        } else {
            res.send('');
        }
    });

    app.get('/user_event_requests/', async function(req, res, next) {
        if(utils.checkAuth(req, res)) {
            const eventRequestList = await adminDataHelper.getEventRequestList({userId: req.session.logedInUserData._id});
            const params = {
                eventRequestList: eventRequestList.content,
                showEventName: true,
                showUserName: eventRequestList.content.length > 1
            };
            utils.getPageHtml('event-requests', req, params).then((pageHtml) => res.send(pageHtml));
        }
    });
};

module.exports.getEventsData = getEventsData;

async function sendEventsPageHtml(req, res, eventsYear) {
    if(isNaN(eventsYear)) {
        res.redirect('/');
        return;
    }
    const yearList = await getEventYears();
    if(yearList.indexOf(eventsYear) === -1) {
        eventsYear = yearList[0] || (new Date).getFullYear();
    }

    const eventsData = await getEventsData(req, eventsYear);
    const params = {eventsYear, yearList, eventsData: eventsData || []};
    utils.getPageHtml('events', req, params).then((pageHtml) => res.send(pageHtml));
};

async function getEventsData(req, eventsYear) {
    return new Promise((resolve) => {
        var aggArgs = [
            {$match: getYearFilter(eventsYear)}, {$sort: {date: 1}},
            {
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
                    'eventRequests._id': 1,
                    'eventRequests.uid': 1,
                    'eventRequests.userId': 1,
                    'eventRequests.participantName': 1,
                    'eventRequests.isCostumeAccepted': 1,
                    'eventRequests.isArmorAccepted': 1,
                    'eventRequests.status': 1,
                    'eventRequests.isDisabled': 1,
                    'eventRequests.user': {$arrayElemAt: ['$eventRequests.users', 0]}
                }, 'event')
            }, {
                $group: {
                    _id: '$_id',
                    eventRequests: {$push: '$eventRequests'},
                    uid: {$first: '$uid'},
                    title: {$first: '$title'},
                    html: {$first: '$html'},
                    date: {$first: '$date'},
                    acceptRequestEndDate: {$first: '$acceptRequestEndDate'}
                }
            }
        ];
        if(req.session.logedInUserData) {
            aggArgs = aggArgs.concat([{
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

async function getEventYears() {
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

async function tryGetEventRequestData(req, res, eventRequestId) {
    return new Promise(async (resolve) => {
        const eventRequestData = await adminDataHelper.getEventRequest(eventRequestId);
        resolve({
            canEdit: req.session.logedInUserData && eventRequestData && eventRequestData.userId.toString() == req.session.logedInUserData._id,
            eventRequestData
        });
    });
};

function getEventRequestPhotoFolderPath(eventUid, eventRequestUid) {
    return path.join('event-requests', eventUid, eventRequestUid);
};

function getYearFilter(year) {
    const fromDate = moment((year || 1970) + '-01-01T00:00:00').toDate();
    const toDate = moment((year || (new Date).getFullYear()) + '-12-31T23:59:59').toDate();
    return {$and: [{date: {$gt: fromDate}}, {date: {$lt: toDate}}]};
};