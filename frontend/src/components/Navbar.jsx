import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar(){
  const [open, setOpen] = useState(false)
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-800">MyShop</Link>

        <nav className="hidden md:flex gap-4 items-center">
          <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
          <div className="relative group">
            <Link to="/category/Shop" className="text-gray-700 hover:text-gray-900">Shop ▾</Link>
            <div className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
              <Link to="/category/Women" className="block px-3 py-2 hover:bg-gray-50">Women</Link>
              <Link to="/category/Men" className="block px-3 py-2 hover:bg-gray-50">Men</Link>
              <Link to="/category/Accessories" className="block px-3 py-2 hover:bg-gray-50">Accessories</Link>
            </div>
          </div>
          <Link to="/cart" className="block px-3 py-2 hover:bg-gray-50">View Cart</Link>

          <Link to="/login" className="text-gray-700 hover:text-gray-900">Login</Link>
        </nav>

        {/* mobile */}
        <button className="md:hidden" onClick={()=>setOpen(o=>!o)} aria-label="menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d={open?"M6 18L18 6M6 6l12 12":"M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* simple mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 flex flex-col gap-2">
            <Link to="/" onClick={()=>setOpen(false)}>Home</Link>
            <Link to="/category/Women" onClick={()=>setOpen(false)}>Women</Link>
            <Link to="/category/Men" onClick={()=>setOpen(false)}>Men</Link>
            <Link to="/category/Accessories" onClick={()=>setOpen(false)}>Accessories</Link>
            <Link to="/login" onClick={()=>setOpen(false)}>Login</Link>
          </div>
        </div>
      )}
    </header>
  )
}
