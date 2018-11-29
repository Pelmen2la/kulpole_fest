const mongoose = require('mongoose');
const UserModel = mongoose.model('user');
const NewsModel = mongoose.model('news');

const ROWS_ON_PAGE = 1;

const dataModelsCfg = {
    user: {
        model:  mongoose.model('user'),
        hasMultipleName: true
    },
    news: {
        model:  mongoose.model('news'),
        hasMultipleName: false
    }
};

module.exports = {
    dataModelsCfg
};

['user', 'news'].forEach(createCRUD);

function createCRUD(dataModelName) {
    const capName = dataModelName[0].toUpperCase() + dataModelName.substring(1),
        model = getDataModel(dataModelName);
    
    module.exports[`get${capName}List`] = function(params, clb) {
        var filters = getDataModelSpecificFilters(dataModelName, params);
        model.find(filters, null, getListQueryOptions(params), (err, data) => {
            model.countDocuments(filters, function (err, totalData) {
                clb({
                    content: data,
                    totalPages: Math.ceil(totalData / ROWS_ON_PAGE)
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
        model.findById(id, (err, data) => {
            clb(err ? null : data);
        });
    },
    module.exports[`update${capName}`] = function(id, data, clb) {
        delete data._id;
        model.findOneAndUpdate({ _id: id }, data, (err, data) => {
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
    return {
        user: UserModel,
        news: NewsModel
    }[name]
};

function getDataModelSpecificFilters(modelName, params) {
    var filters = {};
    if(modelName == 'user') {
        filters = getSearchFilterConditions(['name', 'surname', 'club', 'email', 'phone'], params.searchText);
    }
    return filters;
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