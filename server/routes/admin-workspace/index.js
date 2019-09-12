const utils = require('./../../common/utils');
const dataHelper = require('./../../helpers/admin-workspace/data');
const commonUtils = require('./../../common/utils');
const pug = require('pug');
const path = require('path');

module.exports = function(app) {
    require('./auth')(app);
    require('./api')(app);
    require('./tech')(app);
    require('./upload')(app);

    app.get('/admin/workspace/', function(req, res, next) {
        const params = {
            textResourcesJsonString: JSON.stringify(global.textResources),
            isAdmin: req.session.adminWorkspaceLogedInUserData.isAdmin,
            formatFns: {
                formatDbDateToWeb: commonUtils.formatDbDateToWeb,
                formatUrlToWeb: commonUtils.formatUrlToWeb
            }
        };
        res.send((pug.renderFile(path.join(global.appRoot, '/static/admin-workspace/views/index.pug'), params)));
    });

    app.get('/admin/workspace/events/:eventId/event_requests_list/', function(req, res, next) {
        const eventRequestModel = dataHelper.getDataModel('eventRequest');
        const userModel = dataHelper.getDataModel('user');
        const matchParams = {eventId: dataHelper.idToObj(req.params.eventId), isArmorAccepted: true, isCostumeAccepted: true};
        const aggArgs = [
            {$match: matchParams}, {$sort: {clubName: 1}},
            {
                $lookup: {
                    from: userModel.collection.collectionName,
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            }
        ];

        eventRequestModel.aggregate(aggArgs).exec().then((eventRequestsData) => {
            const eventRequestsByClubs = {};
            const getUserFullName = (user) => {
                const surname = user.surname;
                return (surname + (surname ? ' ' : '') + user.name);
            };

            eventRequestsData.forEach(er => {
                const club = er.club || er.clubName;
                er.region = global.textResources.eventRequestRegions[er.region];
                er.userFullName = er.participantName || getUserFullName(er.user[0]);
                er.club = club;
                if(!eventRequestsByClubs[club]) {
                    eventRequestsByClubs[club] = [];
                }
                eventRequestsByClubs[club].push(er);
            });

            const clubKeys = Object.keys(eventRequestsByClubs).sort((a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : -1);
            const eventRequestsByClubsArray = clubKeys.map(k => eventRequestsByClubs[k].sort((a, b) => {
                    return a.userFullName.toLowerCase() > b.userFullName.toLowerCase() ? 1 : -1;
                })
            );

            res.send((pug.renderFile(path.join(global.appRoot, '/static/admin-workspace/views/event-requests-list.pug'), {eventRequestsByClubsArray})));
        });
    });
};