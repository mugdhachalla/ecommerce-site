import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({p}){
  return (
    <Link to={`/product/${p.id}`} aria-label={`View ${p.name}`} className="block no-underline">
      <article className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
          <img src={p.image_url || `https://picsum.photos/seed/${p.id}/400`} alt={p.name} className="object-cover w-full h-full"/>
        </div>
        <div className="mt-3">
          <h3 className="font-semibold text-gray-800">{p.name}</h3>
          <p className="text-sm text-gray-500">{p.brand} • {p.category}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-bold text-indigo-600">₹{Number(p.price).toFixed(2)}</span>
            <span className="text-sm text-yellow-500">★ {p.rating ?? '—'}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
