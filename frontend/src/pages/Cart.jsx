import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function CartPage() {
  const [cart, setCart] = useState([])

  useEffect(() => {
    const raw = localStorage.getItem('cart') || '[]'
    try {
      setCart(JSON.parse(raw))
    } catch {
      setCart([])
    }
  }, [])

  function updateQty(id, qty) {
    const updated = cart.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, qty) } : item
    )
    setCart(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  function removeItem(id) {
    const updated = cart.filter(item => item.id !== id)
    setCart(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const formatMoney = v =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
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
              key={item.id}
              className="flex gap-4 p-4 border rounded-lg items-center"
            >
              <img
                src={item.image_url || `https://picsum.photos/seed/cart-${item.id}/120/120`}
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
                    value={item.qty}
                    onChange={e =>
                      updateQty(item.id, Number(e.target.value))
                    }
                    className="w-20 border rounded px-2 py-1"
                  />

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="font-medium">
                {formatMoney(item.price * item.qty)}
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

          <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Proceed to checkout
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
