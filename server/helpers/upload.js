const fs = require('fs');
const path = require('path');
const jimp = require('jimp');
const utils = require('./../common/utils');

const IMAGES_FOLDER_PATH = '/static/resources/images';

module.exports = {
    tryUploadFile
};

function tryUploadFile(relativeTargetPath, req, clb) {
    var tmp_path = req.file.path,
        suffix = '',
        tempFilePath = path.join(IMAGES_FOLDER_PATH, 'temp', utils.getUid() + '.jpg'),
        getImageName = function() {
            var name = req.file.originalname,
                dotPos = name.lastIndexOf('.');
            return [name.slice(0, dotPos), suffix, name.slice(dotPos)].join('');
        },
        getTargetFolderPath = function() {
            return path.join(IMAGES_FOLDER_PATH, relativeTargetPath, (new Date()).getFullYear());
        },
        getTargetPath = function() {
            return path.join(getTargetFolderPath(), getImageName())
        };

    var src = fs.createReadStream(tmp_path),
        dest = fs.createWriteStream(tempFilePath);
    src.pipe(dest);

    src.on('end', function() {
        if(!fs.existsSync(getTargetFolderPath())) {
            fs.mkdirSync(getTargetFolderPath());
        }
        while(fs.existsSync(getTargetPath())) {
            suffix = parseInt(suffix + 1);
        }

        var finalTargetPath = getTargetPath();
        jimp.read(tempFilePath, function(err, image) {
            var isAutoHeight = image.bitmap.height < image.bitmap.width;
            image.resize(isAutoHeight ? 1000 : jimp.AUTO, isAutoHeight ? jimp.AUTO : 1000).quality(60).write(finalTargetPath);
            fs.unlink(tempFilePath);
            clb(getTargetPath().split('static/')[1]);
        });
    });
};