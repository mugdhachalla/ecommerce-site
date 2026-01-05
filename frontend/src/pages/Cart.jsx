import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../api/client"

export default function CartPage() {
  const [cart, setCart] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      navigate("/login")
      return
    }

    api
      .get("/cart")
      .then(res => {
        setCart(res.data.items || [])
      })
      .catch(err => {
        if (err.response?.status === 401) {
          navigate("/login")
        }
      })
  }, [navigate])

  function updateQty(productId, qty) {
  const safeQty = Math.max(1, qty)

  setCart(prev =>
    prev.map(item =>
      item.product_id === productId
        ? { ...item, quantity: safeQty }
        : item
    )
  )

  api.post("/cart/update", {
    product_id: productId,
    quantity: safeQty
  }).catch(err => {
    console.error("Update quantity failed", err)
  })
}


  function removeItem(productId) {
    api
      .post('/cart/remove', { product_id: productId })
      .then(() => {
        setCart(cart =>
          cart.filter(item => item.product_id !== productId)
        )
      })
      .catch(err => {
        console.error('Remove item failed', err)
      })
  }

  async function handlePlaceOrder() {
    const token = localStorage.getItem('access_token')
    if (!token) {
      navigate('/login')
      return
    }

    // ensure Authorization header for api client (axios)
    if (api && api.defaults && api.defaults.headers) {
      api.defaults.headers.common = api.defaults.headers.common || {}
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    try {
      // call backend to create the order
      const res = await api.post('/orders/place')
      const orderId = res.data.order_id || (res.data.order && res.data.order.order_id) || null

      // server-side handler deletes cart items; ensure UI cleared
      setCart([])

      // navigate to order placed page, pass orderId in state
      navigate('/orders/placed', { state: { orderId, order: res.data.order || null } })
    } catch (err) {
      console.error('Failed to place order', err)
      // fallback: do not clear cart, alert user
      alert('Failed to place order. Please try again.')
    }
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const formatMoney = v =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(Number(v || 0))

  if (cart.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h2 className="text-xl font-semibold mb-3">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">
          Looks like you have not added anything yet
        </p>
        <Link to="/" className="text-blue-600 hover:underline">
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cart.map(item => (
            <div
              key={item.product_id}
              className="flex gap-4 p-4 border rounded-lg items-center"
            >
              <img
                src={
                  item.image_url ||
                  `https://picsum.photos/seed/cart-${item.product_id}/120/120`
                }
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />

              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  {formatMoney(item.price)}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e =>
                      updateQty(
                        item.product_id,
                        Number(e.target.value)
                      )
                    }
                    className="w-20 border rounded px-2 py-1"
                  />

                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="font-medium">
                {formatMoney(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border rounded-lg h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="flex justify-between mb-2 text-sm">
            <span>Items</span>
            <span>{cart.length}</span>
          </div>

          <div className="flex justify-between mb-4 font-medium">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Place Order
          </button>

          <Link
            to="/"
            className="block text-center text-sm text-gray-600 mt-4 hover:underline"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
