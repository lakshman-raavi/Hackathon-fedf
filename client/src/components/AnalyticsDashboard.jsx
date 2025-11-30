import { useState, useEffect } from "react"

export default function AnalyticsDashboard({ token }) {
    const [analytics, setAnalytics] = useState({
        totalStudents: 0,
        totalActivities: 0,
        totalEvents: 0,
        activeEvents: 0,
        totalAttendance: 0,
        topActivities: [],
        recentRegistrations: []
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAnalytics()

        // Auto-refresh analytics every 30 seconds
        const interval = setInterval(() => {
            console.log("[ANALYTICS-REFRESH] Fetching latest analytics data...")
            fetchAnalytics()
        }, 30000)

        return () => clearInterval(interval)
    }, [token])

    const fetchAnalytics = async () => {
        try {
            setLoading(true)

            // Fetch students
            let students = []
            try {
                const studentsRes = await fetch("http://localhost:5000/api/auth/students", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (!studentsRes.ok) {
                    console.error(`[ANALYTICS-ERROR] Students fetch failed: ${studentsRes.status}`)
                }
                students = await studentsRes.json()
                console.log(`[ANALYTICS] Fetched ${students.length} students`, students)
            } catch (error) {
                console.error("[ANALYTICS-ERROR] Failed to fetch students:", error)
            }

            // Fetch activities
            let activities = []
            try {
                const activitiesRes = await fetch("http://localhost:5000/api/activities", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (!activitiesRes.ok) {
                    console.error(`[ANALYTICS-ERROR] Activities fetch failed: ${activitiesRes.status}`)
                }
                activities = await activitiesRes.json()
                console.log(`[ANALYTICS] Fetched ${activities.length} activities`, activities)
            } catch (error) {
                console.error("[ANALYTICS-ERROR] Failed to fetch activities:", error)
            }

            // Fetch events
            let events = []
            try {
                const eventsRes = await fetch("http://localhost:5000/api/events", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (!eventsRes.ok) {
                    console.error(`[ANALYTICS-ERROR] Events fetch failed: ${eventsRes.status}`)
                }
                events = await eventsRes.json()
                console.log(`[ANALYTICS] Fetched ${events.length} events`, events)
            } catch (error) {
                console.error("[ANALYTICS-ERROR] Failed to fetch events:", error)
            }

            // Calculate analytics
            const now = new Date()
            const activeEvents = events.filter(event => new Date(event.date) >= now)

            // Calculate total attendance
            let totalAttendance = 0
            events.forEach(event => {
                if (event.attendees) {
                    totalAttendance += event.attendees.length
                }
            })

            // Get top activities by event count
            const activityEventCounts = {}
            events.forEach(event => {
                const activityName = event.activityName || 'Unknown'
                activityEventCounts[activityName] = (activityEventCounts[activityName] || 0) + 1
            })

            const topActivities = Object.entries(activityEventCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)

            // Get recent registrations
            const allRegistrations = []
            events.forEach(event => {
                if (event.registeredStudents) {
                    event.registeredStudents.forEach(student => {
                        allRegistrations.push({
                            studentName: student.name,
                            eventName: event.name,
                            date: event.date
                        })
                    })
                }
            })

            const recentRegistrations = allRegistrations
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10)

            setAnalytics({
                totalStudents: students.length || 0,
                totalActivities: activities.length || 0,
                totalEvents: events.length || 0,
                activeEvents: activeEvents.length || 0,
                totalAttendance,
                topActivities,
                recentRegistrations
            })

            console.log(`[ANALYTICS] Analytics updated:`, {
                totalStudents: students.length,
                totalActivities: activities.length,
                totalEvents: events.length,
                activeEvents: activeEvents.length,
                totalAttendance
            })

            setLoading(false)
        } catch (error) {
            console.error("Error fetching analytics:", error)
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="analytics-loading">
                <div className="loading-spinner"></div>
                <p>Loading Analytics...</p>
            </div>
        )
    }

    return (
        <div className="analytics-dashboard">
            <h2 className="section-title">📊 Analytics Dashboard</h2>

            <div className="analytics-grid">
                <div className="analytics-card">
                    <div className="card-icon" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                        👥
                    </div>
                    <div className="card-content">
                        <h3 className="card-value">{analytics.totalStudents}</h3>
                        <p className="card-label">Total Students</p>
                    </div>
                </div>

                <div className="analytics-card">
                    <div className="card-icon" style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
                        📋
                    </div>
                    <div className="card-content">
                        <h3 className="card-value">{analytics.totalActivities}</h3>
                        <p className="card-label">Total Activities</p>
                    </div>
                </div>

                <div className="analytics-card">
                    <div className="card-icon" style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
                        📅
                    </div>
                    <div className="card-content">
                        <h3 className="card-value">{analytics.totalEvents}</h3>
                        <p className="card-label">Total Events</p>
                    </div>
                </div>

                <div className="analytics-card">
                    <div className="card-icon" style={{ background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" }}>
                        🎯
                    </div>
                    <div className="card-content">
                        <h3 className="card-value">{analytics.activeEvents}</h3>
                        <p className="card-label">Active Events</p>
                    </div>
                </div>

                <div className="analytics-card">
                    <div className="card-icon" style={{ background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" }}>
                        ✅
                    </div>
                    <div className="card-content">
                        <h3 className="card-value">{analytics.totalAttendance}</h3>
                        <p className="card-label">Total Attendance</p>
                    </div>
                </div>
            </div>

            <div className="analytics-details">
                <div className="detail-section">
                    <h3 className="detail-title">🏆 Top Activities</h3>
                    <div className="detail-content">
                        {analytics.topActivities.length > 0 ? (
                            <div className="top-activities-list">
                                {analytics.topActivities.map((activity, index) => (
                                    <div key={index} className="activity-item">
                                        <span className="activity-rank">#{index + 1}</span>
                                        <span className="activity-name">{activity.name}</span>
                                        <span className="activity-count">{activity.count} events</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-data">No activity data available</p>
                        )}
                    </div>
                </div>

                <div className="detail-section">
                    <h3 className="detail-title">📌 Recent Registrations</h3>
                    <div className="detail-content">
                        {analytics.recentRegistrations.length > 0 ? (
                            <div className="registrations-list">
                                {analytics.recentRegistrations.map((reg, index) => (
                                    <div key={index} className="registration-item">
                                        <span className="student-name">{reg.studentName}</span>
                                        <span className="event-name">{reg.eventName}</span>
                                        <span className="reg-date">{new Date(reg.date).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-data">No registration data available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
