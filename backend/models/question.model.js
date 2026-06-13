const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },

    question: {
      type: String,
    },

    answer: {
      type: String,
    },

    note: {
      type: String,
    },

    isPinned: {
      type: Boolean,
      default: false,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: null,
    },

    topic: {
      type: String,
      default: null,
    },

    followUp: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Question", questionSchema)