import React, { useContext } from "react"
import { UserContext } from "../../context/UserContext"
import { useNavigate } from "react-router-dom"

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    clearUser()
    navigate("/")
  }

  return (
    user && (
      <div className="flex items-center">
        <img
          src={user.profileImageUrl}
          alt="Profile pic"
          className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full mr-2 sm:mr-3"
        />

        <div className="ml-1 sm:ml-2">
          <div className="text-sm sm:text-base text-black font-bold truncate max-w-[80px] sm:max-w-[150px]">
            {user.name || ""}
          </div>

          <button
            className="text-amber-600 text-xs sm:text-sm font-semibold cursor-pointer hover:underline block"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    )
  )
}

export default ProfileInfoCard