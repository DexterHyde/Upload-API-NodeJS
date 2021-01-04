//Connect to aws using sdk
var aws = require('aws-sdk')

//Access key parameters:
const config = require('../config')

//Special characterid needed for each image upload
const uuid = require('uuid')
// Error handler:
const { handleError, ErrorHandler, catchAsync } = require('../helpers/errors')

//Database handler
const imageDB = require('./databaseHandler').insertImageDetails;

//Max Allowed Size

const maxAllowedSize = 500 * 1024; // 500 KB * 1024 (Bytes/KB)

//New s3 environment
const s3 = new aws.S3();

//Key handler for aws
aws.config = new aws.Config();
aws.config.accessKeyId = config.awsConfig.accessKeyId;
aws.config.secretAccessKey = config.awsConfig.secretAcessKey;

//Elastic Search Declaration:
var elasticSearch = require('elasticsearch');
var client = new elasticSearch.Client({
    host: config.elasticSearchPort
});

//image file format and fileSize variables

//Function that will try to upload the parsed image from req to a s3 bucket
function toS3Upload(req, res){

    req.s3Key = uuid.v4();

    //Set important params for s3 bucket upload
    const s3Params = {
        Bucket: config.awsBucketName,
        Key: `${req.s3Key}-${req.imageType}`,
        Body: req.file.buffer
    }

    //Promise to see whether or not the image upload was a success
    return new Promise( (resolve, reject) => {
        return s3.upload(s3Params, (err, data) => {
            if (err) return reject(err);
            return resolve({
                //File was uploaded successfully
                status: "Everything OK"
            })
        })
    })
}

//Validate image size and file type
const validateReq = (req, res, next) => { 
    if (!['jpg','png'].includes(req.imageType)){
        //File extension is incorrect:
        throw new ErrorHandler(400, "File extension is incorrect")
    }
    if (req.fileSize> maxAllowedSize) throw new ErrorHandler(400, "Image is too big");

}

module.exports = {
    uploadImageJS: catchAsync(async (req, res, next) => {
        //Endpoint Validation:
        let fileName = await req.file.originalname.split('.')
        req.imageType = String(fileName[fileName.length -1]);
        req.fileSize = await req.file.size;
        req.name = fileName[0];
        req.description = req.body.Description;
        validateReq(req,res, next)

        let s = await toS3Upload(req, res)
        console.log(fileName)
        let trya = await imageDB(req.name,req.description, req.imageType, req.fileSize)
        try{
            await client.create({
                index:"images",
                type: 'image',
                id: trya.ID,
                body: {
                    description:req.description,
                    fileSize: req.fileSize,
                    imageType:req.imageType,
                    imageName: req.name
                }
            })
        }catch (e){
            console.log("Elastic Search server is not available")
        }
        finally{
                console.log(trya);
                return await res.status(201).send(trya);
        }
        
    })
}