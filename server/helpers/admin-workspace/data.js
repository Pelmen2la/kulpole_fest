const mongoose = require('mongoose');
const userModel = require('./../../models/user');
const systemUserModel = require('./../../models/system-user');
const eventModel = require('./../../models/event');
const eventRequestModel = require('./../../models/event-request');
const eventRequestMessageModel = require('./../../models/event-request-message');
const newsModel = require('./../../models/news');
const clubModel = require('./../../models/club');
const commonUtils = require('./../../common/utils');
const emailHelper = require('./../../helpers/email');


const ROWS_ON_PAGE = 20;

const dataModelsCfg = {
    user: {
        model: userModel,
        hasMultipleName: true
    },
    news: {
        model: newsModel,
        hasMultipleName: false
    },
    event: {
        model: eventModel,
        hasMultipleName: true
    },
    eventRequest: {
        model: eventRequestModel,
        hasMultipleName: true
    },
    systemUser: {
        model: systemUserModel,
        hasMultipleName: true
    },
    club: {
        model: clubModel,
        hasMultipleName: true
    }
};

module.exports = {
    dataModelsCfg,
    addEventRequestMessage,
    updateEventRequestLastActionDate,
    updateEventRequestLastOpenDate
};

for(var key in dataModelsCfg) {
    createCRUD(key, dataModelsCfg[key].model);
}

function createCRUD(dataModelName, model) {
    const capName = dataModelName[0].toUpperCase() + dataModelName.substring(1);

    module.exports[`get${capName}List`] = async function(params) {
        const filters = getDataModelSpecificFilters(dataModelName, params),
            queryOpts = getListQueryOptions(params),
            lookupArgs = getListDataModelLookupArgs(dataModelName),
            filterArg = {$match: filters},
            aggArgs = lookupArgs.concat([filterArg, {$skip: queryOpts.skip}, {$limit: queryOpts.limit}]),
            countAggArgs = lookupArgs.concat([filterArg, {$group: {_id: null, count: {$sum: 1}}}]);
        return new Promise((resolve) => {
            model.aggregate(aggArgs).exec().then(function(data) {
                model.aggregate(countAggArgs).exec().then(function(countData) {
                    const total = countData.length ? countData[0].count : 0;
                    resolve({
                        content: data,
                        totalPages: Math.ceil(total / ROWS_ON_PAGE)
                    });
                });
            });
        });
    };

    module.exports[`add${capName}`] = async function(data) {
        return new Promise((resolve) => {
            (new model(data)).save((err, userData) => {
                resolve(err ? null : userData);
            });
        })
    };

    module.exports[`get${capName}`] = async function(id) {
        const lookupArgs = getSingleRecordLookupArgs(dataModelName);
        // GUID to object ID
        if(id.length >= 24) {
            id = idToObj(id);
        }
        return new Promise((resolve) => {
            model.aggregate(lookupArgs.concat([{$match: {$or: [{_id: id}, {uid: id}]}}])).exec().then((data) => {
                resolve(data.length ? data[0] : null);
            });
        });
    };

    module.exports[`update${capName}`] = function(id, data) {
        delete data._id;
        return new Promise((resolve) => {
            model.findOneAndUpdate({_id: id}, data, (err, data) => {
                resolve(err ? null : data);
            });
        });
    };

    module.exports[`delete${capName}`] = function(id) {
        return new Promise((resolve) => {
            model.findOneAndDelete({_id: id}, (err, data) => {
                resolve(err ? null : data);
            });
        });
    };
};

function getDataModel(name) {
    return dataModelsCfg[name].model;
};

function getDataModelSpecificFilters(modelName, params) {
    var filters = [];
    if(modelName == 'user') {
        filters.push(getSearchFilterConditions(['name', 'surname', 'club', 'email', 'phone'], params.searchText || ''));
    } else if(modelName == 'news') {
        filters.push(getSearchFilterConditions(['title', 'html'], params.searchText || ''));
    } else if(modelName == 'club') {
        filters.push(getSearchFilterConditions(['name'], params.searchText || ''));
    } else if(modelName == 'eventRequest') {
        const searchFields = ['eventData.title', 'userData.name', 'userData.surname', 'userData.fullName', 'userData.reverseFullName'];
        filters.push(getSearchFilterConditions(searchFields, params.searchText || ''));
        if(params.userId) {
            filters.push({userId: idToObj(params.userId)});
        }
        ['isCostumeAccepted', 'isArmorAccepted'].forEach((propName) => {
            if(params[propName] !== undefined) {
                let filter = {};
                filter[propName] = params[propName] === 'yes';
                filters.push(filter);
            }
        });
        if(params.regionFilter !== undefined) {
            filters.push({region: {$in: params.regionFilter.split(',')}});
        }
    }
    return filters.length ? {$and: filters} : {};
};

function getListDataModelLookupArgs(modelName) {
    if(modelName == 'eventRequest') {
        return [{
            $lookup: {
                from: eventModel.collection.collectionName,
                localField: 'eventId',
                foreignField: '_id',
                as: 'eventData'
            }
        }, {
            $lookup: {
                from: userModel.collection.collectionName,
                localField: 'userId',
                foreignField: '_id',
                as: 'userData'
            }
        }, {
            $project: commonUtils.addModelKeysToObject({
                dateDiff: { $subtract: ['$adminLastOpenDate', '$userLastActionDate'] },
                chatMessages: '$chatMessages',
                eventData: '$eventData',
                userData: {
                    "$map": {
                        input: "$userData",
                        as: "u",
                        in: commonUtils.addModelKeysToObject({
                            fullName: {"$concat": ["$$u.name", " ", "$$u.surname"]},
                            reverseFullName: {"$concat": ["$$u.surname", " ", "$$u.name"]}
                        }, 'user', (field) => '$$u.' + field)
                    }
                }
            }, 'event_request')
        }, {$sort: {'dateDiff': 1}}]
    }
    return [];
};

function getSingleRecordLookupArgs(modelName) {
    if(modelName == 'eventRequest') {
        return [{
            $lookup: {
                from: eventModel.collection.collectionName,
                localField: 'eventId',
                foreignField: '_id',
                as: 'eventData'
            }
        }, {
            $lookup: {
                from: userModel.collection.collectionName,
                localField: 'userId',
                foreignField: '_id',
                as: 'userData'
            }
        }, {
            $lookup: {
                from: eventRequestMessageModel.collection.collectionName,
                localField: '_id',
                foreignField: 'eventRequestId',
                as: 'chatMessages'
            }
        }, {
            $project: commonUtils.addModelKeysToObject({
                dateDiff: {$subtract: ['$adminLastOpenDate', '$userLastActionDate']},
                chatMessages: '$chatMessages',
                eventData: '$eventData',
                userData: '$userData'
            }, 'event_request')
        }, {$sort: {'chatMessages.date': -1}}]
    }
    return [];
};

function getSearchFilterConditions(searchFields, searchText) {
    var searchFilter = searchFields.map(function(field) {
        var filter = {};
        filter[field] = {"$regex": searchText, "$options": "i"};
        return filter;
    });
    return {$or: searchFilter};
}

function getListQueryOptions(params) {
    return {
        skip: params.pageIndex  ? ROWS_ON_PAGE * params.pageIndex : 0,
        limit: params.pageIndex  ? ROWS_ON_PAGE : 999999999
    };
};

async function addEventRequestMessage(req, eventRequestId, text, owner, clb) {
    eventRequestModel.findById(idToObj(eventRequestId), async (err, eventRequestData) => {
        if(!eventRequestData || err) {
            clb({success: false, errorText: 'Заявка не найдена'});
        }
        const newMessageData = {
            eventRequestId: eventRequestData.get('_id'),
            owner: owner,
            text
        };
        await emailHelper.sendEventRequestNewMsgNotification(req, eventRequestData, text, owner);
        updateEventRequestLastActionDate(eventRequestId, owner).then(() => {
            (new eventRequestMessageModel(newMessageData)).save((err, messageData) => {
                clb({success: true, messageData});
            });
        });
    });
};

function updateEventRequestLastActionDate(eventRequestId, actionOwner) {
    return getUpdateEventRequestDatePromise(eventRequestId, actionOwner + 'LastActionDate');
};

function updateEventRequestLastOpenDate(eventRequestId, actionOwner) {
    return getUpdateEventRequestDatePromise(eventRequestId, actionOwner + 'LastOpenDate');
};

function getUpdateEventRequestDatePromise(eventRequestId, dateType) {
    return new Promise((resolve) => {
        let updateData = {};
        updateData[dateType] = new Date;
        eventRequestModel.findOneAndUpdate({_id: idToObj(eventRequestId)}, updateData, resolve);
    });
};

function idToObj(id) {
    return id instanceof mongoose.Types.ObjectId ? id : mongoose.Types.ObjectId(id);
};