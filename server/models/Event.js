const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    enum: ["workshop", "seminar", "competition", "lecture", "cultural", "sports", "academic", "other"],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: String,
  location: String,
  capacity: Number,
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  attendance: [
    {
      studentId: mongoose.Schema.Types.ObjectId,
      status: {
        type: String,
        enum: ["present", "absent"],
        default: "present",
      },
      presentDate: Date,
      pointsAwarded: Number,
    },
  ],
  pointsPerEvent: {
    type: Number,
    default: 10,
  },
  status: {
    type: String,
    enum: ["upcoming", "completed"],
    default: "upcoming",
  },
  qrCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  qrCodeUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Event", eventSchema)
