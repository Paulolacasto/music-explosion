const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv');
const Volunteer = require('../models/Volunteer');

// ✅ Create volunteer
router.post('/', async (req, res) => {
  const { name, address, whatsapp, unit } = req.body;

  if (!name || !address || !whatsapp || !unit) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newVolunteer = await Volunteer.create({ name, address, whatsapp, unit });
    res.status(201).json({ message: 'Volunteer registration successful', data: newVolunteer });
  } catch (error) {
    console.error('Error saving volunteer:', error);
    res.status(500).json({ error: 'Failed to save volunteer' });
  }
});

// ✅ Get all volunteers
router.get('/', async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.json(volunteers);
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({ error: 'Failed to load volunteers.' });
  }
});

// ✅ Download as CSV
router.get('/download', async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    const fields = ['name', 'address', 'whatsapp', 'unit', 'registeredAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(volunteers);

    res.header('Content-Type', 'text/csv');
    res.attachment('volunteers.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).send('Failed to generate CSV.');
  }
});

// ✅ Delete volunteer by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Volunteer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Volunteer not found' });
    res.json({ message: 'Volunteer deleted successfully' });
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    res.status(500).json({ error: 'Failed to delete volunteer' });
  }
});

// ✅ Update volunteer by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Volunteer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Volunteer not found' });
    res.json({ message: 'Volunteer updated successfully', volunteer: updated });
  } catch (error) {
    console.error('Error updating volunteer:', error);
    res.status(500).json({ error: 'Failed to update volunteer' });
  }
});

module.exports = router;
