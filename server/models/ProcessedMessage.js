// server/models/ProcessedMessage.js
// Defines the ProcessedMessage schema for webhook payloads

const mongoose = require('mongoose');

const processedMessageSchema = new mongoose.Schema({
  messageId: { type: String, required: true, unique: true }, // WhatsApp message ID (id or meta_msg_id)
  content: { type: String, required: true, trim: true }, // Message text
  sender: { type: String, required: true }, // Profile name (e.g., Ravi Kumar)
  from: { type: String, required: true }, // Phone number (wa_id)
  recipient: { type: String, required: true }, // Recipient phone number
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
  },
  timestamp: { type: Date, required: true },
});

module.exports = mongoose.model('ProcessedMessage', processedMessageSchema);