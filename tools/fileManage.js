'use strict'
var multer = require('multer');

module.exports = {
    storage:  multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, '../uploads/');
        },
        filename: function (req, file, cb) {
            console.log("Fichero: ", file)
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    }),
    upload:  multer({ //multer settings
        storage: this.storage
    }).single('file'),
}