//multer object needed to parse form data in order to upload it
const multer = require('multer');
const { ErrorHandler } = require('./errors');
const storage = multer.memoryStorage({
    destination: function(req, file, callback){
        callback(null, '')
    }
});

const uploadSingleImage = multer({storage}).single('image');

module.exports= {
    uploadSingleImage
}