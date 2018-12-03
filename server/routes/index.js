module.exports = function(app) {
    require('./admin-workspace/index')(app);
    require('./landing/index')(app);
};
