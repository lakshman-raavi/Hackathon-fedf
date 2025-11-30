"use client"

import { useState, useEffect } from "react"
import "../styles/components.css"

export default function NotificationPanel({ token }) {
  const [notifications, setNotifications] = useState([])
  const [showPanel, setShowPanel] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [token])

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setNotifications(data)
      setUnreadCount(data.filter((n) => !n.isRead).length)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchNotifications()
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  return (
    <div className="notification-panel">
      <button className="notification-bell" onClick={() => setShowPanel(!showPanel)}>
        🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {showPanel && (
        <div className="notification-dropdown">
          <h3>Notifications</h3>
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            <ul>
              {notifications.map((notif) => (
                <li key={notif._id} className={notif.isRead ? "read" : "unread"} onClick={() => markAsRead(notif._id)}>
                  <strong>{notif.title}</strong>
                  <p>{notif.message}</p>
                  <small>{new Date(notif.createdAt).toLocaleDateString()}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
