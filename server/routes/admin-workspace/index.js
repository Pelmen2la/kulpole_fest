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
                const club = er.club;
                if(!eventRequestsByClubs[club]) {
                    eventRequestsByClubs[club] = [];
                }
                eventRequestsByClubs[club].push(er);
            });

            const clubKeys = Object.keys(eventRequestsByClubs).sort((a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : -1);
            const eventRequestsByClubsArray = clubKeys.map(k => eventRequestsByClubs[k].sort((a, b) => {
                    return getUserFullName(a.user[0]).toLowerCase() > getUserFullName(b.user[0]).toLowerCase() ? 1 : -1;
                })
            );

            //res.send(eventRequestsData);
            const csvReportContent = eventRequestsByClubsArray.map(eventRequests => {
                const requestsContent = eventRequests.map(er => {
                    const user = er.user[0];
                    return `;${getUserFullName(user)};${er.role};${global.textResources.eventRequestRegions[er.region]}`;
                }).join('\n');

                return `Клуб: ${eventRequests[0].clubName}\n;Имя;Роль;Регион;\n` + requestsContent;
            }).join('\n\n');

            const fileName = `event reuests ${(new Date()).toISOString().split('T')[0]}`;
            res.setHeader('Content-disposition', `attachment; filename=${fileName}.csv`);
            res.set('Content-Type', 'text/csv; charset=utf-8');
            res.status(200).send(csvReportContent);
        });
    });
};