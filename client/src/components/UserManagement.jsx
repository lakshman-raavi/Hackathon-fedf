"use client"

import { useState, useEffect } from "react"
import "../styles/components.css"
import "../styles/admin-modern.css"

export default function UserManagement({ token }) {
    const [pendingUsers, setPendingUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPendingUsers()
    }, [token])

    const fetchPendingUsers = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/users/pending", {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (response.ok) {
                const data = await response.json()
                setPendingUsers(data)
            }
        } catch (error) {
            console.error("Error fetching pending users:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (userId, status) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            })

            if (response.ok) {
                setPendingUsers(pendingUsers.filter((user) => user._id !== userId))
                alert(`User ${status} successfully!`)
            } else {
                alert("Failed to update user status")
            }
        } catch (error) {
            console.error("Error updating user status:", error)
            alert("Error updating user status")
        }
    }

    if (loading) {
        return <div className="loading-spinner"></div>
    }

    return (
        <div className="activity-management-modern">
            <div className="section-header-modern">
                <h2>Pending Approvals</h2>
                <span className="activity-count-badge">{pendingUsers.length} Pending</span>
            </div>

            <div className="activities-grid-modern">
                {pendingUsers.length > 0 ? (
                    pendingUsers.map((user) => (
                        <div key={user._id} className="activity-card-modern">
                            <div className="activity-card-header">
                                <span className="activity-category-badge" style={{ backgroundColor: "#F59E0B" }}>
                                    {user.role.toUpperCase()}
                                </span>
                            </div>

                            <h3 className="activity-title-modern">{user.name}</h3>
                            <p className="activity-description-modern">{user.email}</p>

                            <div className="activity-details-modern">
                                <div className="detail-row-modern">
                                    <span className="detail-icon-modern">📅</span>
                                    <span>Registered: {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="activity-card-actions" style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                                <button
                                    className="btn-create-modern"
                                    onClick={() => handleStatusUpdate(user._id, "approved")}
                                    style={{ flex: 1, backgroundColor: "#10B981" }}
                                >
                                    ✅ Approve
                                </button>
                                <button
                                    className="btn-delete-activity-modern"
                                    onClick={() => handleStatusUpdate(user._id, "rejected")}
                                    style={{ flex: 1 }}
                                >
                                    ❌ Reject
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state-activities">
                        <div className="empty-icon-modern">✨</div>
                        <h3>No pending approvals</h3>
                        <p>All users have been processed.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
