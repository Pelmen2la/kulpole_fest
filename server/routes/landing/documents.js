const fs = require('fs');
const path = require('path');


module.exports = function(app) {
    app.get('/documents/:documentName', async function(req, res, next) {
        const documentPath = path.join(global.appRoot, '/static/resources/documents/', req.params.documentName);
        const stat = fs.statSync(documentPath);

        res.writeHead(200, {
            'Content-Type': 'application/msword',
            'Content-Length': stat.size
        });

        const readStream = fs.createReadStream(documentPath);
        readStream.pipe(res);
    });
};