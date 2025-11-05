import React from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function App(){
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            {/* Add product route later: <Route path="/product/:id" element={<ProductPage/>} /> */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
