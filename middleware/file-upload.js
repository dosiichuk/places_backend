const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const fileUpload = multer({
  limit: 5000000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv4() + '.' + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    //check whether the file is of right type
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mimetype');
    //the callback returns a bool which indicated whether the file passes the filter
    cb(error, isValid);
  },
});

module.exports = fileUpload;
