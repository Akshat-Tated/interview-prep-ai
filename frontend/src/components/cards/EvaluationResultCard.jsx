import React, { useState } from "react"
import { LuCheck, LuTriangleAlert, LuChevronDown, LuFileText } from "react-icons/lu"
import AIResponsePreview from "../AIResponsePreview"

const EvaluationResultCard = ({ evaluation }) => {
  const [showIdealAnswer, setShowIdealAnswer] = useState(false)

  if (!evaluation) return null

  const { score, strengths, weaknesses, idealAnswer } = evaluation

  const getScoreColor = (score) => {
    if (score >= 8) return { bg: "bg-emerald-100", text: "text-emerald-700", ring: "ring-emerald-300" }
    if (score >= 6) return { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-300" }
    return { bg: "bg-red-100", text: "text-red-700", ring: "ring-red-300" }
  }

  const scoreColors = getScoreColor(score)

  return (
    <div className="mt-5 pt-5 border-t border-gray-200">
      <h4 className="text-sm font-semibold text-gray-700 mb-4">
        Evaluation Result
      </h4>

      {/* Score */}
      <div className="flex items-center gap-4 mb-5">
        <div
          className={`flex items-center justify-center w-16 h-16 rounded-full ${scoreColors.bg} ring-4 ${scoreColors.ring}`}
        >
          <div className="text-center">
            <span className={`text-xl font-bold ${scoreColors.text}`}>
              {score}
            </span>
            <span className={`text-xs ${scoreColors.text} block -mt-1`}>
              / 10
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Your Score</p>
          <p className="text-xs text-gray-500">
            {score >= 8
              ? "Excellent work!"
              : score >= 6
                ? "Good effort, room to improve"
                : "Keep practicing!"}
          </p>
        </div>
      </div>

      {/* Strengths */}
      {strengths?.length > 0 && (
        <div className="mb-4">
          <h5 className="text-sm font-semibold text-emerald-700 mb-2 flex items-center gap-1.5">
            <LuCheck className="w-4 h-4" />
            Strengths
          </h5>
          <div className="space-y-1.5">
            {strengths.map((s, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 pl-2 py-1 text-sm text-gray-700"
              >
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weaknesses */}
      {weaknesses?.length > 0 && (
        <div className="mb-4">
          <h5 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-1.5">
            <LuTriangleAlert className="w-4 h-4" />
            Areas to Improve
          </h5>
          <div className="space-y-1.5">
            {weaknesses.map((w, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 pl-2 py-1 text-sm text-gray-700"
              >
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5" />
                {w}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default EvaluationResultCard
