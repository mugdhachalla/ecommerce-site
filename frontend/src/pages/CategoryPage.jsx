import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

export default function CategoryPage(){
  const { category } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    setLoading(true)
    const url = `/api/products?category=${encodeURIComponent(category)}`
    fetch(url)
      .then(r=>r.json())
      .then(setProducts)
      .catch(console.error)
      .finally(()=>setLoading(false))
  },[category])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{category}</h1>
      {loading ? <p>Loading…</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  )
}
