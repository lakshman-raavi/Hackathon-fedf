"use client"

import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, AuthContext } from "./context/AuthContext"
import LoginPage from "./pages/LoginPage"
import StudentDashboard from "./pages/StudentDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import "./App.css"

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = React.useContext(AuthContext)

  if (loading) return <div>Loading...</div>

  if (!user) return <Navigate to="/" />

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/student"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
