const express = require('express');
const twilio = require('twilio');

const router = express.Router();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Phone number validation
function validatePhoneNumber(phoneNumber) {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
}

// POST to send an SMS
router.post('/send', async (req, res) => {
  const { phoneNumber, message } = req.body;

  if (!phoneNumber || !message) {
    return res.status(400).json({ error: 'Phone number and message are required.' });
  }

  if (!validatePhoneNumber(phoneNumber)) {
    return res.status(400).json({ error: 'Invalid phone number format.' });
  }

  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    res.status(200).json({ success: true, messageSid: response.sid });
  } catch (error) {
    console.error('SMS sending failed:', error);
    res.status(500).json({ error: 'Failed to send SMS.' });
  }
});

module.exports = router;
