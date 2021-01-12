const multer = require('multer');
var multerS3 = require('multer-s3')
const AWS = require('aws-sdk');
const dotenv = require('dotenv');


//configuring AWS
AWS.config.update({ region: 'us-west-2' });

s3 = new AWS.S3({ apiVersion: '2006-03-01' });

// look at buckets
s3.listBuckets(function (err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        //console.log("Success", data.Buckets);
    }
});

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.bucketName,
        key: function (req, file, cb) {
            //console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    })
});

exports.upload = upload;