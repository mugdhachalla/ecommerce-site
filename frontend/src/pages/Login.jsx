import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'


export default function Login() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form className="max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <input className="w-full px-3 py-2 border rounded" type="email" id="email" name="email" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
          <input className="w-full px-3 py-2 border rounded" type="password" id="password" name="password" required />
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" type="submit">Login</button>
      </form>
      <p className="mt-4 text-sm">
        Don't have an account? <Link to="/register" className="text-indigo-600 hover:underline">Register here</Link>.
      </p>
    </div>
  )
}   