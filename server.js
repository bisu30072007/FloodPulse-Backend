const express = require("express");
const twilio = require("twilio");

const app = express();

app.use(express.json());

const port = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "FloodPulse Backend"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

app.post("/send-sos", async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to) {
      return res.status(400).json({
        error: "Recipient phone number is required"
      });
    }

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const sms = await client.messages.create({
      body:
        message ||
        "FLOODPULSE SOS ALERT: Emergency assistance may be required.",
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });

    res.json({
      success: true,
      messageSid: sms.sid
    });

  } catch (error) {
    console.error("Twilio error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to send SOS SMS"
    });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`FloodPulse Backend running on port ${port}`);
});
