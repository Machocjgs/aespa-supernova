const multer = require("multer");
const path = require('path');
const {v4: uuidv4} = require('uuid');

// Setup multer storage for images
const storage = multer.diskStorage({
    destination: function(req,file,cv){
        cv(null, 'images');
    },
    filename: function(req,file,cb){
        const fileExt = path.extname(file.originalname);
        const fileName = `${uuidv4()}${fileExt}`
        cb(null, fileName);
    }
})
// Set up Multer upload middleware
const upload = multer({ storage: storage });
// // For file uploads
// app.post('/upload', upload.single('image'), (req, res) => {
//     res.send('File uploaded successfully');
//   });

module.exports = {
    upload,
    storage,
    multer
};