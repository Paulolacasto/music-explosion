const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv');
const Registration = require('../models/Registration');

// ✅ POST: Create a registration
router.post('/', async (req, res) => {
  const { name, email, phone, age, instruments } = req.body;

  if (!name || !email || !phone || !age || !Array.isArray(instruments) || instruments.length < 2) {
    return res.status(400).json({ error: 'All fields are required and at least two instruments must be selected.' });
  }

  try {
    const newRegistration = await Registration.create({ name, email, phone, age, instruments });
    res.status(201).json({ message: 'Registration successful', registration: newRegistration });
  } catch (error) {
    console.error('Error saving registration:', error);
    res.status(500).json({ error: 'Failed to save registration' });
  }
});

// ✅ GET: List all registrations
router.get('/', async (req, res) => {
  try {
    const registrations = await Registration.find();
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Failed to load registrations.' });
  }
});

// ✅ GET: Download as CSV
router.get('/download', async (req, res) => {
  try {
    const registrations = await Registration.find();
    const fields = ['name', 'email', 'phone', 'age', 'instruments', 'registeredAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(registrations);

    res.header('Content-Type', 'text/csv');
    res.attachment('registrations.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).send('Failed to generate CSV.');
  }
});

// ✅ DELETE: Delete registration by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Registration.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Registration not found' });
    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).json({ error: 'Failed to delete registration' });
  }
});

// ✅ PUT: Update registration by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Registration.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Registration not found' });
    res.json({ message: 'Registration updated successfully', registration: updated });
  } catch (error) {
    console.error('Error updating registration:', error);
    res.status(500).json({ error: 'Failed to update registration' });
  }
});

module.exports = router;
