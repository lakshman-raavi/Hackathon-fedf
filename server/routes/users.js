const express = require("express")
const { auth } = require("../middleware/auth")
const User = require("../models/User")
const Event = require("../models/Event")

const router = express.Router()

router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("enrolledActivities", "name category")
      .populate("attendanceRecords.eventId", "title date")
      .populate("attendanceRecords.activityId", "name")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/:id/registered-events", auth, async (req, res) => {
  try {
    const events = await Event.find({ attendees: req.params.id })
      .select("_id title date time location pointsPerEvent")
      .populate("activityId", "name")

    res.json(events)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get user leaderboard (top students by points)
router.get("/leaderboard/top", async (req, res) => {
  try {
    const topUsers = await User.find({ role: "student" }).select("name points").sort({ points: -1 }).limit(10)

    res.json(topUsers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all pending users (admin only)
router.get("/pending", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." })
    }

    const pendingUsers = await User.find({ roleStatus: "pending" }).select("-password")
    res.json(pendingUsers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update user status (approve/reject)
router.put("/:id/status", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." })
    }

    const { status } = req.body
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be 'approved' or 'rejected'" })
    }

    const user = await User.findByIdAndUpdate(req.params.id, { roleStatus: status }, { new: true }).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
