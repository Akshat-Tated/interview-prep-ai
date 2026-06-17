const Session = require("../models/session.model")
const Question = require("../models/question.model")

const createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description, questions } = req.body

    const expNum = Number(experience)
    if (isNaN(expNum) || !Number.isInteger(expNum) || expNum < 0 || expNum > 50) {
      return res.status(400).json({ success: false, message: "Years of experience must be an integer between 0 and 50." })
    }

    const userId = req.user._id

    const session = await Session.create({
      user: userId,
      role,
      experience: expNum,
      topicsToFocus,
      description,
    })

    const questionDocs = await Promise.all(
      questions.map(async (q) => {
        const question = await Question.create({
          session: session._id,
          question: q.question,
          answer: q.answer,
          difficulty: q.difficulty || null,
          topic: q.topic || null,
          followUp: q.followUp || [],
        })

        return question._id
      }),
    )

    session.questions = questionDocs

    await session.save()

    res.status(201).json({ success: true, session })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" })
  }
}

const getMySessions = async (req, res) => {
  try {
    const session = await Session.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("questions")

    res.status(200).json(session)
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" })
  }
}

const getSessionsById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate({
        path: "questions",
        options: { sort: { isPinned: -1, createdAt: 1 } },
      })
      .exec()

    if (!session) {
      return res
        .status(400)
        .json({ success: false, message: "Session not found" })
    }

    res.status(200).json({ success: true, session })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" })
  }
}

const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)

    if (!session) {
      return res
        .status(400)
        .json({ success: false, message: "Session not found" })
    }

    if (session.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this session" })
    }

    await Question.deleteMany({ session: session._id })

    await session.deleteOne()

    res.status(200).json({ message: "Session deleted successfully" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" })
  }
}

module.exports = {
  createSession,
  getMySessions,
  getSessionsById,
  deleteSession,
}