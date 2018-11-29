const fs = require('fs');
const path = require('path');
const jimp = require('jimp');
const sharp = require('sharp');
const utils = require('./../common/utils');

const IMAGES_FOLDER_PATH = global.appRoot + '/static/resources/images';

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
            return path.join(IMAGES_FOLDER_PATH, relativeTargetPath, (new Date()).getFullYear().toString());
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
        var image = sharp(tempFilePath);
        image.metadata().then(function(metadata) {
            var sizeLimit = 1000,
                needToResize = metadata.height > sizeLimit || metadata.width > sizeLimit;
            if(needToResize) {
                var isAutoHeight = metadata.height < metadata.width;
                image = image.resize(isAutoHeight ? sizeLimit : null, isAutoHeight ? null : sizeLimit)
            }

            image.toFile(finalTargetPath, () => {
                fs.unlink(tempFilePath, () => {
                });
                clb(getTargetPath().split('static')[1].replace(/\\/g, '/'));
            });
        });
    });
};