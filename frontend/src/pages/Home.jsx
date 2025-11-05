import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'

export default function Home(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    fetch('/api/products')
      .then(r=>r.json())
      .then(data=>{
        setProducts(data)
      })
      .catch(err=>console.error(err))
      .finally(()=>setLoading(false))
  },[])

  return (
    <div>
      <section className="mb-8">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Discover curated fashion</h1>
            <p className="text-gray-600">Shop Men, Women & Accessories — handpicked collections.</p>
          </div>
          <div>
            <img src="https://picsum.photos/seed/hero/900/500" alt="hero" className="rounded-lg shadow" />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Featured products</h2>
        {loading ? <p>Loading…</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0,12).map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}
