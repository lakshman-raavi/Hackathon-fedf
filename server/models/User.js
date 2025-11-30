const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
  roleStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "approved",
  },
  enrolledActivities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
    },
  ],
  points: {
    type: Number,
    default: 0,
  },
  attendanceRecords: [
    {
      eventId: mongoose.Schema.Types.ObjectId,
      activityId: mongoose.Schema.Types.ObjectId,
      date: Date,
      pointsEarned: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("User", userSchema)
