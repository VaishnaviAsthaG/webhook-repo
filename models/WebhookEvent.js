const mongoose = require("mongoose");

const WebhookEventSchema = new mongoose.Schema({
  eventType: String,
  repoName: String,
  author: String,
  action: String,
  timestamp: Date,
  eventId: String
});

module.exports = mongoose.model("WebhookEvent", WebhookEventSchema);
