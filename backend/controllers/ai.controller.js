const { GoogleGenAI } = require("@google/genai")
const {
  generateQuestionAnswerPrompt,
  conceptExplainPrompt,
  evaluateAnswerPrompt,
} = require("../utils/prompts")
const Question = require("../models/question.model")

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const prompt = generateQuestionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions,
    )

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: prompt,
    })

    let rawText = response.text

    const cleanedText = rawText
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim()

    const data = JSON.parse(cleanedText)

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    })
  }
}

const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body

    if (!question) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const prompt = conceptExplainPrompt(question)

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: prompt,
    })

    let rawText = response.text

    const cleanedText = rawText
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim()

    const data = JSON.parse(cleanedText)

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate answers",
      error: error.message,
    })
  }
}

const evaluateAnswer = async (req, res) => {
  try {
    const { questionId, userAnswer } = req.body

    if (!questionId || !userAnswer || !userAnswer.trim()) {
      return res.status(400).json({ message: "Question ID and answer are required" })
    }

    if (userAnswer.length > 5000) {
      return res.status(400).json({ message: "Answer must be under 5000 characters" })
    }

    const question = await Question.findById(questionId)

    if (!question) {
      return res.status(404).json({ message: "Question not found" })
    }

    const prompt = evaluateAnswerPrompt(
      question.question,
      question.answer,
      userAnswer,
    )

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: prompt,
    })

    let rawText = response.text

    const cleanedText = rawText
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim()

    const parsed = JSON.parse(cleanedText)

    question.evaluation = {
      userAnswer: userAnswer.trim(),
      score: parsed.score,
      strengths: parsed.strengths,
      weaknesses: parsed.weaknesses,
      idealAnswer: parsed.idealAnswer,
      evaluatedAt: new Date(),
    }

    await question.save()

    res.status(200).json({
      success: true,
      evaluation: question.evaluation,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to evaluate answer",
      error: error.message,
    })
  }
}

module.exports = { generateInterviewQuestions, generateConceptExplanation, evaluateAnswer }