const QRCode = require("qrcode")
const crypto = require("crypto")

const generateQRCode = async (eventId, eventTitle) => {
  try {
    // Generate unique QR code token
    const qrToken = crypto.randomBytes(16).toString("hex")

    // Create QR data with event info and unique token
    const qrData = JSON.stringify({
      eventId,
      eventTitle,
      token: qrToken,
      registrationUrl: `${process.env.CLIENT_URL}/event/register/${qrToken}`,
    })

    // Generate QR code as data URL
    const qrCodeUrl = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 0.95,
      margin: 1,
      width: 300,
    })

    return {
      qrCode: qrToken,
      qrCodeUrl,
    }
  } catch (error) {
    console.error("Error generating QR code:", error)
    throw error
  }
}

module.exports = { generateQRCode }
