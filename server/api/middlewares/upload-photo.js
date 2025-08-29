import { S3Client } from '@aws-sdk/client-s3'
import multer from 'multer'
import multerS3 from 'multer-s3'

const s3 = new S3Client({
  credentials: {
    secretAccessKey: process.env.AWSSecretKey,
    accessKeyId: process.env.AWSAccessKeyId,
  },
})

// debugger
const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'vue-amazon-clone-v2',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname })
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString())
    },
  }),
})

const multiUpload = multer({
  storage: multerS3({
    s3,
    bucket: 'vue-amazon-clone-v2',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname })
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString())
    },
  }),
})

export { multiUpload, upload }
