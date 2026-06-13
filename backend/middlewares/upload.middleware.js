const multer = require("multer")

// Use memory storage — files are uploaded to Cloudinary, not saved locally
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Only .jpeg, .png, and .jpg formats are allowed"), false)
  }
}

const upload = multer({ storage, fileFilter })

module.exports = upload