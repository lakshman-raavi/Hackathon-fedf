const express = require("express")
const { auth, adminAuth } = require("../middleware/auth")
const Activity = require("../models/Activity")
const User = require("../models/User")
const Event = require("../models/Event")

const router = express.Router()

// Get all activities
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find().populate("enrolledStudents", "name email").populate("createdBy", "name")
    res.json(activities)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/recommendations/:userId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("enrolledActivities")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const enrolledCategories = user.enrolledActivities.map((a) => a.category)
    const recommendations = await Activity.find({
      _id: { $nin: user.enrolledActivities },
      category: { $in: enrolledCategories },
    })
      .limit(5)
      .populate("enrolledStudents", "name")

    res.json(recommendations)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create activity (admin only)
router.post("/", adminAuth, async (req, res) => {
  try {
    const { name, description, category, schedule, maxCapacity, pointsPerAttendance } = req.body

    const activity = new Activity({
      name,
      description,
      category,
      schedule,
      maxCapacity,
      pointsPerAttendance: pointsPerAttendance || 10,
      createdBy: req.user.userId,
    })

    await activity.save()

    // Populate before returning to match GET endpoint structure
    const populatedActivity = await Activity.findById(activity._id)
      .populate("enrolledStudents", "name email")
      .populate("createdBy", "name")

    console.log(`[ACTIVITY-CREATE] Activity "${populatedActivity.name}" created successfully`)
    res.status(201).json(populatedActivity)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update activity (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("enrolledStudents", "name email")
      .populate("createdBy", "name")

    console.log(`[ACTIVITY-UPDATE] Activity "${activity.name}" updated successfully`)
    res.json(activity)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete activity (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await Activity.findByIdAndDelete(req.params.id)
    res.json({ message: "Activity deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Register student for activity
router.post("/:id/register", auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)

    if (activity.currentEnrollment >= activity.maxCapacity) {
      return res.status(400).json({ message: "Activity is full" })
    }

    if (activity.enrolledStudents.includes(req.user.userId)) {
      return res.status(400).json({ message: "Already registered" })
    }

    activity.enrolledStudents.push(req.user.userId)
    activity.currentEnrollment += 1
    await activity.save()

    const user = await User.findById(req.user.userId)
    user.enrolledActivities.push(req.params.id)
    await user.save()

    // Populate activity before returning
    const populatedActivity = await Activity.findById(activity._id)
      .populate("enrolledStudents", "name email")
      .populate("createdBy", "name")

    console.log(`[ACTIVITY-REGISTER] User ${user.name} registered for "${populatedActivity.name}"`)
    res.json({ message: "Registered successfully", activity: populatedActivity })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Unregister student from activity
router.post("/:id/unregister", auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)

    activity.enrolledStudents = activity.enrolledStudents.filter((id) => id.toString() !== req.user.userId)
    activity.currentEnrollment = Math.max(0, activity.currentEnrollment - 1)
    await activity.save()

    const user = await User.findById(req.user.userId)
    user.enrolledActivities = user.enrolledActivities.filter((id) => id.toString() !== req.params.id)
    await user.save()

    // Populate activity before returning
    const populatedActivity = await Activity.findById(activity._id)
      .populate("enrolledStudents", "name email")
      .populate("createdBy", "name")

    console.log(`[ACTIVITY-UNREGISTER] User ${user.name} unregistered from "${populatedActivity.name}"`)
    res.json({ message: "Unregistered successfully", activity: populatedActivity })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
