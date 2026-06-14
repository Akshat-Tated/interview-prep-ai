import React, { useEffect, useRef, useState } from "react"
import { LuChevronDown, LuPin, LuPinOff, LuSparkles, LuPenLine, LuSend, LuRotateCw, LuFileText } from "react-icons/lu"
import { FaSpinner } from "react-icons/fa"
import AIResponsePreview from "../AIResponsePreview"
import EvaluationResultCard from "./EvaluationResultCard"

const QuestionCard = ({
  question,
  answer,
  difficulty,
  topic,
  followUp,
  onLearnMore,
  isPinned,
  onTogglePin,
  evaluation,
  onEvaluate,
  isEvaluating,
}) => {
  const isValidEvaluation = evaluation && typeof evaluation.score === "number"
  const [activeTab, setActiveTab] = useState(isValidEvaluation ? "practice" : null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [height, setHeight] = useState(0)
  const [showEvalForm, setShowEvalForm] = useState(false)
  const [userAnswer, setUserAnswer] = useState("")
  const [evalResult, setEvalResult] = useState(isValidEvaluation ? evaluation : null)

  const contentRef = useRef(null)

  // Sync evalResult when evaluation prop changes (e.g. after page refresh)
  useEffect(() => {
    const isValid = evaluation && typeof evaluation.score === "number"
    setEvalResult(isValid ? evaluation : null)
    if (isValid) {
      setActiveTab("practice")
    }
  }, [evaluation])

  useEffect(() => {
    if (isExpanded) {
      // Small delay to allow DOM to update before measuring
      const timer = setTimeout(() => {
        const contentHeight = contentRef.current?.scrollHeight || 0
        setHeight(contentHeight + 20)
      }, 50)
      return () => clearTimeout(timer)
    } else {
      setHeight(0)
    }
  }, [isExpanded, showEvalForm, evalResult, isEvaluating, activeTab])

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleEvaluate = async () => {
    if (!userAnswer.trim()) return

    const result = await onEvaluate(userAnswer)

    if (result) {
      setEvalResult(result)
      setShowEvalForm(false)
      setUserAnswer("")
    }
  }

  const handleReEvaluate = () => {
    setShowEvalForm(true)
    setUserAnswer(evalResult?.userAnswer || "")
    setEvalResult(null)
  }

  const MAX_CHARS = 5000

  return (
    <>
      <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:border-gray-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-base shadow-lg shadow-indigo-200">
                Q
              </span>
            </div>

            <h3
              className="flex-1 text-gray-900 font-semibold text-lg cursor-pointer hover:text-indigo-600 transition-colors duration-200 line-clamp-2 leading-relaxed"
              onClick={toggleExpand}
            >
              {question}
            </h3>
          </div>

          {(difficulty || topic) && (
            <div className="flex items-center gap-2 mt-3 pl-14 flex-wrap">
              {difficulty && (
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    {
                      Easy: "bg-emerald-100 text-emerald-700 border-emerald-200",
                      Medium: "bg-amber-100 text-amber-700 border-amber-200",
                      Hard: "bg-red-100 text-red-700 border-red-200",
                    }[difficulty] || "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  {difficulty}
                </span>
              )}
              {topic && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-200">
                  {topic}
                </span>
              )}
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 pl-0 md:pl-14 border-t border-gray-50 md:border-t-0 pt-4 md:pt-0">
            <div
              className={`transition-all duration-300 ${
                isExpanded
                  ? "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full"
                  : "hidden md:flex md:flex-row md:items-center gap-3"
              }`}
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  className="p-2.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all duration-200 active:scale-95 border border-gray-100 md:border-0"
                  onClick={onTogglePin}
                  title={isPinned ? "Unpin question" : "Pin question"}
                >
                  {isPinned ? (
                    <LuPinOff className="w-4 h-4" />
                  ) : (
                    <LuPin className="w-4 h-4" />
                  )}
                </button>

                <button
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-indigo-50 via-purple-50 to-pink-50 hover:from-indigo-100 hover:via-purple-100 hover:to-pink-100 text-indigo-700 rounded-xl text-sm font-medium transition-all duration-200 border border-indigo-200 hover:border-indigo-300 shadow-sm hover:shadow active:scale-95"
                  onClick={() => {
                    setIsExpanded(true)
                    onLearnMore()
                  }}
                >
                  <LuSparkles className="w-4 h-4" />
                  <span>Learn More</span>
                </button>
              </div>

              <button
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border shadow-sm hover:shadow active:scale-95 w-full sm:w-auto ${
                  activeTab === "study"
                    ? "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-indigo-50/50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300"
                }`}
                onClick={() => {
                  setIsExpanded(true)
                  setActiveTab(activeTab === "study" ? null : "study")
                }}
              >
                <LuFileText className="w-4 h-4" />
                <span>Show Ideal Answer</span>
              </button>

              <button
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border shadow-sm hover:shadow active:scale-95 w-full sm:w-auto ${
                  activeTab === "practice"
                    ? "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-emerald-50/50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-indigo-300"
                }`}
                onClick={() => {
                  setIsExpanded(true)
                  if (activeTab === "practice") {
                    setActiveTab(null)
                  } else {
                    setActiveTab("practice")
                    if (!evalResult) {
                      setShowEvalForm(true)
                    }
                  }
                }}
              >
                <LuPenLine className="w-4 h-4" />
                <span>Evaluate My Answer</span>
              </button>
            </div>

            <div className="flex justify-end w-full md:w-auto self-end md:self-center">
              <button
                className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 active:scale-95"
                onClick={toggleExpand}
                title={isExpanded ? "Show Less" : "Show More"}
              >
                <LuChevronDown
                  size={22}
                  className={`transform transition-all duration-500 ease-in ${isExpanded ? "rotate-180 text-indigo-600" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        <div
          className="overflow-hidden transition-all duration-500 ease-in-out bg-linear-to-br from-gray-50 to-white"
          style={{ maxHeight: `${height}px` }}
        >
              <div className="p-6 pt-2 border-t border-gray-100" ref={contentRef}>
                {activeTab === null && (
                  <p className="text-center text-sm text-gray-500 py-6">
                    Click <strong className="text-indigo-600 font-semibold">Show Ideal Answer</strong> to study, or <strong className="text-emerald-600 font-semibold">Evaluate My Answer</strong> to practice.
                  </p>
                )}

                {/* Reference/Ideal Answer (Study Mode) */}
                {activeTab === "study" && (
                  <div className="max-h-[380px] overflow-y-auto pr-2 custom-scrollbar bg-indigo-50/20 p-4 rounded-xl border border-indigo-100">
                    <AIResponsePreview content={answer} />
                  </div>
                )}

                {followUp?.length > 0 && activeTab === "study" && (
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <LuSparkles className="w-3.5 h-3.5 text-indigo-500" />
                      Follow-Up Questions
                      <span className="text-xs font-normal text-gray-400">({followUp.length})</span>
                    </h4>
                    <div className="space-y-2">
                      {followUp.map((q, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold flex items-center justify-center mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-sm text-gray-700 leading-relaxed">{q}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evaluation Form (Practice Mode) */}
                {activeTab === "practice" && showEvalForm && (
                  <div className="mt-5 pt-5 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <LuPenLine className="w-3.5 h-3.5 text-emerald-600" />
                      Your Answer
                    </h4>

                    <textarea
                      className="w-full p-4 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 resize-none transition-all duration-200"
                      rows={6}
                      placeholder="Type your answer here..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value.slice(0, MAX_CHARS))}
                      disabled={isEvaluating}
                    />

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {userAnswer.length} / {MAX_CHARS}
                      </span>

                      <button
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-indigo-500 via-purple-50 to-pink-50 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleEvaluate}
                        disabled={isEvaluating || !userAnswer.trim()}
                      >
                        {isEvaluating ? (
                          <>
                            <FaSpinner className="w-4 h-4 animate-spin" />
                            <span>Evaluating...</span>
                          </>
                        ) : (
                          <>
                            <LuSend className="w-4 h-4" />
                            <span>Evaluate</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Evaluation Result (Practice Mode) */}
                {activeTab === "practice" && evalResult && !showEvalForm && (
                  <>
                     <EvaluationResultCard evaluation={evalResult} />

                     <div className="flex justify-center mt-4">
                       <button
                         className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-xl transition-all duration-200 active:scale-95"
                         onClick={handleReEvaluate}
                       >
                         <LuRotateCw className="w-4 h-4" />
                         Re-evaluate
                       </button>
                     </div>
                  </>
                )}
              </div>
        </div>
      </div>
    </>
  )
}

export default QuestionCard