require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

// Twilio Credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// Phone Number Validation Function
function validatePhoneNumber(phoneNumber) {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
}

// SMS Sending Endpoint with Enhanced Validation
app.post('/send-sms', async (req, res) => {
  const { phoneNumber, message } = req.body;

  // Validate input
  if (!phoneNumber || !message) {
    return res.status(400).json({
      success: false,
      error: "Phone number and message are required"
    });
  }

  // Validate phone number format
  if (!validatePhoneNumber(phoneNumber)) {
    return res.status(400).json({
      success: false,
      error: "Invalid phone number format. Use E.164 format (e.g., +15551234567)"
    });
  }

  try {
    const response = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phoneNumber
    });

    res.status(200).json({
      success: true,
      messageSid: response.sid
    });
  } catch (error) {
    console.error('SMS Send Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});