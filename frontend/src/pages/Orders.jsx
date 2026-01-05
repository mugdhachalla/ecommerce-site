import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'

export default function Orders(){
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
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
        const res = await api.get('/orders')
        if(mounted) setOrders(res.data.orders || [])
      }catch(err){
        console.error('Failed to load orders', err)
        if(mounted) setError('Failed to load orders')
      }finally{ if(mounted) setLoading(false) }
    }
    load()
    return ()=> mounted = false
  },[navigate])

  const formatMoney = v => {
    try{ return new Intl.NumberFormat('en-IN',{ style: 'currency', currency: 'INR' }).format(Number(v||0)) }
    catch{ return `₹${Number(v||0).toFixed(2)}` }
  }

  if(loading) return <div className="p-6">Loading…</div>
  if(error) return <div className="p-6 text-red-600">{error}</div>
  if(orders.length === 0) return <div className="p-6">No orders found.</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Your orders</h1>
      <ul className="space-y-4">
        {orders.map(o => (
          <li key={o.order_id} className="p-4 border rounded flex items-center justify-between">
            <div>
              <div className="font-medium">Order #{o.order_id}</div>
              <div className="text-sm text-gray-500">Placed: {new Date(o.created_at || Date.now()).toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">{o.items.length} items</div>
            </div>
            <div className="text-right">
              <Link to={`/orders/${o.order_id}`} className="text-indigo-600 hover:underline">View</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
