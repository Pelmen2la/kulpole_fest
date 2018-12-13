const multer = require('multer');
const multerInstance = multer({dest: 'upload/'});
const uploadHelper = require('../../helpers/upload');

module.exports = function(app) {
    app.post('/admin/workspace/news/upload_image/', multerInstance.single('file'), function(req, res) {
        const targetPath = '/news/' + (new Date()).getFullYear().toString() + '/';
        uploadHelper.tryUploadFiles(targetPath, req, (imgUrl) => res.send(imgUrl));
    });
};