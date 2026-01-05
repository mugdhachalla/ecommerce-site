import React, { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import api from "../api/client"

export default function OrderPlaced() {
  const { state, search } = useLocation()
  const navigate = useNavigate()
  const [order, setOrder] = useState(state?.order || null)
  const orderId = (order && order.id) || state?.orderId || new URLSearchParams(search).get('orderId') || null
  const items = order?.items || []
  const total = order?.total ?? items.reduce((s, i) => {
    const price = Number(i.price ?? 0)
    const qty = Number((i.qty ?? i.quantity) ?? 0)
    return s + price * qty
  }, 0)

  // fetch order from backend when not provided in location state
  useEffect(() => {
    let mounted = true
    async function loadOrder() {
      if (order || !orderId) return
      const token = localStorage.getItem("access_token")
      if (!token) {
        navigate('/login')
        return
      }
      try {
        const res = await api.get(`/orders/${orderId}`)
        if (mounted) setOrder(res.data.order || res.data)
      } catch (err) {
        console.error('Failed to fetch order', err)
      }
    }
    loadOrder()
    return () => { mounted = false }
  }, [orderId])

  // clear cart only after we have a confirmed order
  useEffect(() => {
    if (!order) return
    const token = localStorage.getItem("access_token")
    if (token) {
      api.post("/cart/clear").catch(() => {})
    } else {
      try { localStorage.removeItem("cart") } catch (e) {}
    }
  }, [order])

  const formatMoney = v => {
    try {
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(v ?? 0))
    } catch {
      return `₹${Number(v ?? 0).toFixed(2)}`
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold mb-2">Thank you — your order is confirmed</h1>

        <p className="text-sm text-gray-600 mb-6">We have received your order and are preparing it for shipment.</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Continue shopping
          </button>

          {orderId ? (
            <Link
              to={`/orders/${orderId}`}
              className="text-indigo-600 border border-indigo-600 px-4 py-2 rounded hover:bg-indigo-50 flex items-center justify-center"
            >
              View order
            </Link>
          ) : (
            <button
              onClick={() => navigate('/orders/details')}
              className="text-indigo-600 border border-indigo-600 px-4 py-2 rounded hover:bg-indigo-50"
            >
              View orders
            </button>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-6">
          You will receive an email confirmation shortly. For support, visit our <Link to="/support" className="text-indigo-600 hover:underline">Help Center</Link>.
        </p>
      </div>
    </div>
  )
}