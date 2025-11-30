# Student Extracurricular Activity Management Platform

A comprehensive MERN full-stack application for managing student involvement in extracurricular activities.

## Features

### Student Dashboard
- Browse and register for activities
- Calendar view of upcoming events
- Personalized activity recommendations
- Points tracking and leaderboard
- Attendance history
- Login/Logout functionality

### Admin Dashboard
- Create and manage activities
- Create events for activities
- Track attendance and award points
- View analytics (registration, attendance rates)
- Monitor event statistics

### Key Features
- Dynamic login page with smooth animations
- Points system for event attendance
- Attendance tracking
- Activity recommendations based on interests
- Real-time analytics for admin
- Calendar view for event management
- User authentication with JWT tokens

## Tech Stack

- **Frontend**: React.js (with .jsx)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Project Structure

\`\`\`
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Activity.js
│   │   ├── Event.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── activities.js
│   │   ├── events.js
│   │   ├── users.js
│   │   └── notifications.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config/
│   │   └── db.js
│   └── server.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActivityCard.jsx
│   │   │   ├── CalendarView.jsx
│   │   │   ├── RecommendationsSection.jsx
│   │   │   ├── AnalyticsDashboard.jsx
│   │   │   ├── AttendanceManagement.jsx
│   │   │   ├── PointsDisplay.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── styles/
│   │   │   ├── auth.css
│   │   │   ├── dashboard.css
│   │   │   ├── calendar.css
│   │   │   ├── analytics.css
│   │   │   ├── recommendations.css
│   │   │   ├── attendance.css
│   │   │   └── components.css
│   │   └── App.jsx
│   └── public/
│       └── index.html
└── package.json
\`\`\`

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed locally or MongoDB Atlas connection URI
- npm or yarn

### Backend Setup

1. Navigate to server directory:
\`\`\`bash
cd server
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create `.env` file in server directory:
\`\`\`
MONGODB_URI=mongodb://localhost:27017/student-activities
JWT_SECRET=your_secure_jwt_secret_key_here
PORT=5000
\`\`\`

4. Start MongoDB:
\`\`\`bash
# If MongoDB is installed locally
mongod
\`\`\`

5. Start backend server:
\`\`\`bash
npm start
\`\`\`

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
\`\`\`bash
cd client
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start frontend development server:
\`\`\`bash
npm start
\`\`\`

The frontend will open in your browser at `http://localhost:3000`

## Test Credentials

### Admin Account
- **Email**: admin@school.com
- **Password**: admin123

### Student Account
- **Email**: student@school.com
- **Password**: student123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Activities
- `GET /api/activities` - Get all activities
- `POST /api/activities` - Create activity (admin only)
- `PUT /api/activities/:id` - Update activity (admin only)
- `DELETE /api/activities/:id` - Delete activity (admin only)
- `POST /api/activities/:id/register` - Register for activity
- `POST /api/activities/:id/unregister` - Unregister from activity
- `GET /api/activities/recommendations/:userId` - Get recommendations

### Events
- `GET /api/events/activity/:activityId` - Get events for activity
- `POST /api/events` - Create event (admin only)
- `POST /api/events/:id/attend` - Register for event
- `POST /api/events/:id/attendance` - Mark attendance (admin only)
- `GET /api/events/:activityId/analytics` - Get analytics

### Users
- `GET /api/users/:id` - Get user profile with points
- `GET /api/users/leaderboard/top` - Get top 10 users by points

## Features Explained

### Points System
- Students earn points by attending events
- Points are awarded based on activity configuration (default: 10 points)
- Points are tracked in user profile
- Leaderboard shows top students by points

### Attendance Management
- Admin can mark students as present for events
- Points are automatically awarded upon attendance
- Attendance records are stored with dates

### Recommendations
- Based on activities student is already enrolled in
- Recommends similar category activities
- Helps students discover new activities

### Analytics Dashboard
- Shows total registrations per activity
- Displays attendance rate for each event
- Provides event-wise statistics
- Shows registration vs attendance metrics

### Calendar View
- Monthly calendar display
- Highlights days with events
- Shows upcoming events list
- Easy event date visualization

## Database Models

### User Schema
- name, email, password, role
- enrolledActivities, points
- attendanceRecords

### Activity Schema
- name, description, category
- schedule, maxCapacity, currentEnrollment
- enrolledStudents, upcomingEvents
- pointsPerAttendance

### Event Schema
- activityId, title, description
- date, time, location, capacity
- attendees, attendance records
- pointsPerEvent

### Notification Schema
- userId, message, type
- read status, createdAt

## Deployment

### Deploy to Vercel (Frontend)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables (backend API URL)
4. Deploy

### Deploy to Heroku (Backend)
1. Create Heroku app
2. Set environment variables
3. Deploy using Git or Heroku CLI

### MongoDB Atlas (Database)
1. Create cluster on MongoDB Atlas
2. Get connection URI
3. Update MONGODB_URI in .env

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection URI in .env file
- Verify network access if using MongoDB Atlas

### CORS Issues
- Check if backend CORS is properly configured
- Verify frontend API URL in fetch requests
- Ensure both servers are running on correct ports

### Authentication Errors
- Clear browser localStorage
- Verify JWT_SECRET is set
- Check token expiration

### Port Already in Use
- Backend: `lsof -i :5000` and kill process
- Frontend: `lsof -i :3000` and kill process

## Future Enhancements

- Email notifications
- Real-time notifications with WebSocket
- Payment integration for premium activities
- Activity ratings and reviews
- Parent/Guardian access
- Mobile app version
- Advanced analytics and reporting
- Activity photo gallery

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.
