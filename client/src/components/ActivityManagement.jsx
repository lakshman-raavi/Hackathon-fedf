"use client"

import { useState } from "react"
import "../styles/components.css"
import "../styles/activity-modern.css"

export default function ActivityManagement({ activities, setActivities, token }) {
  const [expandedActivity, setExpandedActivity] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "sports",
    maxCapacity: "",
    schedule: {
      dayOfWeek: "",
      time: "",
      location: "",
    },
  })

  const toggleEnrolledView = (activityId) => {
    if (expandedActivity === activityId) {
      setExpandedActivity(null)
    } else {
      setExpandedActivity(activityId)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith("schedule_")) {
      const fieldName = name.replace("schedule_", "")
      setFormData({
        ...formData,
        schedule: {
          ...formData.schedule,
          [fieldName]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:5000/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newActivity = await response.json()
        setActivities([...activities, newActivity])
        setFormData({
          name: "",
          description: "",
          category: "sports",
          maxCapacity: "",
          schedule: {
            dayOfWeek: "",
            time: "",
            location: "",
          },
        })
        alert("Activity created successfully!")
      }
    } catch (error) {
      console.error("Error creating activity:", error)
      alert("Error creating activity")
    }
  }

  const handleDelete = async (activityId) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return

    try {
      const response = await fetch(`http://localhost:5000/api/activities/${activityId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setActivities(activities.filter(a => a._id !== activityId))
        alert("Activity deleted successfully!")
      }
    } catch (error) {
      console.error("Error deleting activity:", error)
      alert("Error deleting activity")
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      sports: "#EF4444",
      club: "#8B5CF6",
      cultural: "#EC4899",
      academic: "#3B82F6",
      other: "#6B7280"
    }
    return colors[category] || colors.other
  }

  const downloadCSV = async (activity) => {
    if (!activity.enrolledStudents || activity.enrolledStudents.length === 0) {
      alert("No students enrolled in this activity")
      return
    }

    try {
      // Fetch events for this activity to check attendance/registration
      const response = await fetch(`http://localhost:5000/api/events/activity/${activity._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      let events = []
      if (response.ok) {
        events = await response.json()
      }

      const csvHeaders = ["Name", "Email", "Enrolled Date", "Registered Events"]
      const csvRows = activity.enrolledStudents.map((student) => {
        // Find events where this student is an attendee
        const studentEvents = events
          .filter(event => event.attendees.some(attendee =>
            (typeof attendee === 'string' ? attendee : attendee._id) === student._id
          ))
          .map(event => `${event.title} (${new Date(event.date).toLocaleDateString()})`)
          .join("; ")

        return [
          student.name || "N/A",
          student.email || "N/A",
          new Date().toLocaleDateString(),
          studentEvents || "None"
        ]
      })

      const csvContent = [csvHeaders.join(","), ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join(
        "\n",
      )

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)

      link.setAttribute("href", url)
      link.setAttribute("download", `${activity.name.replace(/\s+/g, '_')}_students_with_events_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error generating CSV:", error)
      alert("Error generating CSV export")
    }
  }

  return (
    <div className="activity-management-modern">
      <div className="activity-grid">
        {/* Create Form Card */}
        <div className="create-activity-card">
          <div className="card-header-modern">
            <h2>Create New Activity</h2>
            <p className="card-subtitle">Add a new extra-curricular activity</p>
          </div>

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="form-group-modern">
              <label className="form-label-modern">Activity Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="form-input-modern"
                placeholder="e.g., Basketball Club"
              />
            </div>

            <div className="form-group-modern">
              <label className="form-label-modern">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="form-textarea-modern"
                rows="3"
                placeholder="Describe the activity..."
              />
            </div>

            <div className="form-row-modern">
              <div className="form-group-modern">
                <label className="form-label-modern">Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="form-select-modern">
                  <option value="sports">Sports</option>
                  <option value="club">Club</option>
                  <option value="cultural">Cultural</option>
                  <option value="academic">Academic</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group-modern">
                <label className="form-label-modern">Max Capacity</label>
                <input
                  type="number"
                  name="maxCapacity"
                  value={formData.maxCapacity}
                  onChange={handleInputChange}
                  required
                  className="form-input-modern"
                  placeholder="100"
                />
              </div>
            </div>

            <div className="form-row-modern">
              <div className="form-group-modern">
                <label className="form-label-modern">Day of Week</label>
                <input
                  type="text"
                  name="schedule_dayOfWeek"
                  value={formData.schedule.dayOfWeek}
                  onChange={handleInputChange}
                  placeholder="Monday"
                  className="form-input-modern"
                />
              </div>

              <div className="form-group-modern">
                <label className="form-label-modern">Time</label>
                <input
                  type="time"
                  name="schedule_time"
                  value={formData.schedule.time}
                  onChange={handleInputChange}
                  className="form-input-modern"
                />
              </div>
            </div>

            <div className="form-group-modern">
              <label className="form-label-modern">Location</label>
              <input
                type="text"
                name="schedule_location"
                value={formData.schedule.location}
                onChange={handleInputChange}
                className="form-input-modern"
                placeholder="e.g., Sports Complex"
              />
            </div>

            <button type="submit" className="btn-create-modern">
              ✨ Create Activity
            </button>
          </form>
        </div>

        {/* Activities List */}
        <div className="activities-section-modern">
          <div className="section-header-modern">
            <h2>Existing Activities</h2>
            <span className="activity-count-badge">{activities.length} Activities</span>
          </div>

          <div className="activities-grid-modern">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity._id} className="activity-card-modern">
                  <div className="activity-card-header">
                    <span
                      className="activity-category-badge"
                      style={{ backgroundColor: getCategoryColor(activity.category) }}
                    >
                      {activity.category.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="activity-title-modern">{activity.name}</h3>
                  <p className="activity-description-modern">{activity.description}</p>

                  <div className="activity-details-modern">
                    {activity.schedule?.dayOfWeek && (
                      <div className="detail-row-modern">
                        <span className="detail-icon-modern">📅</span>
                        <span>{activity.schedule.dayOfWeek}</span>
                      </div>
                    )}
                    {activity.schedule?.time && (
                      <div className="detail-row-modern">
                        <span className="detail-icon-modern">🕒</span>
                        <span>{activity.schedule.time}</span>
                      </div>
                    )}
                    {activity.schedule?.location && (
                      <div className="detail-row-modern">
                        <span className="detail-icon-modern">📍</span>
                        <span>{activity.schedule.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="activity-stats-modern">
                    <div className="stat-modern">
                      <span className="stat-value-modern">{activity.currentEnrollment || 0}</span>
                      <span className="stat-label-modern">Enrolled</span>
                    </div>
                    <div className="stat-divider-modern"></div>
                    <div className="stat-modern">
                      <span className="stat-value-modern">{activity.maxCapacity}</span>
                      <span className="stat-label-modern">Capacity</span>
                    </div>
                  </div>

                  <div className="activity-card-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px', gap: '10px' }}>
                    <button
                      className="btn-delete-activity-modern"
                      onClick={() => handleDelete(activity._id)}
                    >
                      🗑️ Delete
                    </button>
                    <button
                      className="btn-view-enrolled-modern"
                      onClick={() => toggleEnrolledView(activity._id)}
                      style={{ backgroundColor: '#6366F1', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      👥 View Enrolled
                    </button>
                    <button
                      className="btn-export-activity-modern"
                      onClick={() => downloadCSV(activity)}
                      style={{ backgroundColor: '#10B981', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      📥 Export
                    </button>
                  </div>

                  {expandedActivity === activity._id && (
                    <div className="enrolled-students-list" style={{ marginTop: '20px', borderTop: '1px solid #e5e7eb', paddingTop: '15px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>Enrolled Students ({activity.enrolledStudents?.length || 0})</h4>
                      {activity.enrolledStudents && activity.enrolledStudents.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                          {activity.enrolledStudents.map((student, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', backgroundColor: '#F9FAFB', borderRadius: '6px' }}>
                              <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: '#6B7280' }}>
                                {(student.name || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '13px', fontWeight: '500', color: '#1F2937' }}>{student.name || 'Unknown User'}</span>
                                <span style={{ fontSize: '11px', color: '#6B7280' }}>{student.email || 'No Email'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: '13px', color: '#9CA3AF', fontStyle: 'italic' }}>No students enrolled yet.</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state-activities">
                <div className="empty-icon-modern">📋</div>
                <h3>No activities yet</h3>
                <p>Create your first activity to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
