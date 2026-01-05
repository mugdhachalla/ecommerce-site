import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Home(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(()=>{
    fetch('/api/products')
      .then(r=>r.json())
      .then(data=>{
        setProducts(data)
      })
      .catch(err=>console.error(err))
      .finally(()=>setLoading(false))
  },[])
  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    await api.post("/cart/add", {
      product_id: productId,
      quantity: 1
    });
    alert("Added to cart");

  };

  return (
    <div>
      <section className="relative mb-8">
      <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden bg-[url('https://picsum.photos/seed/hero/1600/900')] bg-cover bg-center">
        
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-6xl mx-auto px-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Discover curated fashion
            </h1>
            <p className="text-gray-200 max-w-xl">
              Shop Men, Women and Accessories with handpicked collections
            </p>
          </div>
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
