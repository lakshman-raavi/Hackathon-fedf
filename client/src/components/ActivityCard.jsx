"use client"
import "../styles/components.css"

export default function ActivityCard({ activity, isEnrolled, onRegister, onUnregister, userRole }) {
  const capacityPercentage = (activity.currentEnrollment / activity.maxCapacity) * 100

  return (
    <div className="activity-card">
      <div className="card-header">
        <h3>{activity.name}</h3>
        <span className="category-badge">{activity.category}</span>
      </div>

      <p className="description">{activity.description}</p>

      <div className="schedule-info">
        <p>
          <strong>Schedule:</strong> {activity.schedule?.dayOfWeek} {activity.schedule?.time}
        </p>
        <p>
          <strong>Location:</strong> {activity.schedule?.location}
        </p>
      </div>

      <div className="points-info">
        <p>
          <strong>Points per Attendance:</strong>{" "}
          <span className="points-badge">{activity.pointsPerAttendance || 10}</span>
        </p>
      </div>

      <div className="capacity-info">
        <div className="capacity-bar">
          <div className="capacity-fill" style={{ width: `${capacityPercentage}%` }} />
        </div>
        <p className="capacity-text">
          {activity.currentEnrollment} / {activity.maxCapacity} enrolled
        </p>
      </div>

      {userRole === "student" && (
        <button
          className={`btn ${isEnrolled ? "btn-danger" : "btn-primary"}`}
          onClick={isEnrolled ? onUnregister : onRegister}
        >
          {isEnrolled ? "Unregister" : "Register"}
        </button>
      )}
    </div>
  )
}
