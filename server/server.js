const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./config/db")

// Load environment variables
dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/activities", require("./routes/activities"))
app.use("/api/events", require("./routes/events"))
app.use("/api/notifications", require("./routes/notifications"))
app.use("/api/users", require("./routes/users"))

// Basic route
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
