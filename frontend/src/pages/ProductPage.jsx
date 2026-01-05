import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from "../api/client"
import { useNavigate } from "react-router-dom"


export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const API_BASE = import.meta.env.VITE_API_BASE || ''

  useEffect(()=>{
    let mounted = true
    async function load(){
      try{
        const res = await fetch(`${API_BASE}/api/products/${id}`)
        if(!res.ok) throw new Error(`Product fetch failed (${res.status})`)
        const data = await res.json()
        if(mounted){
          setProduct(data)
          setQty(data.stock && data.stock > 0 ? 1 : 0)
        }
      }catch(err){
        if(mounted) setError(err.message)
        console.error(err)
      }finally{
        if(mounted) setLoading(false)
      }
    }
    load()
    return ()=> { mounted = false }
  },[id])

  const navigate = useNavigate()

async function addToCart() {
  console.log("ADD TO CART CLICKED")

  const token = localStorage.getItem("access_token")
  console.log("TOKEN:", token)

  if (!token) {
    navigate("/login")
    return
  }

  try {
    const res = await api.post("/cart/add", {
      product_id: product.id,
      quantity: qty
    })
    console.log("ADD TO CART RESPONSE:", res.data)
    navigate("/cart")
  } catch (err) {
    console.error("ADD TO CART ERROR:", err)
  }
}



  const formatMoney = (v) => {
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(v ?? 0))
    }catch{ return `₹${Number(v ?? 0).toFixed(2)}` }
  }

  if(loading) return <div className="p-6">Loading…</div>
  if(error) return <div className="p-6 text-red-500">Error: {error}</div>
  if(!product) return <div className="p-6">Product not found.</div>

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.image_url || `https://picsum.photos/seed/product-${product.id}/900/700`}
            alt={product.name}
            className="w-full rounded-lg shadow object-cover max-h-[600px]"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          {product.brand && <p className="text-gray-600 mb-2">{product.brand}</p>}

          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl font-semibold text-indigo-600">{formatMoney(product.price)}</span>
            <span className="text-sm text-yellow-500">★ {product.rating ?? '—'}</span>
            <span className={`ml-auto text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <p className="text-gray-700 mb-6 whitespace-pre-line">{product.description || 'No description available.'}</p>

          <div className="flex items-center gap-3 mb-6">
            <label className="text-sm text-gray-600">Quantity</label>
            <input
              type="number"
              min="1"
              max={product.stock || 9999}
              value={qty}
              onChange={e=>{
                const v = Math.max(1, Math.min((product.stock || 9999), Number(e.target.value || 1)))
                setQty(v)
              }}
              className="w-20 border rounded px-2 py-1"
              disabled={product.stock <= 0}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={addToCart}
              disabled={product.stock <= 0}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              Add to cart
            </button>

            <Link to="/cart" className="text-sm text-gray-700 hover:underline">View cart</Link>

            {added && <span className="text-green-600 ml-3">Added ✓</span>}
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <div>Category: <span className="font-medium">{product.category}</span></div>
            {product.brand && <div>Brand: <span className="font-medium">{product.brand}</span></div>}
          </div>
        </div>
      </div>
    </div>
  )
}
