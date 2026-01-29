const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
  res.send("Webhook server is running...");
});

// Webhook route
app.post("/webhook", (req, res) => {
  const eventType = req.headers["x-github-event"];
  const payload = req.body;

  console.log("New Webhook Event Received:");
  console.log("Event Type:", eventType);
  console.log("Payload:", payload);

  res.status(200).json({
    message: "Webhook received successfully",
    eventType: eventType
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
