const express = require("express")
const { 
      registerUser,
      loginUser,
      getUserProfile
    } = require("../controllers/auth.controller")
const { protect } = require("../middlewares/auth.middleware")
const upload = require("../middlewares/upload.middleware")
const cloudinary = require("../config/cloudinary")

const router = express.Router()

// Auth Routes
router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/profile", protect, getUserProfile)

router.post("/upload-image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" })
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "interview-prep-ai" },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      stream.end(req.file.buffer)
    })

    res.status(200).json({ imageUrl: result.secure_url })
  } catch (error) {
    res.status(500).json({ message: "Image upload failed", error: error.message })
  }
})

module.exports = router