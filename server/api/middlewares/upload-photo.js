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

/* import { S3Client } from '@aws-sdk/client-s3'
import { createError, defineEventHandler } from 'h3'
import multer from 'multer'
import multerS3 from 'multer-s3'

const s3 = new S3Client({
  credentials: {
    secretAccessKey: process.env.AWSSecretKey,
    accessKeyId: process.env.AWSAccessKeyId,
  },
})

const uploadMiddleware = multer({
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

const multiUploadMiddleware = multer({
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

export default defineEventHandler(async (event) => {
  try {
    // For single file upload
    const singleUpload = () => {
      return new Promise((resolve, reject) => {
        uploadMiddleware.single('file')(event.node.req, event.node.res, (error) => {
          if (error)
            reject(error)
          resolve(event.node.req.file)
        })
      })
    }

    // For multiple files upload
    const multiUpload = () => {
      return new Promise((resolve, reject) => {
        multiUploadMiddleware.array('files')(event.node.req, event.node.res, (error) => {
          if (error)
            reject(error)
          resolve(event.node.req.files)
        })
      })
    }

    // Determine if single or multiple upload based on request
    const isMultiUpload = event.node.req.headers['upload-type'] === 'multiple'
    const result = await (isMultiUpload ? multiUpload() : singleUpload())

    return result
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      message: error.message,
    })
  }
}) */
