const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const filePath = path.join(__dirname, '../data/keywords.json');

// GET all keywords
router.get('/', (req, res) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    res.status(200).json(jsonData);
  } catch (error) {
    console.error('Error reading keywords:', error);
    res.status(500).json({ error: 'Failed to read keywords.' });
  }
});

// POST to update or add a disaster keyword
router.post('/update', (req, res) => {
  const { disasterType, priority, keywords } = req.body;

  if (!disasterType || !priority || !keywords) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    jsonData[disasterType] = {
      priority,
      keywords: keywords.split(',').map((kw) => kw.trim()),
    };

    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    res.status(200).json({ success: true, message: 'Keywords updated successfully.' });
  } catch (error) {
    console.error('Error updating keywords:', error);
    res.status(500).json({ error: 'Failed to update keywords.' });
  }
});

// DELETE a disaster keyword
router.delete('/:disasterType', (req, res) => {
  const { disasterType } = req.params;

  if (!disasterType) {
    return res.status(400).json({ error: 'Disaster type is required.' });
  }

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    if (!jsonData[disasterType]) {
      return res.status(404).json({ error: 'Disaster type not found.' });
    }

    // Delete the disaster type from the JSON data
    delete jsonData[disasterType];

    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    res.status(200).json({ success: true, message: 'Disaster type deleted successfully.' });
  } catch (error) {
    console.error('Error deleting keyword:', error);
    res.status(500).json({ error: 'Failed to delete keyword.' });
  }
});

module.exports = router;
