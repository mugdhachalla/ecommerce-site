import React, { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { FaUser } from 'react-icons/fa'

export default function Navbar() {
  const [shopOpen, setShopOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const shopRef = useRef(null)
  const profileRef = useRef(null)
  const [profileImage, setProfileImage] = useState(null)
  const [initials, setInitials] = useState('U')
  const hoverTimeout = useRef(null)
  const profileHoverTimeout = useRef(null)
  const navigate = useNavigate()

  const { isAuthenticated, logout } = useAuth()

  function handleLogout() {
    logout()
    setOpen(false)
    navigate("/login")
  }

  useEffect(() => {
    function handleOutsideClick(e) {
      if (shopRef.current && !shopRef.current.contains(e.target)) {
        setShopOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    function handleEsc(e) {
      if (e.key === "Escape") {
        setShopOpen(false)
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("keydown", handleEsc)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("keydown", handleEsc)
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
      if (profileHoverTimeout.current) clearTimeout(profileHoverTimeout.current)
    }
  }, [])

  useEffect(() => {
    try {
      const img = localStorage.getItem('profile_image')
      if (img) {
        setProfileImage(img)
        return
      }

      const rawUserEmail = localStorage.getItem('user_email') || localStorage.getItem('user')
      let init = 'U'
      if (rawUserEmail) {
        try {
          const parsed = JSON.parse(rawUserEmail)
          const identifier = parsed.email || parsed.name || rawUserEmail
          init = identifier.split('@')[0].split(/[^A-Za-z0-9]/).map(s => s[0]).slice(0,2).join('').toUpperCase() || 'U'
        } catch {
          init = (rawUserEmail.split('@')[0][0] || 'U').toUpperCase()
        }
      }
      setInitials(init)
    } catch (e) {
      // ignore
    }
  }, [])

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    setShopOpen(true)
  }

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setShopOpen(false)
    }, 120)
  }

  const handleProfileMouseEnter = () => {
    if (profileHoverTimeout.current) clearTimeout(profileHoverTimeout.current)
    setOpen(true)
  }

  const handleProfileMouseLeave = () => {
    profileHoverTimeout.current = setTimeout(() => {
      setOpen(false)
    }, 180)
  }

  const toggleShop = () => {
    setShopOpen(s => !s)
  }

  return (
    <header className="bg-white shadow relative z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          MyShop
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-gray-900">
            Home
          </Link>

          <div
            ref={shopRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={toggleShop}
              className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
            >
              Shop ▾
            </button>

            <div
              className={
                "absolute left-0 mt-2 w-44 bg-white border rounded shadow-lg transition-all duration-150 " +
                (shopOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-1 pointer-events-none")
              }
            >
              <Link to="/category/Women" className="block px-4 py-2 hover:bg-gray-50">
                Women
              </Link>
              <Link to="/category/Men" className="block px-4 py-2 hover:bg-gray-50">
                Men
              </Link>
              <Link to="/category/Accessories" className="block px-4 py-2 hover:bg-gray-50">
                Accessories
              </Link>
            </div>
          </div>

          <Link to="/cart" className="text-gray-700 hover:text-gray-900">
            View Cart
          </Link>

          {/* Profile dropdown */}
          <div
            ref={profileRef}
            className="relative"
            onMouseEnter={handleProfileMouseEnter}
            onMouseLeave={handleProfileMouseLeave}
          >
            <button
              type="button"
              onClick={() => setOpen(s => !s)}
              aria-haspopup="menu"
              aria-expanded={open}
              className="w-9 h-9 rounded-full bg-gray-800 text-white flex items-center justify-center cursor-pointer transition-all duration-150 overflow-hidden"
            >
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FaUser className="w-5 h-5 text-white" aria-hidden="true" />
              )}
            </button>

            <div
              className={
                "absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg transition-all duration-150 " +
                (open
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-1 pointer-events-none")
              }
              role="menu"
              aria-label="Profile menu"
            >
              {isAuthenticated ? (
                <>
                  <Link to="/orders/view" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-100">
                    View Orders
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-100">
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
