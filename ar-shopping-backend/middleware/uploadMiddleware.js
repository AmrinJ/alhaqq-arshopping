const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp|glb|gltf/;
    // GLB/GLTF mime types can be tricky
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    // Relaxed MIME checking for AR models, as browsers often send them as application/octet-stream
    if (extname) {
        return cb(null, true);
    } else {
        cb('Error: Images and 3D Models (glb/gltf) only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = upload;
