const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { Parser } = require('json2csv');

// ➕ POST: Add a new payment
router.post('/', async (req, res) => {
  const { name, email, amount, method } = req.body;

  if (!name || !email || !amount || !method) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newPayment = new Payment({ name, email, amount, method });
    await newPayment.save();
    res.status(201).json({ message: 'Payment recorded successfully', data: newPayment });
  } catch (error) {
    console.error('Error saving payment:', error);
    res.status(500).json({ error: 'Failed to record payment.' });
  }
});

// 🔍 GET: Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ paidAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to load payments.' });
  }
});

// ⬇️ GET: Download payments as CSV
router.get('/download', async (req, res) => {
  try {
    const payments = await Payment.find();
    const fields = ['name', 'email', 'amount', 'method', 'paidAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(payments);

    res.header('Content-Type', 'text/csv');
    res.attachment('payments.csv');
    return res.send(csv);
  } catch (error) {
    console.error('Error exporting payments:', error);
    res.status(500).json({ error: 'Failed to export payments.' });
  }
});

module.exports = router;
