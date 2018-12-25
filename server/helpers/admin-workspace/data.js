const mongoose = require('mongoose');
const userModel = require('./../../models/user');
const eventModel = require('./../../models/event');
const eventRequestModel = require('./../../models/event-request');
const eventRequestMessageModel = require('./../../models/event-request-message');
const newsModel = require('./../../models/news');


const ROWS_ON_PAGE = 1;

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
    }
};

module.exports = {
    dataModelsCfg,
    addEventRequestMessage
};

for(var key in dataModelsCfg) {
    createCRUD(key);
}

function createCRUD(dataModelName) {
    const capName = dataModelName[0].toUpperCase() + dataModelName.substring(1),
        model = getDataModel(dataModelName);

    module.exports[`get${capName}List`] = function(params, clb) {
        const filters = getDataModelSpecificFilters(dataModelName, params),
            queryOpts = getListQueryOptions(params),
            lookupArgs = getDataModelLookupArgs(dataModelName),
            filterArg = {$match: filters},
            aggArgs = lookupArgs.concat([{$skip: queryOpts.skip}, {$limit: queryOpts.limit}, filterArg]),
            countAggArgs = lookupArgs.concat([filterArg, {$group: {_id: null, count: {$sum: 1}}}]);
        model.aggregate(aggArgs).exec().then(function(data) {
            model.aggregate(countAggArgs).exec().then(function(countData) {
                const total = countData.length ? countData[0].count : 0;
                clb({
                    content: data,
                    totalPages: Math.ceil(total / ROWS_ON_PAGE)
                });
            });
        });
    };

    module.exports[`add${capName}`] = function(data, clb) {
        (new model(data)).save((err, userData) => {
            clb(err ? null : userData);
        });
    };

    module.exports[`get${capName}`] = function(id, clb) {
        const lookupArgs = getDataModelLookupArgs(dataModelName);
        const objectId = idToObj(id);
        model.aggregate(lookupArgs.concat([{$match: {_id: objectId}}])).exec().then((data) => {
            clb(data.length ? data[0] : {});
        });
    };

    module.exports[`update${capName}`] = function(id, data, clb) {
        delete data._id;
        model.findOneAndUpdate({_id: id}, data, (err, data) => {
            clb(err ? null : data);
        });
    };

    module.exports[`delete${capName}`] = function(id, clb) {
        model.findOneAndDelete(id, (err, data) => {
            clb(err ? null : data);
        });
    };
};

function getDataModel(name) {
    return dataModelsCfg[name].model;
};

function getDataModelSpecificFilters(modelName, params) {
    var filters = {};
    if(modelName == 'user') {
        filters = getSearchFilterConditions(['name', 'surname', 'club', 'email', 'phone'], params.searchText);
    } else if(modelName == 'eventRequest') {
        filters = getSearchFilterConditions(['eventData.title', 'userData.name', 'userData.surname'], params.searchText);
    }
    return filters;
};

function getDataModelLookupArgs(modelName) {
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
        skip: ROWS_ON_PAGE * params.pageIndex,
        limit: ROWS_ON_PAGE
    };
};

function addEventRequestMessage(eventRequestId, text, owner, clb) {
    eventRequestModel.findById(idToObj(eventRequestId), (err, eventRequestData) => {
        if(!eventRequestData || err) {
            clb({success: false, errorText: 'Заявка не найдена'});
        }
        const newMessageData = {
            eventRequestId: eventRequestData.get('_id'),
            owner: owner,
            text
        };
        (new eventRequestMessageModel(newMessageData)).save((err, messageData) => {
            clb({success: true, messageData});
        });
    });
};

function idToObj(id) {
    return mongoose.Types.ObjectId(id);
};