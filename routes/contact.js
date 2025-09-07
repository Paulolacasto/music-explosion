const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Newsletter = require('../models/Newsletter');
const nodemailer = require('nodemailer');

// Handle contact form submissions
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Save to DB
    const contact = new Contact({ name, email, message });
    await contact.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,   // e.g. themusicexplosion1@gmail.com
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Music Explosion Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'New Contact Message',
      html: `<strong>Name:</strong> ${name}<br><strong>Email:</strong> ${email}<br><strong>Message:</strong> ${message}`
    });

    res.json({ message: 'Message sent and saved successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// Handle newsletter subscriptions
router.post('/newsletter', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const newsletter = new Newsletter({ email });
    await newsletter.save();

    res.json({ message: 'Subscription successful.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to subscribe.' });
  }
});


// Get all contact messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get all newsletter subscribers
router.get('/newsletter', async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch newsletter subscribers' });
  }
});

module.exports = router;
