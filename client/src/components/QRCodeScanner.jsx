"use client"

import { useState } from "react"
import "../styles/qr-scanner.css"

export default function QRCodeScanner({ onScanSuccess, onClose }) {
  const [scannedData, setScannedData] = useState(null)
  const [manualQRCode, setManualQRCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleManualRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/events/register-qr/${manualQRCode}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setScannedData(data)
        onScanSuccess(data.event)
        setTimeout(() => onClose(), 2000)
      } else {
        setError(data.message || "Invalid QR code")
      }
    } catch (err) {
      setError("Error registering for event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="qr-scanner-modal">
      <div className="qr-scanner-content">
        <div className="qr-scanner-header">
          <h2>Register for Event</h2>
          <button className="qr-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="qr-scanner-body">
          {scannedData ? (
            <div className="qr-success">
              <div className="success-icon">✓</div>
              <h3>Registration Successful!</h3>
              <p>You have registered for:</p>
              <p className="event-name">{scannedData.event?.title}</p>
              <p className="success-message">Redirecting...</p>
            </div>
          ) : (
            <>
              <div className="qr-instruction">
                <p>Scan the event QR code or enter the code manually below:</p>
              </div>

              <form onSubmit={handleManualRegister} className="qr-form">
                <div className="form-group">
                  <label>Event QR Code</label>
                  <input
                    type="text"
                    value={manualQRCode}
                    onChange={(e) => setManualQRCode(e.target.value)}
                    placeholder="Enter QR code or paste here"
                    className="qr-input"
                    required
                  />
                </div>

                {error && <div className="qr-error">{error}</div>}

                <button type="submit" className="qr-submit-btn" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>

              <div className="qr-divider">
                <span>or use device camera</span>
              </div>

              <div className="qr-camera-note">
                <p>Camera scanning feature requires HTTPS or localhost</p>
                <p>Use the manual entry above for now</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
