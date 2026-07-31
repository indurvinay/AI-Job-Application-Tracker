const multer = require('multer');

// We tell Multer to store the file temporarily in memory (RAM).
// This is perfect because we need to send the file to Python AND Cloudinary at the same time!
const storage = multer.memoryStorage();

// Security: Only accept PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

// Create the final Multer upload tool
const upload = multer({ storage, fileFilter });

module.exports = upload;
