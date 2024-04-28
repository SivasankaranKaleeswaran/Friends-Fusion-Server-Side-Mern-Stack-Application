import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.listen(3001);


aws.config.update({
    secretAccessKey: process.env.ACCESS_SECRET,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION,
    // Note: 'bucket' is not a valid AWS SDK configuration property
});

const BUCKET_NAME = process.env.BUCKET_NAME;
const s3 = new aws.S3();
let newFilename = null;
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            // This example generates a unique file name by appending the current timestamp
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            newFilename = `${uniqueSuffix}-${file.originalname}`;
            cb(null, newFilename);
        }
    })
});


app.post('/upload', upload.single('file'), async function (req, res, next) {
    res.json({message:'Successfully uploaded ' + req.file.location + ' location!',
filename: {newFilename},location: req.file.location});
});