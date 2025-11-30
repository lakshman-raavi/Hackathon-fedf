"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import "../styles/auth.css"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")
  const [error, setError] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register"
      const payload = isLogin ? { email, password } : { name, email, password, role }

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message)
        setLoading(false)
        return
      }

      login(data.user, data.token)
      setLoading(false)

      if (data.user.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/student")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="auth-container" onMouseMove={handleMouseMove}>
      <div className="dynamic-background">
        <div
          className="gradient-orb"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
          }}
        ></div>
        <div className="gradient-orb gradient-orb-2"></div>
        <div className="gradient-orb gradient-orb-3"></div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">{isLogin ? "Welcome Back" : "Join Us"}</h1>
          <p className="auth-subtitle">
            {isLogin ? "Sign in to manage your activities" : "Create your account to get started"}
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your.email@example.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="form-input"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Select Your Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="form-select">
                <option value="student">Student</option>
                <option value="admin">Administrator</option>
              </select>
              <p className="form-hint">
                {role === "admin" && "Admin account is instantly active"}
                {role === "student" && "Student account is instantly active"}
              </p>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <p className="toggle-auth">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setError("")
              setName("")
            }}
            className="link-btn"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  )
}
