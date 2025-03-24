const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Define the absolute path for the uploads folder (in your project root directory)
const uploadDir = path.resolve(__dirname, '..', 'uploads'); // Use __dirname to get the absolute path of the uploads folder

// Check if the folder exists, create it if it doesn't
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });  // Make sure subdirectories are created as well
  console.log('Uploads directory created:', uploadDir);  // Log the creation of the directory
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Resolved directory path:', uploadDir);  // Log resolved path
    cb(null, uploadDir);  // Use the absolute path to store the file
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + path.extname(file.originalname);  // Generate a unique file name
    console.log('Generated file name:', fileName);  // Log the generated file name
    cb(null, fileName);
  }
});

// Set up multer with storage, file size limit, and file type filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Check if the file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept file if it's an image
    } else {
      cb(new Error('Only image files are allowed'), false); // Reject if it's not an image
    }
  }
});

module.exports = upload;
