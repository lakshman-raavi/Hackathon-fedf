"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import ActivityManagement from "../components/ActivityManagement"
import EventManagement from "../components/EventManagement"
import AnalyticsDashboard from "../components/AnalyticsDashboard"
import AttendanceManagement from "../components/AttendanceManagement"
import UserManagement from "../components/UserManagement"
import "../styles/dashboard.css"
import "../styles/admin-modern.css"

export default function AdminDashboard() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("activities")
  const { token, user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate("/")
    } else {
      fetchActivities()
    }
  }, [token])

  const fetchActivities = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/activities", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setActivities(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching activities:", error)
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading Admin Portal...</p>
      </div>
    )
  }

  return (
    <div className="modern-dashboard">
      <header className="modern-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="portal-brand">
              <span className="brand-icon">🎓</span>
              Extra-Curricular Hub
            </h1>
            <span className="admin-badge">ADMIN</span>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
              <div className="user-details">
                <span className="user-name">Welcome, {user?.name}</span>
                <span className="user-role">{user?.role}</span>
              </div>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              <span className="logout-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="modern-nav">
        <div className="nav-container">
          <button
            className={`nav-tab ${activeTab === "activities" ? "active" : ""}`}
            onClick={() => setActiveTab("activities")}
          >
            <span className="tab-icon">📋</span>
            <span className="tab-label">Manage Activities</span>
          </button>
          <button
            className={`nav-tab ${activeTab === "events" ? "active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            <span className="tab-icon">📅</span>
            <span className="tab-label">Manage Events</span>
          </button>
          <button
            className={`nav-tab ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <span className="tab-icon">👥</span>
            <span className="tab-label">Manage Users</span>
          </button>
          <button
            className={`nav-tab ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <span className="tab-icon">📊</span>
            <span className="tab-label">Analytics</span>
          </button>
          <button
            className={`nav-tab ${activeTab === "attendance" ? "active" : ""}`}
            onClick={() => setActiveTab("attendance")}
          >
            <span className="tab-icon">✅</span>
            <span className="tab-label">Attendance</span>
          </button>
        </div>
      </nav>

      <main className="modern-main">
        <div className="content-wrapper">
          {activeTab === "activities" && (
            <ActivityManagement activities={activities} setActivities={setActivities} token={token} />
          )}
          {activeTab === "events" && <EventManagement activities={activities} token={token} />}
          {activeTab === "users" && <UserManagement token={token} />}
          {activeTab === "analytics" && <AnalyticsDashboard token={token} />}
          {activeTab === "attendance" && <AttendanceManagement activities={activities} token={token} />}
        </div>
      </main>
    </div>
  )
}
