const mongoose = require("mongoose")

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    role: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      required: true,
      min: [0, "Years of experience must be between 0 and 50"],
      max: [50, "Years of experience must be between 0 and 50"],
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value for years of experience"
      }
    },

    topicsToFocus: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
  },
  { timestamps: true },
)

module.exports = mongoose.model("Session", sessionSchema)