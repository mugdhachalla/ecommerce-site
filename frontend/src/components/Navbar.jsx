import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [open, setOpen] = useState(false)        // mobile menu
  const [shopOpen, setShopOpen] = useState(false) // desktop dropdown
  const shopRef = useRef(null)

  // close dropdown when clicking outside
  useEffect(() => {
    function handleDocClick(e) {
      if (shopRef.current && !shopRef.current.contains(e.target)) {
        setShopOpen(false)
      }
    }
    function handleEsc(e) {
      if (e.key === 'Escape') setShopOpen(false)
    }
    document.addEventListener('mousedown', handleDocClick)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleDocClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  // optional small delay to reduce flicker on fast mouse moves
  let hoverTimeout = useRef(null)

  const handleMouseEnter = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current)
      hoverTimeout.current = null
    }
    setShopOpen(true)
  }

  const handleMouseLeave = () => {
    // small delay so pointer can move from button to menu without closing
    hoverTimeout.current = setTimeout(() => setShopOpen(false), 120)
  }

  const toggleShop = () => {
    setShopOpen(s => !s)
  }

  const handleShopKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleShop()
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setShopOpen(true)
      // focus could be set to first menu item here if needed
    }
  }

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-800">MyShop</Link>

        <nav className="hidden md:flex gap-4 items-center">
          <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>

          {/* Shop dropdown: hover opens on desktop, click toggles for keyboard users */}
          <div
            className="relative"
            ref={shopRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={toggleShop}
              onKeyDown={handleShopKey}
              aria-haspopup="menu"
              aria-expanded={shopOpen}
              className="text-gray-700 hover:text-gray-900 flex items-center gap-1"
            >
              Shop ▾
            </button>

            <div
              className={
                "absolute left-0 mt-2 w-44 bg-white border rounded shadow-lg transition-opacity " +
                (shopOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
              }
              role="menu"
              aria-label="Shop"
            >
              <Link to="/category/Women" className="block px-3 py-2 hover:bg-gray-50" role="menuitem">Women</Link>
              <Link to="/category/Men" className="block px-3 py-2 hover:bg-gray-50" role="menuitem">Men</Link>
              <Link to="/category/Accessories" className="block px-3 py-2 hover:bg-gray-50" role="menuitem">Accessories</Link>
            </div>
          </div>

          <Link to="/cart" className="block px-3 py-2 hover:bg-gray-50">View Cart</Link>
          <Link to="/login" className="text-gray-700 hover:text-gray-900">Login</Link>
        </nav>

        {/* mobile */}
        <button className="md:hidden" onClick={() => setOpen(o => !o)} aria-label="menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* simple mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 flex flex-col gap-2">
            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/category/Women" onClick={() => setOpen(false)}>Women</Link>
            <Link to="/category/Men" onClick={() => setOpen(false)}>Men</Link>
            <Link to="/category/Accessories" onClick={() => setOpen(false)}>Accessories</Link>
            <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
          </div>
        </div>
      )}
    </header>
  )
}
