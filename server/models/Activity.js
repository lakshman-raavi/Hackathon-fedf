const mongoose = require("mongoose")

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["sports", "club", "cultural", "academic", "other"],
    required: true,
  },
  schedule: {
    dayOfWeek: String,
    time: String,
    location: String,
  },
  maxCapacity: {
    type: Number,
    required: true,
  },
  currentEnrollment: {
    type: Number,
    default: 0,
  },
  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  upcomingEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
  pointsPerAttendance: {
    type: Number,
    default: 10,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Activity", activitySchema)
