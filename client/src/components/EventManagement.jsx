"use client"

import { useState, useEffect } from "react"
import "../styles/components.css"
import "../styles/admin-portal.css"

export default function EventManagement({ activities, token }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [formData, setFormData] = useState({
    activityId: "",
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    pointsPerEvent: 10,
  })

  const [createdEvents, setCreatedEvents] = useState([])

  useEffect(() => {
    fetchAllEvents()

    const interval = setInterval(() => {
      console.log("[AUTO-REFRESH] Fetching latest event data...")
      fetchAllEvents()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const fetchAllEvents = async () => {
    try {
      console.log("[EVENT-FETCH] Starting to fetch events for all activities...")
      const allEvents = []

      for (const activity of activities) {
        console.log(`[EVENT-FETCH] Fetching events for activity: ${activity.name} (${activity._id})`)

        const response = await fetch(`http://localhost:5000/api/events/activity/${activity._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const events = await response.json()
          console.log(`[EVENT-FETCH] Received ${events.length} events for ${activity.name}`)

          // Log each event's attendee data
          events.forEach(event => {
            console.log(`[EVENT-DATA] Event: "${event.title}"`)
            console.log(`[EVENT-DATA]   - Attendees array:`, event.attendees)
            console.log(`[EVENT-DATA]   - Attendees count: ${event.attendees?.length || 0}`)
            console.log(`[EVENT-DATA]   - Attendees populated: ${event.attendees?.[0]?.name ? 'YES' : 'NO'}`)
          })

          allEvents.push(...events)
        } else {
          console.error(`[EVENT-FETCH] Failed to fetch events for ${activity.name}:`, response.status)
        }
      }

      console.log(`[EVENT-FETCH] Total events fetched: ${allEvents.length}`)
      setCreatedEvents(allEvents)
    } catch (error) {
      console.error("[EVENT-FETCH] Error fetching events:", error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "pointsPerEvent" ? Number.parseInt(value) : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const eventData = await response.json()
        setCreatedEvents([eventData, ...createdEvents])

        setFormData({
          activityId: "",
          title: "",
          description: "",
          category: "",
          date: "",
          time: "",
          location: "",
          capacity: "",
          pointsPerEvent: 10,
        })
        setIsModalOpen(false)
        alert("Event created successfully")
      } else {
        const error = await response.json()
        alert(error.message || "Failed to create event")
      }
    } catch (error) {
      console.error("Error creating event:", error)
      alert("Error creating event")
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      academic: "#6366F1",
      sports: "#EF4444",
      cultural: "#8B5CF6",
      workshop: "#F59E0B",
      seminar: "#10B981",
      competition: "#EC4899",
      lecture: "#3B82F6",
      other: "#6B7280"
    }
    return colors[category] || colors.other
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setFormData({
      activityId: event.activityId._id || event.activityId,
      title: event.title,
      description: event.description || "",
      category: event.category,
      date: new Date(event.date).toISOString().split('T')[0],
      time: event.time || "",
      location: event.location || "",
      capacity: event.capacity || "",
      pointsPerEvent: event.pointsPerEvent,
    })
    setIsModalOpen(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`http://localhost:5000/api/events/${editingEvent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedEvent = await response.json()
        setCreatedEvents(createdEvents.map(e => e._id === updatedEvent._id ? updatedEvent : e))
        setFormData({
          activityId: "",
          title: "",
          description: "",
          category: "",
          date: "",
          time: "",
          location: "",
          capacity: "",
          pointsPerEvent: 10,
        })
        setEditingEvent(null)
        setIsModalOpen(false)
        alert("Event updated successfully")
      } else {
        const error = await response.json()
        alert(error.message || "Failed to update event")
      }
    } catch (error) {
      console.error("Error updating event:", error)
      alert("Error updating event")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setCreatedEvents(createdEvents.filter(e => e._id !== eventId))
        alert("Event deleted successfully")
      } else {
        const error = await response.json()
        alert(error.message || "Failed to delete event")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      alert("Error deleting event")
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingEvent(null)
    setFormData({
      activityId: "",
      title: "",
      description: "",
      category: "",
      date: "",
      time: "",
      location: "",
      capacity: "",
      pointsPerEvent: 10,
    })
  }

  return (
    <div className="admin-portal-container">
      <div className="portal-header">
        <h1 className="portal-title">Upcoming Events</h1>
        <div className="header-actions">
          <button className="btn-add-event" onClick={() => setIsModalOpen(true)}>
            + Add New Event
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingEvent ? "Edit Event" : "Create New Event"}</h3>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>

            <form onSubmit={editingEvent ? handleUpdate : handleSubmit} className="event-form">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Select Activity</label>
                  <select name="activityId" value={formData.activityId} onChange={handleInputChange} required className="form-control">
                    <option value="">Choose an activity</option>
                    {activities.map((activity) => (
                      <option key={activity._id} value={activity._id}>{activity.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Event Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="form-control" placeholder="e.g., Annual Tech Symposium" />
                </div>

                <div className="form-group full-width">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} required className="form-control">
                    <option value="">Select Category</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="competition">Competition</option>
                    <option value="lecture">Lecture</option>
                    <option value="cultural">Cultural</option>
                    <option value="sports">Sports</option>
                    <option value="academic">Academic</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-control" rows="3" placeholder="Describe the event..." />
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="form-control" />
                </div>

                <div className="form-group">
                  <label>Time</label>
                  <input type="time" name="time" value={formData.time} onChange={handleInputChange} className="form-control" />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="form-control" placeholder="e.g., Auditorium A" />
                </div>

                <div className="form-group">
                  <label>Capacity</label>
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} className="form-control" placeholder="Max attendees" />
                </div>

                <div className="form-group full-width points-group">
                  <label>Points for Attendance</label>
                  <div className="points-input-wrapper">
                    <input type="number" name="pointsPerEvent" value={formData.pointsPerEvent} onChange={handleInputChange} min="1" className="form-control" />
                    <span className="points-badge-preview">Points</span>
                  </div>
                  <p className="form-hint">Students will receive these points automatically upon attendance.</p>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={isLoading}>
                  {isLoading ? (editingEvent ? "Updating..." : "Creating...") : (editingEvent ? "Update Event" : "Create Event")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="events-grid">
        {createdEvents.length > 0 ? (
          createdEvents.map((event) => (
            <div key={event._id} className="modern-event-card">
              <div className="event-card-header">
                <span className="category-badge" style={{ backgroundColor: getCategoryColor(event.category) }}>
                  {event.category?.toUpperCase() || 'EVENT'}
                </span>
                <span className="event-date-badge">
                  📅 {new Date(event.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}
                </span>
              </div>

              <h3 className="event-card-title">{event.title}</h3>

              {event.description && (
                <p className="event-card-description">{event.description}</p>
              )}

              <div className="event-card-details">
                <div className="detail-item">
                  <span className="detail-icon">🕒</span>
                  <span>{event.time || 'TBA'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <span>{event.location || 'TBA'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">👥</span>
                  <span>Capacity: {event.capacity || '∞'}</span>
                </div>
              </div>

              <div className="event-card-stats">
                <div className="stat-item">
                  <span className="stat-value">{event.attendees?.length || 0}</span>
                  <span className="stat-label">Registered</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-value">{event.pointsPerEvent}</span>
                  <span className="stat-label">Points</span>
                </div>
              </div>

              {event.attendance && event.attendance.length > 0 && (
                <div className="attendance-taken-badge">
                  📋 Attendance Taken
                </div>
              )}

              <div className="event-card-actions">
                <button className="btn-card-action btn-edit" onClick={() => handleEdit(event)}>
                  ✏️ Edit
                </button>
                <button className="btn-card-action btn-delete" onClick={() => handleDelete(event._id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state-modern">
            <div className="empty-icon">📅</div>
            <h3>No events found</h3>
            <p>Create your first event to get started!</p>
            <button className="btn-add-event" onClick={() => setIsModalOpen(true)}>
              + Add New Event
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
