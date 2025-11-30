"use client"

export default function PointsDisplay({ points = 0, userRole = "student" }) {
  return (
    <div className="points-display">
      <div className={`points-badge ${userRole}`}>
        <span className="points-icon">⭐</span>
        <div className="points-content">
          <p className="points-label">Total Points</p>
          <p className="points-value">{points}</p>
        </div>
      </div>
    </div>
  )
}
