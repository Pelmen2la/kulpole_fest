module.exports = {
    getUserList: function(clb) {
        clb([
            {name: '1'},
            {name: '2'},
            {name: '3'},
        ]);
    }
};