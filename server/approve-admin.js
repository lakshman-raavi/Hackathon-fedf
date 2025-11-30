const mongoose = require("mongoose")
const dotenv = require("dotenv")
const User = require("./models/User")

// Load environment variables
dotenv.config()

const approveAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Connected")

        const email = process.argv[2]

        if (!email) {
            console.error("Please provide an email address. Usage: node approve-admin.js <email>")
            process.exit(1)
        }

        const user = await User.findOne({ email })

        if (!user) {
            console.error(`User with email ${email} not found`)
            process.exit(1)
        }

        if (user.roleStatus === "approved") {
            console.log(`User ${user.name} (${email}) is already approved.`)
            process.exit(0)
        }

        user.roleStatus = "approved"
        await user.save()

        console.log(`SUCCESS: User ${user.name} (${email}) has been APPROVED!`)
        console.log("You can now log in to the Admin Portal.")

        process.exit(0)
    } catch (error) {
        console.error("Error:", error.message)
        process.exit(1)
    }
}

approveAdmin()
