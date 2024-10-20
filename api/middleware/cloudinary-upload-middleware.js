// Import
const path = require('path')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, path.join(__dirname, "../upload-pic")),
    filename:  (req, file, callback) => {
        const {id} = req.user
        const fullFilename = `${id}_${Date.now()}_${Math.round(Math.random()*1000)}${path.extname(file.originalname)}`
        callback(null, fullFilename)
    }
})

module.exports = multer({storage: storage})

// callback null can use error instead