const express = require("express")
const { auth, adminAuth } = require("../middleware/auth")
const Event = require("../models/Event")
const Activity = require("../models/Activity")
const User = require("../models/User")
const { generateQRCode } = require("../utils/qrCodeGenerator")

const router = express.Router()

// Get all events (for analytics)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find()
      .populate("attendees", "name email")
      .populate("activityId", "name")
      .populate("attendance.studentId", "name email")
      .lean()

    // Add activityName field for easier access
    const eventsWithActivityNames = events.map(event => ({
      ...event,
      activityName: event.activityId?.name || 'Unknown Activity'
    }))

    console.log(`[DEBUG] Fetched ${eventsWithActivityNames.length} total events`)
    res.json(eventsWithActivityNames)
  } catch (error) {
    console.error("[ERROR] Failed to fetch all events:", error)
    res.status(500).json({ message: error.message })
  }
})

// Get events for an activity
router.get("/activity/:activityId", async (req, res) => {
  try {
    const events = await Event.find({ activityId: req.params.activityId })
      .populate("attendees", "name email")
      .populate("activityId", "name")
      .populate("attendance.studentId", "name email")
      .lean() // Convert to plain JavaScript objects for better performance

    // Log for debugging
    console.log(`[DEBUG] Fetched ${events.length} events for activity ${req.params.activityId}`)
    events.forEach(event => {
      console.log(`[DEBUG] Event "${event.title}" has ${event.attendees?.length || 0} attendees`)
    })

    res.json(events)
  } catch (error) {
    console.error("[ERROR] Failed to fetch events:", error)
    res.status(500).json({ message: error.message })
  }
})

// DIAGNOSTIC: Get single event with full details
router.get("/debug/:eventId", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate("attendees", "name email")
      .populate("attendance.studentId", "name email")

    console.log("[DEBUG] Single event fetch:")
    console.log("- Event ID:", event._id)
    console.log("- Title:", event.title)
    console.log("- Attendees (raw):", event.attendees)
    console.log("- Attendees count:", event.attendees?.length || 0)

    res.json({
      event,
      diagnostics: {
        attendeesCount: event.attendees?.length || 0,
        attendeesArePopulated: event.attendees?.length > 0 && event.attendees[0].name ? true : false,
        attendanceCount: event.attendance?.length || 0
      }
    })
  } catch (error) {
    console.error("[ERROR] Debug endpoint failed:", error)
    res.status(500).json({ message: error.message })
  }
})

// Create event (admin or coordinator)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "coordinator") {
      return res.status(403).json({ message: "Only admin or coordinator can create events" })
    }

    const { activityId, title, description, category, date, time, location, capacity, pointsPerEvent } = req.body

    const event = new Event({
      activityId,
      title,
      description,
      category,
      date,
      time,
      location,
      capacity,
      pointsPerEvent: Number(pointsPerEvent) || 10,
    })

    await event.save()

    await Activity.findByIdAndUpdate(activityId, {
      $push: { upcomingEvents: event._id },
    })

    // Populate the event before returning to match GET endpoint structure
    const populatedEvent = await Event.findById(event._id)
      .populate("attendees", "name email")
      .populate("activityId", "name")
      .populate("attendance.studentId", "name email")

    console.log(`[EVENT-CREATE] Event "${populatedEvent.title}" created successfully`)
    res.status(201).json(populatedEvent)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/analytics/:activityId", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "coordinator") {
      return res.status(403).json({ message: "Only admin or coordinator can view analytics" })
    }

    const events = await Event.find({ activityId: req.params.activityId })
    const activity = await Activity.findById(req.params.activityId).populate("enrolledStudents")

    const analytics = {
      totalRegistrations: activity.currentEnrollment || 0,
      totalEvents: events.length,
      eventDetails: events.map((event) => ({
        eventId: event._id,
        title: event.title,
        date: event.date,
        attendanceCount: event.attendance.length,
        registeredCount: event.attendees.length,
        attendanceRate:
          event.attendees.length > 0 ? ((event.attendance.length / event.attendees.length) * 100).toFixed(2) : 0,
      })),
    }

    res.json(analytics)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update event (admin or coordinator)
router.put("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "coordinator") {
      return res.status(403).json({ message: "Only admin or coordinator can update events" })
    }

    const { activityId, title, description, category, date, time, location, capacity, pointsPerEvent } = req.body

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        activityId,
        title,
        description,
        category,
        date,
        time,
        location,
        capacity,
        pointsPerEvent: Number(pointsPerEvent) || 10,
      },
      { new: true, runValidators: true }
    ).populate("attendees", "name email")

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    console.log(`[EVENT-UPDATE] Event "${event.title}" updated successfully`)
    res.json(event)
  } catch (error) {
    console.error("[EVENT-UPDATE] Error:", error)
    res.status(500).json({ message: error.message })
  }
})

// Delete event (admin or coordinator)
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "coordinator") {
      return res.status(403).json({ message: "Only admin or coordinator can delete events" })
    }

    const event = await Event.findByIdAndDelete(req.params.id)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    console.log(`[EVENT-DELETE] Event "${event.title}" deleted successfully`)
    res.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("[EVENT-DELETE] Error:", error)
    res.status(500).json({ message: error.message })
  }
})

// Mark attendance for a student
router.post("/:id/attendance", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "coordinator") {
      return res.status(403).json({ message: "Only admin or coordinator can mark attendance" })
    }

    const { studentId, status } = req.body
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    const pointsPerEvent = event.pointsPerEvent || 10
    const existingAttendanceIndex = event.attendance.findIndex((a) => a.studentId.toString() === studentId)
    const user = await User.findById(studentId)

    if (!user) {
      return res.status(404).json({ message: "Student not found" })
    }

    if (existingAttendanceIndex !== -1) {
      // Update existing attendance
      const oldStatus = event.attendance[existingAttendanceIndex].status

      // If status hasn't changed, do nothing
      if (oldStatus === status) {
        return res.json({ message: `Attendance already marked as ${status}`, event })
      }

      // Update event attendance record
      event.attendance[existingAttendanceIndex].status = status
      event.attendance[existingAttendanceIndex].presentDate = new Date()

      // Calculate point adjustment
      let pointChange = 0

      if (oldStatus === "absent" && status === "present") {
        pointChange = pointsPerEvent
        event.attendance[existingAttendanceIndex].pointsAwarded = pointsPerEvent

        // Add to user history
        user.attendanceRecords.push({
          eventId: event._id,
          activityId: event.activityId,
          date: new Date(),
          pointsEarned: pointsPerEvent,
        })
      } else if (oldStatus === "present" && status === "absent") {
        pointChange = -pointsPerEvent
        event.attendance[existingAttendanceIndex].pointsAwarded = 0

        // Remove from user history
        user.attendanceRecords = user.attendanceRecords.filter(
          record => record.eventId.toString() !== event._id.toString()
        )
      }

      user.points = Math.max(0, (user.points || 0) + pointChange)
      await user.save()

      // Mark event as completed when attendance is marked
      if (event.status !== "completed") {
        event.status = "completed"
        console.log(`[EVENT-COMPLETE] Event "${event.title}" marked as completed`)
      }

      await event.save()

      return res.json({
        message: `Attendance updated to ${status}. Points adjusted by ${pointChange}. Event marked as completed.`,
        event
      })

    } else {
      // New attendance record
      const pointsToAward = status === "present" ? pointsPerEvent : 0

      event.attendance.push({
        studentId,
        status: status || "present",
        presentDate: new Date(),
        pointsAwarded: pointsToAward,
      })

      // Mark event as completed when attendance is marked
      if (event.status !== "completed") {
        event.status = "completed"
        console.log(`[EVENT-COMPLETE] Event "${event.title}" marked as completed`)
      }

      await event.save()

      if (status === "present") {
        user.points = Number(user.points || 0) + Number(pointsToAward)
        user.attendanceRecords.push({
          eventId: event._id,
          activityId: event.activityId,
          date: new Date(),
          pointsEarned: pointsToAward,
        })
        await user.save()
      }

      return res.json({ message: `Attendance marked as ${status}. Event marked as completed.`, event })
    }
  } catch (error) {
    console.error("Error marking attendance:", error)
    res.status(500).json({ message: error.message })
  }
})

// Register for an event
router.post("/:id/attend", auth, async (req, res) => {
  try {
    console.log(`[REGISTRATION] Student ${req.user.userId} attempting to register for event ${req.params.id}`)

    const event = await Event.findById(req.params.id)

    if (!event) {
      console.log("[REGISTRATION] Event not found:", req.params.id)
      return res.status(404).json({ message: "Event not found" })
    }

    // Prevent registration for completed events
    if (event.status === "completed") {
      return res.status(400).json({ message: "Cannot register for a completed event (Attendance already taken)" })
    }

    console.log(`[REGISTRATION] Event found: "${event.title}"`)
    console.log(`[REGISTRATION] Current attendees count: ${event.attendees.length}`)

    if (event.attendees.includes(req.user.userId)) {
      console.log("[REGISTRATION] Student already registered")
      return res.status(400).json({ message: "Already registered" })
    }

    event.attendees.push(req.user.userId)
    await event.save()

    console.log(`[REGISTRATION] ✅ SUCCESS! Student registered. New count: ${event.attendees.length}`)
    console.log(`[REGISTRATION] Attendees array:`, event.attendees)

    res.json({ message: "Registered for event", event })
  } catch (error) {
    console.error("[REGISTRATION] ❌ ERROR:", error)
    res.status(500).json({ message: error.message })
  }
})

// Register via QR code
router.post("/register-qr/:qrToken", auth, async (req, res) => {
  try {
    const event = await Event.findOne({ qrCode: req.params.qrToken })

    if (!event) {
      return res.status(404).json({ message: "Invalid QR code" })
    }

    // Prevent registration for completed events
    if (event.status === "completed") {
      return res.status(400).json({ message: "Cannot register for a completed event (Attendance already taken)" })
    }

    if (event.attendees.includes(req.user.userId)) {
      return res.status(400).json({ message: "Already registered for this event" })
    }

    event.attendees.push(req.user.userId)
    await event.save()

    res.json({ message: "Successfully registered via QR code", event })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
