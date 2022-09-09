const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image.jpg': 'jpg',
    'image.jpeg': 'jpg',
    'image/jpeg': 'jpg',
    'image.png': 'png',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        var name = file.originalname.split(' ').join('_');
        name = file.originalname.split('.')[0];
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage: storage }).single('image');