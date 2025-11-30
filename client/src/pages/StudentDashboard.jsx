"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import ActivityCard from "../components/ActivityCard"
import NotificationPanel from "../components/NotificationPanel"
import CalendarView from "../components/CalendarView"
import RecommendationsSection from "../components/RecommendationsSection"
import PointsDisplay from "../components/PointsDisplay"
import QRCodeScanner from "../components/QRCodeScanner"
import "../styles/dashboard.css"

export default function StudentDashboard() {
  const [activities, setActivities] = useState([])
  const [enrolledActivities, setEnrolledActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [events, setEvents] = useState([])
  const [studentPoints, setStudentPoints] = useState(0)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const { token, user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate("/")
    } else {
      fetchActivities()
      fetchUserPoints()
    }
  }, [token])

  const fetchActivities = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/activities", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setActivities(data)
      setEnrolledActivities(data.filter((a) => a.enrolledStudents.some((s) => s._id === user.id)))

      const allEvents = []
      for (const activity of data) {
        if (activity.upcomingEvents && activity.upcomingEvents.length > 0) {
          allEvents.push(...activity.upcomingEvents)
        }
      }
      setEvents(allEvents)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching activities:", error)
      setLoading(false)
    }
  }

  const fetchUserPoints = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setStudentPoints(Number(data.points) || 0)
    } catch (error) {
      console.error("Error fetching user points:", error)
    }
  }

  const handleRegister = async (activityId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/activities/${activityId}/register`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchActivities()
      }
    } catch (error) {
      console.error("Error registering:", error)
    }
  }

  const handleUnregister = async (activityId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/activities/${activityId}/unregister`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchActivities()
      }
    } catch (error) {
      console.error("Error unregistering:", error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  useEffect(() => {
    if (token && user?.id) {
      fetchUserPoints()
      const interval = setInterval(fetchUserPoints, 30000)
      return () => clearInterval(interval)
    }
  }, [token, user?.id])

  if (loading) return <div className="loading">Loading activities...</div>

  const displayedActivities = filter === "enrolled" ? enrolledActivities : activities

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🎓 Student Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        <div className="header-right">
          <PointsDisplay points={studentPoints} userRole="student" />
          <div className="header-actions">
            <button
              className="btn-qr-scan"
              onClick={() => setShowQRScanner(true)}
              title="Scan event QR code to register"
            >
              📱 Scan QR
            </button>
            <NotificationPanel token={token} />
            <button className="btn-logout" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {showQRScanner && (
        <QRCodeScanner
          onScanSuccess={() => {
            fetchActivities()
          }}
          onClose={() => setShowQRScanner(false)}
        />
      )}

      <CalendarView events={events} activities={enrolledActivities} token={token} onRegister={fetchActivities} />

      <div className="dashboard-content">
        <RecommendationsSection userId={user.id} token={token} onRegister={handleRegister} />

        <div className="activities-section">
          <h2>Activities</h2>
          <div className="filter-buttons">
            <button className={`btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
              All Activities
            </button>
            <button className={`btn ${filter === "enrolled" ? "active" : ""}`} onClick={() => setFilter("enrolled")}>
              My Activities
            </button>
          </div>

          <div className="activities-grid">
            {displayedActivities.map((activity) => (
              <ActivityCard
                key={activity._id}
                activity={activity}
                isEnrolled={enrolledActivities.some((a) => a._id === activity._id)}
                onRegister={() => handleRegister(activity._id)}
                onUnregister={() => handleUnregister(activity._id)}
                userRole="student"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
