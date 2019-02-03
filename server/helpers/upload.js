const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const utils = require('./../common/utils');

const IMAGES_FOLDER_PATH = global.appRoot + '/static/resources/images';

module.exports = {
    tryUploadFiles
};

sharp.cache(false);

function tryUploadFiles(relativeTargetPath, req, clb) {
    if(req.file) {
        tryUploadFileCore(relativeTargetPath, req.file, clb);
    } else if(req.files) {
        var index = 0,
            fileUrls = [],
            uploadFn = function() {
                tryUploadFileCore(relativeTargetPath, req.files[index], function(fileUrl) {
                    fileUrls.push(fileUrl);
                    index++;
                    index < req.files.length ? uploadFn() : clb(fileUrls);
                });
            };
        uploadFn();
    } else {
        clb('');
    }
};

function tryUploadFileCore(relativeTargetPath, file, clb) {
    var tmp_path = file.path,
        suffix = '',
        tempFilePath = path.join(IMAGES_FOLDER_PATH, 'temp', utils.getUid() + '.jpg'),
        getFileName = function() {
            var name = file.originalname,
                dotPos = name.lastIndexOf('.');
            return [name.slice(0, dotPos), suffix, name.slice(dotPos)].join('');
        },
        getTargetFolderPath = function() {
            return path.join(IMAGES_FOLDER_PATH, relativeTargetPath);
        },
        getTargetPath = function() {
            return path.join(getTargetFolderPath(), getFileName())
        };

    var src = fs.createReadStream(tmp_path),
        dest = fs.createWriteStream(tempFilePath);
    src.pipe(dest);

    src.on('end', function() {
        ensureDirExists(IMAGES_FOLDER_PATH, relativeTargetPath).then(() => {
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
    });
};

function ensureDirExists(startFolderPath, relativePath) {
    const parts = relativePath.split('\\');
    var targetPath = startFolderPath,
        i = 0;
    const ensureExists = (clb) => {
        targetPath = path.join(targetPath, parts[i]);
        fs.mkdir(targetPath, () => {
            i++;
            if(parts[i]) {
                ensureExists(clb);
            } else {
                clb();
            }
        });
    };

    return new Promise((resolve) => {
        ensureExists(resolve);
    });
};

