const express = require("express")
const { auth } = require("../middleware/auth")
const Notification = require("../models/Notification")

const router = express.Router()

// Get user notifications
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId }).sort({ createdAt: -1 })
    res.json(notifications)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Mark notification as read
router.put("/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true })
    res.json(notification)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
