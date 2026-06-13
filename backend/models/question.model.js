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

    evaluation: {
      userAnswer: { type: String },
      score: { type: Number, min: 0, max: 10 },
      strengths: { type: [String], default: [] },
      weaknesses: { type: [String], default: [] },
      idealAnswer: { type: String },
      evaluatedAt: { type: Date },
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Question", questionSchema)