
// // server/routes/messages.js
// // Defines API routes for webhook payload processing

// const express = require('express');
// const router = express.Router();
// const ProcessedMessage = require('../models/ProcessedMessage');

// // GET /messages - Fetch all messages
// router.get('/', async (req, res) => {
//   try {
//     const messages = await ProcessedMessage.find().sort({ timestamp: 1 });
//     res.json(messages);
//   } catch (error) {
//     console.error('Error fetching messages:', error);
//     res.status(500).json({ error: 'Failed to fetch messages' });
//   }
// });

// // GET /users - Fetch unique users (sender or recipient names, excluding phone numbers)
// router.get('/users', async (req, res) => {
//   try {
//     const senders = await ProcessedMessage.distinct('sender');
//     const recipients = await ProcessedMessage.distinct('recipient');
//     const users = [...new Set([...senders, ...recipients])]
//       .filter((user) => user !== 'Business' && !/^\d+$/.test(user)) // Exclude Business and phone numbers
//       .sort();
//     res.json(users);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// });

// // GET /messages/:user - Fetch messages for a specific user
// router.get('/:user', async (req, res) => {
//   try {
//     const user = req.params.user;
//     const messages = await ProcessedMessage.find({
//       $or: [{ sender: user }, { recipient: user }],
//     }).sort({ timestamp: 1 });
//     res.json(messages);
//   } catch (error) {
//     console.error('Error fetching user messages:', error);
//     res.status(500).json({ error: 'Failed to fetch user messages' });
//   }
// });

// // POST /messages - Handle webhook message payload
// router.post('/', async (req, res) => {
//   try {
//     const { payload_type, metaData } = req.body;
//     if (payload_type !== 'whatsapp_webhook') {
//       return res.status(400).json({ error: 'Invalid payload type' });
//     }

//     const { messages, contacts } = metaData.entry[0]?.changes[0]?.value || {};
//     if (!messages?.[0] || !contacts?.[0]) {
//       return res.status(400).json({ error: 'Missing messages or contacts' });
//     }

//     const messageData = messages[0];
//     const contact = contacts[0];

//     const processedMessage = new ProcessedMessage({
//       messageId: messageData.id,
//       content: messageData.text.body,
//       sender: messageData.from === '918329446654' ? 'Business' : contact.profile.name,
//       from: messageData.from,
//       recipient: messageData.from === '918329446654' ? contact.profile.name : 'Business',
//       status: 'sent',
//       timestamp: new Date(parseInt(messageData.timestamp) * 1000),
//     });
//     await processedMessage.save();

//     const io = req.app.get('io');
//     io.emit('newMessage', processedMessage);

//     res.status(201).json(processedMessage);
//   } catch (error) {
//     console.error('Error saving message:', error.message);
//     res.status(500).json({ error: 'Failed to save message', details: error.message });
//   }
// });

// // POST /messages/statuses - Handle status updates
// router.post('/statuses', async (req, res) => {
//   try {
//     const { payload_type, metaData } = req.body;
//     if (payload_type !== 'whatsapp_webhook') {
//       return res.status(400).json({ error: 'Invalid payload type' });
//     }

//     const statusData = metaData.entry[0]?.changes[0]?.value?.statuses?.[0];
//     if (!statusData) {
//       return res.status(400).json({ error: 'Missing or invalid statuses data' });
//     }

//     const { id, status, timestamp } = statusData;
//     if (!id || !status || !['sent', 'delivered', 'read'].includes(status)) {
//       return res.status(400).json({ error: 'Invalid status payload fields' });
//     }

//     const message = await ProcessedMessage.findOneAndUpdate(
//       { messageId: id },
//       { status, timestamp: new Date(parseInt(timestamp) * 1000) },
//       { new: true }
//     );

//     if (!message) {
//       return res.status(404).json({ error: 'Message not found' });
//     }

//     const io = req.app.get('io');
//     io.emit('statusUpdate', { messageId: id, status });

//     res.status(200).json(message);
//   } catch (error) {
//     console.error('Error updating status:', error.message);
//     res.status(500).json({ error: 'Failed to update status', details: error.message });
//   }
// });

// module.exports = router;




// server/routes/messages.js
// Defines API routes for webhook payload processing

const express = require('express');
const router = express.Router();
const ProcessedMessage = require('../models/ProcessedMessage');

// GET /messages - Fetch all messages
router.get('/', async (req, res) => {
  try {
    const messages = await ProcessedMessage.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// GET /users - Fetch unique users (sender or recipient names, excluding phone numbers)
router.get('/users', async (req, res) => {
  try {
    const senders = await ProcessedMessage.distinct('sender');
    const recipients = await ProcessedMessage.distinct('recipient');
    const users = [...new Set([...senders, ...recipients])]
      .filter((user) => user !== 'Business' && !/^\d+$/.test(user))
      .sort();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /messages/:user - Fetch messages for a specific user
router.get('/:user', async (req, res) => {
  try {
    const user = req.params.user;
    const messages = await ProcessedMessage.find({
      $or: [{ sender: user }, { recipient: user }],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching user messages:', error);
    res.status(500).json({ error: 'Failed to fetch user messages' });
  }
});

// POST /messages - Handle webhook message payload
router.post('/', async (req, res) => {
  try {
    const { payload_type, metaData } = req.body;
    if (payload_type !== 'whatsapp_webhook') {
      return res.status(400).json({ error: 'Invalid payload type' });
    }

    const { messages, contacts } = metaData.entry[0]?.changes[0]?.value || {};
    if (!messages?.[0] || !contacts?.[0]) {
      return res.status(400).json({ error: 'Missing messages or contacts' });
    }

    const messageData = messages[0];
    const contact = contacts[0];

    const processedMessage = new ProcessedMessage({
      messageId: messageData.id,
      content: messageData.text.body,
      sender: messageData.from === '918329446654' ? 'Business' : contact.profile.name,
      from: messageData.from,
      recipient: messageData.from === '918329446654' ? contact.profile.name : 'Business',
      status: 'sent',
      timestamp: new Date(parseInt(messageData.timestamp) * 1000),
    });
    await processedMessage.save();

    const io = req.app.get('io');
    io.emit('newMessage', processedMessage);

    res.status(201).json(processedMessage);
  } catch (error) {
    console.error('Error saving message:', error.message);
    res.status(500).json({ error: 'Failed to save message', details: error.message });
  }
});

// POST /messages/statuses - Handle status updates
router.post('/statuses', async (req, res) => {
  try {
    const { payload_type, metaData } = req.body;
    if (payload_type !== 'whatsapp_webhook') {
      return res.status(400).json({ error: 'Invalid payload type' });
    }

    const statusData = metaData.entry[0]?.changes[0]?.value?.statuses?.[0];
    if (!statusData) {
      return res.status(400).json({ error: 'Missing or invalid statuses data' });
    }

    const { id, status, timestamp } = statusData;
    if (!id || !status || !['sent', 'delivered', 'read'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status payload fields' });
    }

    const message = await ProcessedMessage.findOneAndUpdate(
      { messageId: id },
      { status, timestamp: new Date(parseInt(timestamp) * 1000) },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const io = req.app.get('io');
    io.emit('statusUpdate', { messageId: id, status });

    res.status(200).json(message);
  } catch (error) {
    console.error('Error updating status:', error.message);
    res.status(500).json({ error: 'Failed to update status', details: error.message });
  }
});

module.exports = router;