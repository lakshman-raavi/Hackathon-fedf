"use client"
import { useState, useEffect } from "react"
import "../styles/attendance.css"

export default function AttendanceManagement({ activities = [], token }) {
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [attendees, setAttendees] = useState([])
  const [loading, setLoading] = useState(false)
  const [attendanceStatus, setAttendanceStatus] = useState({})
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0 })

  useEffect(() => {
    if (selectedActivity) {
      fetchEvents(selectedActivity)
    }
  }, [selectedActivity])

  // Refetch events when event selection changes to get fresh data
  useEffect(() => {
    if (selectedEvent && selectedActivity) {
      console.log("[INFO] Event selected, refreshing data...")
      fetchEvents(selectedActivity)
    }
  }, [selectedEvent])

  const fetchEvents = async (activityId) => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/events/activity/${activityId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      console.log("[DEBUG] Fetched events data:", data)

      // Log attendee information for each event
      if (Array.isArray(data)) {
        data.forEach(event => {
          console.log(`[DEBUG] Event "${event.title}" has ${event.attendees?.length || 0} attendees:`, event.attendees)
        })
      }

      setEvents(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching events:", error)
      setEvents([])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (selectedEvent && selectedActivity) {
      const event = events.find((e) => e._id === selectedEvent)
      const activity = activities.find((a) => a._id === selectedActivity)

      console.log("[DEBUG] Selected event:", event?.title)
      console.log("[DEBUG] Selected activity:", activity?.name)

      if (event && activity) {
        // Use enrolled students from the activity as the base list
        // This ensures we can take attendance for everyone enrolled, not just those who registered for the specific event
        const enrolledStudents = Array.isArray(activity.enrolledStudents) ? activity.enrolledStudents : []
        console.log("[DEBUG] Enrolled students count:", enrolledStudents.length)

        setAttendees(enrolledStudents)

        const statusMap = {}
        let presentCount = 0
        let absentCount = 0

        // Map existing attendance records
        if (Array.isArray(event.attendance)) {
          event.attendance.forEach((att) => {
            const sId = att.studentId._id || att.studentId
            statusMap[sId] = att.status
            if (att.status === "present") presentCount++
            if (att.status === "absent") absentCount++
          })
        }

        setAttendanceStatus(statusMap)
        setStats({
          total: enrolledStudents.length,
          present: presentCount,
          absent: absentCount,
        })
      } else {
        console.error("[ERROR] Event or Activity not found!")
        setAttendees([])
      }
    }
  }, [selectedEvent, events, selectedActivity, activities])

  const markAttendance = async (studentId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${selectedEvent}/attendance`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId, status }),
      })

      if (response.ok) {
        const data = await response.json()

        // Update local state immediately for better UX
        setAttendanceStatus((prev) => ({ ...prev, [studentId]: status }))

        // Update stats
        setStats((prev) => {
          const oldStatus = attendanceStatus[studentId]
          let newPresent = prev.present
          let newAbsent = prev.absent

          if (oldStatus === "present") newPresent--
          if (oldStatus === "absent") newAbsent--

          if (status === "present") newPresent++
          if (status === "absent") newAbsent++

          return { ...prev, present: newPresent, absent: newAbsent }
        })

        // Refresh event data to get updated information
        await fetchEvents(selectedActivity)

        console.log("[SUCCESS] Attendance marked:", data.message)
      } else {
        const error = await response.json()
        alert(error.message || "Error marking attendance")
      }
    } catch (error) {
      console.error("Error marking attendance:", error)
      alert("Error marking attendance. Please try again.")
    }
  }

  const downloadCSV = () => {
    if (attendees.length === 0) {
      alert("No attendees to download")
      return
    }

    const event = events.find((e) => e._id === selectedEvent)
    const csvHeaders = ["Event Name", "Event Date", "Student Name", "Email", "Attendance Status", "Points Awarded"]
    const csvRows = attendees.map((student) => {
      const studentId = student._id || student
      const status = attendanceStatus[studentId] || "Not Marked"

      // Find the attendance record for this student to get points
      const attendanceRecord = event?.attendance?.find(a => (a.studentId._id || a.studentId) === studentId)
      const points = attendanceRecord?.pointsAwarded || 0

      // Format date as YYYY-MM-DD for better Excel compatibility
      const eventDate = event?.date ? new Date(event.date).toISOString().split('T')[0] : "N/A"

      return [
        event?.title || "Unknown Event",
        eventDate,
        student.name || "N/A",
        student.email || "N/A",
        status.charAt(0).toUpperCase() + status.slice(1),
        points
      ]
    })

    const csvContent = [csvHeaders.join(","), ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join(
      "\n",
    )

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `${event?.title || "event"}_attendance_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="attendance-container">
      <div className="attendance-header-section">
        <h2>Attendance Management</h2>
        <p className="subtitle">Track student participation and award points</p>
      </div>

      <div className="controls-section">
        <div className="control-group">
          <label>Select Activity</label>
          <select
            className="modern-select"
            value={selectedActivity || ""}
            onChange={(e) => setSelectedActivity(e.target.value)}
          >
            <option value="">-- Choose Activity --</option>
            {activities.map((activity) => (
              <option key={activity._id} value={activity._id}>
                {activity.name}
              </option>
            ))}
          </select>
        </div>

        {selectedActivity && (
          <div className="control-group">
            <label>Select Event</label>
            <select
              className="modern-select"
              value={selectedEvent || ""}
              onChange={(e) => setSelectedEvent(e.target.value)}
            >
              <option value="">-- Choose Event --</option>
              {Array.isArray(events) && events.length > 0 ? (
                events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title} - {new Date(event.date).toLocaleDateString()}
                  </option>
                ))
              ) : (
                <option disabled>No events available</option>
              )}
            </select>
          </div>
        )}
      </div>

      {selectedEvent && (
        <div className="attendance-dashboard">
          <div className="stats-cards">
            <div className="stat-card total">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Registered</div>
            </div>
            <div className="stat-card present">
              <div className="stat-value">{stats.present}</div>
              <div className="stat-label">Present</div>
            </div>
            <div className="stat-card absent">
              <div className="stat-value">{stats.absent}</div>
              <div className="stat-label">Absent</div>
            </div>
            <div className="stat-card pending">
              <div className="stat-value">{stats.total - stats.present - stats.absent}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>

          <div className="action-bar">
            <h3>Student List</h3>
            <div className="action-buttons-group">
              <button
                className="btn-refresh"
                onClick={() => fetchEvents(selectedActivity)}
                title="Refresh data"
              >
                🔄 Refresh
              </button>
              {attendees.length > 0 && (
                <button className="btn-export" onClick={downloadCSV}>
                  <span className="icon">📥</span> Export CSV
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="loading-state">Loading...</div>
          ) : attendees.length > 0 ? (
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Points</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendees.map((student) => {
                    const studentId = student._id || student
                    const currentStatus = attendanceStatus[studentId]

                    // Find the attendance record for this student to get points
                    const attendanceRecord = events
                      .find(e => e._id === selectedEvent)
                      ?.attendance
                      ?.find(a => (a.studentId._id || a.studentId) === studentId)

                    const pointsAwarded = attendanceRecord?.pointsAwarded || 0

                    return (
                      <tr key={studentId} className={`row-${currentStatus || 'pending'}`}>
                        <td>
                          <div className="user-cell">
                            <div className="avatar-circle">
                              {student.name ? student.name.charAt(0).toUpperCase() : "?"}
                            </div>
                            <span className="user-name">{student.name || "Unknown"}</span>
                          </div>
                        </td>
                        <td>{student.email}</td>
                        <td>
                          <span className={`status-badge ${currentStatus || 'pending'}`}>
                            {currentStatus ? currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1) : "Pending"}
                          </span>
                        </td>
                        <td>
                          <span className="points-badge">
                            {pointsAwarded > 0 ? `+${pointsAwarded}` : "0"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className={`btn-icon present ${currentStatus === 'present' ? 'active' : ''}`}
                              onClick={() => markAttendance(studentId, "present")}
                              title={currentStatus ? "Attendance already marked" : "Mark Present"}
                              disabled={!!currentStatus}
                              style={currentStatus ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                            >
                              ✓
                            </button>
                            <button
                              className={`btn-icon absent ${currentStatus === 'absent' ? 'active' : ''}`}
                              onClick={() => markAttendance(studentId, "absent")}
                              title={currentStatus ? "Attendance already marked" : "Mark Absent"}
                              disabled={!!currentStatus}
                              style={currentStatus ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                            >
                              ✗
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No students registered for this event yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
