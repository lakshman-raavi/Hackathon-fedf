# Student Extracurricular Activity Management Platform - Complete Documentation

## Project Overview

A comprehensive MERN full-stack application for managing student extracurricular activities with advanced role-based access control, QR code registration, attendance tracking, and points system.

## Key Features Implemented

### 1. Dynamic Login System with Role-Based Access
- **Multiple Roles**: Student, Admin, Coordinator
- **Dynamic Registration**: Users can register as any role
- **Role Approval System**: 
  - Students: Instant approval
  - Admin/Coordinator: Requires coordinator approval (pending status)
- **Enhanced UI**: Mouse-tracking gradient animations, smooth transitions

### 2. Coordinator System
- **Pending Approval Dashboard**: View and approve/reject admin and coordinator requests
- **Full Administrative Access**: Can manage activities, events, and analytics
- **Approval Management**: Accept or reject role requests from new admins/coordinators

### 3. Compact Calendar View (Top-Right)
- **Fixed Position**: Located at top-right corner of dashboard
- **Compact Design**: Reduced size with responsive layout
- **Event Highlighting**: Shows events on specific dates with indicators
- **Upcoming Events List**: Quick view of next events
- **Date Navigation**: Easy month navigation

### 4. Event Points System
- **Configurable Points**: Admins set points per event during creation
- **Automatic Point Awards**: Points awarded automatically upon attendance marking
- **Point Tracking**: Students can see their earned points
- **Leaderboard Ready**: Foundation for future leaderboard feature

### 5. QR Code Event Registration
- **Unique QR Generation**: Each event gets a unique QR code
- **Shareable Format**: QR codes can be downloaded and shared
- **QR Scanner**: Students can scan codes to register for events
- **Manual Entry**: Fallback option to enter QR code manually
- **Instant Registration**: One-click registration via QR code

### 6. Attendance Tracking & Points Management
- **Mark Attendance**: Admins mark students present at events
- **Automatic Points**: Points credited automatically to student accounts
- **Attendance Records**: Complete history of attendance with dates and points
- **Real-Time Updates**: Points reflected immediately in student dashboard

### 7. Admin Dashboard with Analytics
- **Activity Management**: Create, edit, delete activities
- **Event Management**: Create events with QR codes and points configuration
- **Analytics Dashboard**: 
  - Registration counts per activity
  - Attendance rates and statistics
  - Event-wise analytics
- **Attendance Management**: Mark attendance and award points
- **Logout**: Quick logout button in header

### 8. Student Dashboard Features
- **Activity Registration**: Browse and register for activities
- **Calendar View**: See events at a glance in top-right corner
- **QR Code Scanner**: Scan event QR codes for quick registration
- **Points Display**: Visual display of earned points
- **Recommendations**: Personalized activity suggestions
- **Event List**: Upcoming events from registered activities
- **Logout**: Quick logout button in header

## Technical Architecture

### Backend (Node.js/Express + MongoDB)

**Database Models:**
- **User**: Extended with role system, points, attendance records, and role approval status
- **Activity**: Categories, enrollment, points configuration, created by admin/coordinator
- **Event**: Activity-linked events with QR codes, point allocation, attendance tracking
- **Notification**: Event updates and alerts for students

**API Routes:**

#### Authentication (`/api/auth`)
- `POST /register` - Register with role selection
- `POST /login` - Login with role validation

#### Roles (`/api/roles`)
- `GET /pending-requests` - Get pending role approvals (coordinator only)
- `POST /approve/:userId` - Approve role request
- `POST /reject/:userId` - Reject role request

#### Events (`/api/events`)
- `GET /activity/:activityId` - Get events for activity
- `POST /` - Create event with QR code
- `POST /:id/attendance` - Mark attendance and award points
- `GET /:activityId/analytics` - Get activity analytics
- `POST /:id/attend` - Register for event
- `POST /register-qr/:qrToken` - Register via QR code

#### Activities (`/api/activities`)
- Full CRUD operations for activities
- Enrollment management
- Event associations

#### Users (`/api/users`)
- Get user profile and points
- Update user information
- Leaderboard endpoints

### Frontend (React)

**Pages:**
1. **LoginPage** - Dynamic login/registration with role selection
2. **StudentDashboard** - Activity browsing, registration, calendar, points
3. **AdminDashboard** - Full activity and event management
4. **CoordinatorDashboard** - Role approval management

**Components:**
- `CalendarView` - Compact top-right calendar
- `EventManagement` - Create events with points and QR codes
- `ActivityCard` - Activity display with registration
- `QRCodeScanner` - QR code input and registration
- `AnalyticsDashboard` - Event and registration analytics
- `PointsDisplay` - Student points visualization
- `RecommendationsSection` - Personalized activity suggestions

**Styling:**
- Gradient-based color scheme (#667eea to #764ba2)
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Professional card-based layouts

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

\`\`\`bash
cd server

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/student-activities
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
CLIENT_URL=http://localhost:3000
EOF

# Start server
npm start
# or for development with auto-reload
npm run dev
\`\`\`

### Frontend Setup

\`\`\`bash
cd client

# Install dependencies
npm install

# Start development server
npm start
\`\`\`

Server runs on: `http://localhost:5000`
Client runs on: `http://localhost:3000`

## Test Credentials

### Initial Setup
First, register as a coordinator to approve other admin requests:

**Create Coordinator Account:**
- Email: `coordinator@school.com`
- Password: `coordinator123`
- Role: Coordinator

**Then create Admin Account:**
- Email: `admin@school.com`
- Password: `admin123`
- Role: Administrator (requires coordinator approval)

**Student Account:**
- Email: `student@school.com`
- Password: `student123`
- Role: Student (instant approval)

## Database Schema

### User
\`\`\`javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "student" | "admin" | "coordinator",
  roleStatus: "pending" | "approved" | "rejected",
  approvedBy: ObjectId,
  enrolledActivities: [ObjectId],
  points: Number,
  attendanceRecords: [{
    eventId: ObjectId,
    activityId: ObjectId,
    date: Date,
    pointsEarned: Number
  }],
  createdAt: Date
}
\`\`\`

### Activity
\`\`\`javascript
{
  name: String,
  description: String,
  category: "sports" | "club" | "cultural" | "academic" | "other",
  schedule: { dayOfWeek, time, location },
  maxCapacity: Number,
  currentEnrollment: Number,
  enrolledStudents: [ObjectId],
  upcomingEvents: [ObjectId],
  pointsPerAttendance: Number,
  createdBy: ObjectId,
  createdAt: Date
}
\`\`\`

### Event
\`\`\`javascript
{
  activityId: ObjectId,
  title: String,
  description: String,
  date: Date,
  time: String,
  location: String,
  capacity: Number,
  attendees: [ObjectId],
  attendance: [{
    studentId: ObjectId,
    presentDate: Date,
    pointsAwarded: Number
  }],
  pointsPerEvent: Number,
  qrCode: String (unique),
  qrCodeUrl: String,
  createdAt: Date
}
\`\`\`

## Usage Workflow

### For Students
1. Register as Student (instant approval)
2. Login to dashboard
3. Browse available activities
4. Register for activities OR scan QR code to register for event
5. View calendar in top-right corner
6. Track points earned from attendance
7. Get personalized recommendations

### For Admins
1. Register as Admin (pending approval)
2. Coordinator approves registration
3. Login to admin dashboard
4. Create activities and events
5. Set points per event
6. Download and share QR codes
7. Mark attendance and award points
8. View analytics and registration stats

### For Coordinators
1. Register as Coordinator (first time setup)
2. Review pending admin/coordinator requests
3. Approve or reject requests
4. Manage activities and events
5. View all analytics
6. Manage the entire platform

## API Response Examples

### Create Event with QR Code
\`\`\`javascript
POST /api/events
{
  "activityId": "65abc123...",
  "title": "Basketball Tournament",
  "description": "Annual tournament",
  "date": "2024-11-15",
  "time": "10:00",
  "location": "Court A",
  "capacity": 50,
  "pointsPerEvent": 15
}

Response:
{
  "_id": "65abc456...",
  "title": "Basketball Tournament",
  "pointsPerEvent": 15,
  "qrCode": "a1b2c3d4e5f6...",
  "qrCodeUrl": "data:image/png;base64,..."
}
\`\`\`

### Register via QR Code
\`\`\`javascript
POST /api/events/register-qr/a1b2c3d4e5f6

Response:
{
  "message": "Successfully registered via QR code",
  "event": { /* event details */ }
}
\`\`\`

### Mark Attendance
\`\`\`javascript
POST /api/events/:eventId/attendance
{
  "studentId": "65abc789..."
}

Response:
{
  "message": "Attendance marked",
  "event": { /* updated event */ }
}
\`\`\`

## Future Enhancements

- Email notifications for event updates
- Leaderboard system for competitive engagement
- Certificate generation for attendance
- Photo gallery for events
- Social sharing features
- Mobile app development
- AI-based activity recommendations
- Advanced analytics and reporting
- Payment integration for premium events

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- Verify connection string format

### QR Code Not Generating
- Ensure `qrcode` package is installed
- Check server logs for errors
- Verify all required fields in event creation

### Role Not Approved
- Login as coordinator first
- Review pending requests
- Approve admin/coordinator registration

### Calendar Not Showing
- Refresh page
- Check browser console for errors
- Ensure events have valid dates

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check browser console and server logs
4. Verify all environment variables are set correctly

## License

MIT License - Feel free to use and modify for your institution
