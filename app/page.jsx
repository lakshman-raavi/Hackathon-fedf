"use client"

export default function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Student Extracurricular Activity Platform</h1>

        <p style={styles.description}>
          A comprehensive MERN full-stack application for managing student involvement in extracurricular activities.
        </p>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Project Structure</h2>
          <p style={styles.text}>
            This is a <strong>MERN Stack Application</strong> with separate frontend and backend:
          </p>
          <ul style={styles.list}>
            <li>
              <strong>Backend:</strong> Node.js + Express + MongoDB (runs on port 5000)
            </li>
            <li>
              <strong>Frontend:</strong> React + React Router (runs on port 3000)
            </li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Getting Started</h2>

          <div style={styles.step}>
            <h3 style={styles.stepTitle}>Step 1: Backend Setup</h3>
            <code style={styles.code}>
              cd server
              <br />
              npm install
              <br /># Create .env file with MongoDB URI and JWT secret
              <br />
              npm run dev
            </code>
          </div>

          <div style={styles.step}>
            <h3 style={styles.stepTitle}>Step 2: Frontend Setup</h3>
            <code style={styles.code}>
              cd client
              <br />
              npm install
              <br />
              npm start
            </code>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Features</h2>

          <div style={styles.features}>
            <div style={styles.feature}>
              <h3 style={styles.featureTitle}>Admin Dashboard</h3>
              <ul style={styles.featureList}>
                <li>Create and manage activities</li>
                <li>Schedule events</li>
                <li>Track student participation</li>
                <li>Update activity details</li>
              </ul>
            </div>

            <div style={styles.feature}>
              <h3 style={styles.featureTitle}>Student Portal</h3>
              <ul style={styles.featureList}>
                <li>Browse available activities</li>
                <li>Register for activities</li>
                <li>Track participation</li>
                <li>Receive notifications</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Test Accounts</h2>

          <div style={styles.testAccount}>
            <h4>Admin Account</h4>
            <p>
              Email: <code>admin@example.com</code>
            </p>
            <p>
              Password: <code>admin123</code>
            </p>
          </div>

          <div style={styles.testAccount}>
            <h4>Student Account</h4>
            <p>
              Email: <code>student@example.com</code>
            </p>
            <p>
              Password: <code>student123</code>
            </p>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>API Endpoints</h2>
          <ul style={styles.endpoints}>
            <li>
              <strong>Auth:</strong> POST /api/auth/register, POST /api/auth/login
            </li>
            <li>
              <strong>Activities:</strong> GET/POST/PUT/DELETE /api/activities
            </li>
            <li>
              <strong>Events:</strong> GET/POST /api/events
            </li>
            <li>
              <strong>Notifications:</strong> GET/PUT /api/notifications
            </li>
          </ul>
        </div>

        <div style={styles.info}>
          <p style={styles.infoText}>
            After setting up both frontend and backend, the React application will be available at{" "}
            <strong>http://localhost:3000</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "40px 20px",
    fontFamily: "'Geist', sans-serif",
  },
  content: {
    maxWidth: "900px",
    margin: "0 auto",
    background: "white",
    borderRadius: "12px",
    padding: "40px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
  },
  title: {
    fontSize: "32px",
    color: "#333",
    marginBottom: "20px",
    textAlign: "center",
  },
  description: {
    fontSize: "16px",
    color: "#666",
    textAlign: "center",
    marginBottom: "40px",
    lineHeight: "1.6",
  },
  section: {
    marginBottom: "40px",
    paddingBottom: "30px",
    borderBottom: "1px solid #e0e0e0",
  },
  sectionTitle: {
    fontSize: "22px",
    color: "#667eea",
    marginBottom: "15px",
  },
  text: {
    fontSize: "15px",
    color: "#555",
    lineHeight: "1.6",
    marginBottom: "12px",
  },
  list: {
    marginLeft: "20px",
    fontSize: "15px",
    color: "#555",
    lineHeight: "1.8",
  },
  step: {
    marginBottom: "20px",
    padding: "15px",
    background: "#f5f5f5",
    borderRadius: "8px",
  },
  stepTitle: {
    fontSize: "16px",
    color: "#333",
    marginBottom: "10px",
  },
  code: {
    display: "block",
    background: "#2d2d2d",
    color: "#f8f8f2",
    padding: "15px",
    borderRadius: "6px",
    fontSize: "13px",
    overflow: "auto",
    fontFamily: "'Geist Mono', monospace",
    lineHeight: "1.5",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  feature: {
    padding: "15px",
    background: "#f9f9f9",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
  },
  featureTitle: {
    fontSize: "16px",
    color: "#667eea",
    marginBottom: "10px",
  },
  featureList: {
    marginLeft: "20px",
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.8",
  },
  testAccount: {
    padding: "15px",
    background: "#e3f2fd",
    borderRadius: "8px",
    marginBottom: "12px",
    borderLeft: "4px solid #667eea",
  },
  endpoints: {
    marginLeft: "20px",
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.8",
  },
  info: {
    padding: "20px",
    background: "#f0f7ff",
    borderRadius: "8px",
    border: "1px solid #667eea",
    textAlign: "center",
  },
  infoText: {
    fontSize: "15px",
    color: "#667eea",
    margin: "0",
    fontWeight: "500",
  },
}
