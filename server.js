require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const WebhookEvent = require("./models/WebhookEvent");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));


const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
  res.send("Webhook server is running...");
});

// Webhook route
app.post("/webhook", async (req, res) => {
  const eventType = req.headers["x-github-event"];
  const eventId = req.headers["x-github-delivery"]; // unique ID
  const payload = req.body;

  try {
    // Step 1: check karo ye event already DB me hai ya nahi
    const existingEvent = await WebhookEvent.findOne({ eventId });

    if (existingEvent) {
      return res.status(200).json({
        message: "Duplicate event ignored"
      });
    }

    // Step 2: agar new hai tabhi save karo
    const newEvent = new WebhookEvent({
      eventType,
      repoName: payload.repository?.name || "Unknown",
      author: payload.sender?.login || "Unknown",
      action: payload.action || "N/A",
      timestamp: new Date(),
      eventId
    });

    await newEvent.save();

    res.status(200).json({
      message: "Webhook saved successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
