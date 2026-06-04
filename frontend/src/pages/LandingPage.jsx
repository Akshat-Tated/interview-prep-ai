import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  LuBrain,
  LuChevronRight
} from "react-icons/lu"

const LandingPage = () => {
  const navigate = useNavigate()

  const [openAuthModal, setOpenAuthModal] = useState(false)
  const [currentPage, setCurrentPage] = useState("login")

  const handleCTA = () => {}

  const featureIcons = []
  return (
    <>
      <div className="w-full min-h-screen bg-linear-to-b from-[#FFFCEF] via-white to-amber-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-linear-to-br from-amber-200/30 to-orange-200/20 rounded-full blur-3xl" />

          <div className="absolute top-1/3 -right-20 w-60 h-60 bg-linear-to-tr from-yellow-200/20 to-amber-100/30 rounded-full blur-3xl" />

          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-linear-to-r from-amber-100/40 to-yellow-100/30 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 pt-8 pb-48 relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center mb-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-linear-to-br from-[#FF9324] to-[#FCD760] rounded-xl flex items-center justify-center">
                <LuBrain className="w-6 h-6 text-white" />
              </div>

              <div className="text-2xl font-bold bg-linear-to-r from-amber-500 to-amber-900 bg-clip-text text-transparent">
                Interview Preparation AI
              </div>
            </div>
            <button
                className="group bg-linear-to-r from-[#FF9324] via-[#F9A83A] to-[#FCD760] text-sm font-semibold text-white px-8 py-3 rounded-full hover:shadow-lg hover:shadow-amber-200/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] relative overflow-hidden"
                onClick={() => setOpenAuthModal(true)}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <LuChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>

                <div className="absolute inset-0 bg-linear-to-r from-amber-600 to-amber-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
          </header>
        </div>
      </div>
      
    </>
  )
}

export default LandingPage
