import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../api/client"
import { useAuth } from "../context/AuthContext"


export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()


  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    try {
      const res = await api.post("/auth/login", { email, password })
      login(res.data.access_token)  

      navigate("/")
    } catch {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-black text-white py-2">
          Login
        </button>
      </form>

      <p className="text-xl text-center mt-4">
        New here?{" "}
        <Link to="/signup" className="underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
