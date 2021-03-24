const eventRequestModel = require('./../../models/event-request');
const clubModel = require('./../../models/club');

module.exports = function(app) {
    app.post('/admin/workspace/clubs/join/', async (req, res) => {
        const {firstClubToJoin, secondClubToJoin} = req.body;
        const eventRequestFilter = {$or: [{club: firstClubToJoin}, {clubName: firstClubToJoin}]};
        const updateData = {club: secondClubToJoin, clubName: secondClubToJoin};

        eventRequestModel.updateMany(eventRequestFilter, updateData, (err) => {
            if(err) {
                res.send({success: false});
                return;
            }
            clubModel.findOneAndDelete({name: firstClubToJoin}, (err) => {
                res.send({success: !err});
            });
        });
    });
};