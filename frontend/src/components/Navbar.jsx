import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [shopOpen, setShopOpen] = useState(false)
  const shopRef = useRef(null)
  const hoverTimeout = useRef(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)


  useEffect(() => {
    const token = localStorage.getItem("access_token")
    setIsLoggedIn(!!token)
  }, [])

  function handleLogout() {
    localStorage.removeItem("access_token")
    setIsLoggedIn(false)
    navigate("/login")
  }



  useEffect(() => {
    function handleOutsideClick(e) {
      if (shopRef.current && !shopRef.current.contains(e.target)) {
        setShopOpen(false)
      }
    }

    function handleEsc(e) {
      if (e.key === 'Escape') setShopOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEsc)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEsc)
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
              aria-haspopup="menu"
              aria-expanded={shopOpen}
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
              role="menu"
            >
              <Link
                to="/category/Women"
                className="block px-4 py-2 hover:bg-gray-50"
                role="menuitem"
              >
                Women
              </Link>
              <Link
                to="/category/Men"
                className="block px-4 py-2 hover:bg-gray-50"
                role="menuitem"
              >
                Men
              </Link>
              <Link
                to="/category/Accessories"
                className="block px-4 py-2 hover:bg-gray-50"
                role="menuitem"
              >
                Accessories
              </Link>
            </div>
          </div>

          <Link to="/cart" className="text-gray-700 hover:text-gray-900">
            View Cart
          </Link>

              <div className="relative">
  <div
    onClick={() => setOpen(!open)}
    className="w-9 h-9 rounded-full bg-gray-800 text-white flex items-center justify-center cursor-pointer"
  >
    <span className="text-sm font-semibold">U</span>
  </div>

  {open && (
    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow">
      {isLoggedIn ? (
        <>
          <Link
            to="/profile/edit"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm hover:bg-gray-100"
          >
            Update Profile
          </Link>

          <button
            onClick={() => {
              setOpen(false)
              handleLogout()
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </>
      ) : (
        <Link
          to="/login"
          onClick={() => setOpen(false)}
          className="block px-4 py-2 text-sm hover:bg-gray-100"
        >
          Login
        </Link>
      )}
    </div>
  )}
</div>

        </nav>
      </div>
    </header>
  )
}
