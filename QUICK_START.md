# Quick Start Guide

## 1. Install Dependencies

**Backend:**
\`\`\`bash
cd server
npm install
\`\`\`

**Frontend:**
\`\`\`bash
cd client
npm install
\`\`\`

## 2. Environment Setup

**Create `server/.env`:**
\`\`\`
MONGODB_URI=mongodb://localhost:27017/student-activities
JWT_SECRET=your_super_secret_key_123
PORT=5000
CLIENT_URL=http://localhost:3000
\`\`\`

## 3. Start MongoDB
\`\`\`bash
mongod
\`\`\`

## 4. Start Backend
\`\`\`bash
cd server
npm start
# Server runs on http://localhost:5000
\`\`\`

## 5. Start Frontend (new terminal)
\`\`\`bash
cd client
npm start
# App opens on http://localhost:3000
\`\`\`

## 6. First Login

**Create Coordinator (first user):**
1. Click "Sign Up"
2. Email: `coordinator@school.com`
3. Password: `coordinator123`
4. Role: Coordinator
5. Click "Create Account"

**Create Admin:**
1. Click "Sign Up"
2. Email: `admin@school.com`
3. Password: `admin123`
4. Role: Administrator
5. Wait for coordinator approval (status: pending)
6. Login as coordinator
7. Go to "Pending Approvals"
8. Click "Approve" for admin
9. Admin can now login

**Create Student:**
1. Click "Sign Up"
2. Email: `student@school.com`
3. Password: `student123`
4. Role: Student
5. Instant approval!

## Features to Test

### Admin
- Create activities
- Create events with QR codes and points
- View analytics
- Mark attendance
- Download QR codes

### Student
- Register for activities
- Scan QR codes to register
- View calendar
- Track points
- See recommendations

### Coordinator
- Approve admin/coordinator requests
- Manage all activities and events
- View complete analytics

## Common Tasks

**Create an Activity:**
1. Login as Admin
2. Go to "Manage Activities"
3. Fill activity details
4. Click "Create Activity"

**Create an Event:**
1. Login as Admin
2. Go to "Manage Events"
3. Select Activity
4. Fill event details including points
5. Click "Create Event with QR Code"
6. Download QR code

**Register Student for Event:**
1. Login as Student
2. Click "Scan QR" button
3. Enter or scan QR code
4. Done!

**View Analytics:**
1. Login as Admin
2. Go to "Analytics"
3. Select activity
4. View registration and attendance stats

## Troubleshooting

**Port already in use:**
\`\`\`bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
\`\`\`

**MongoDB not found:**
\`\`\`bash
# Make sure MongoDB is running
mongod
\`\`\`

**Dependencies issues:**
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
