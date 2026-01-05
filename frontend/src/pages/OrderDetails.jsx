import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api/client'

export default function OrderDetails(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let mounted = true
    const token = localStorage.getItem('access_token')
    if(!token){
      navigate('/login')
      return
    }

    async function load(){
      try{
        const res = await api.get(`/orders/${id}`)
        if(mounted) setOrder(res.data.order || res.data)
      }catch(err){
        console.error('Failed to load order', err)
        if(mounted) setError('Failed to load order')
      }finally{
        if(mounted) setLoading(false)
      }
    }
    load()
    return ()=>{ mounted = false }
  },[id, navigate])

  const formatMoney = v => {
    try{ return new Intl.NumberFormat('en-IN',{ style: 'currency', currency: 'INR' }).format(Number(v||0)) }
    catch{ return `₹${Number(v||0).toFixed(2)}` }
  }

  if(loading) return <div className="p-6">Loading…</div>
  if(error) return <div className="p-6 text-red-600">{error}</div>
  if(!order) return <div className="p-6">Order not found.</div>

  const items = order.items || []
  const total = order.total ?? items.reduce((s, i) => {
    const price = Number(i.price ?? 0)
    const qty = Number((i.qty ?? i.quantity) ?? 0)
    return s + price * qty
  }, 0)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Order #{order.id}</h2>
            <div className="text-sm text-gray-500">Placed on: {new Date(order.created_at || order.createdAt || Date.now()).toLocaleString()}</div>
            {order.status && <div className="text-sm text-gray-500">Status: <span className="font-medium">{order.status}</span></div>}
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-lg font-semibold text-indigo-600">{formatMoney(total)}</div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Items</h3>
          <ul className="space-y-3">
            {items.map(it => (
              <li key={it.product_id || it.id} className="flex items-center gap-4">
                <img src={it.image_url || `https://picsum.photos/seed/${it.product_id || it.id}/80`} alt={it.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-500">Qty: {it.qty ?? it.quantity}</div>
                </div>
                <div className="text-right font-medium">{formatMoney(((it.price ?? it.unit_price) ?? 0) * (((it.qty ?? it.quantity) ?? 1)))}</div>
              </li>
            ))}
          </ul>
        </div>

        {order.shipping && (
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-2">Shipping</h3>
            <div className="text-sm text-gray-700">{order.shipping.name}</div>
            <div className="text-sm text-gray-500">{order.shipping.address}</div>
          </div>
        )}

        <div className="mt-6 flex gap-3 justify-center">
          <Link to="/orders" className="text-indigo-600 hover:underline">Back to orders</Link>
          <Link to="/" className="text-gray-600 hover:underline">Continue shopping</Link>
        </div>
      </div>
    </div>
  )
}
