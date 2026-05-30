const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' })); // Netlify کے لیے ضروری
app.use(express.json());

const PORT = process.env.PORT || 8080;

// MongoDB Schema
const leadSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  address: String,
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});
const Lead = mongoose.model('Lead', leadSchema);

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Scrape API - Outscraper
app.post('/api/scrape', async (req, res) => {
  try {
    const { keyword, city } = req.body;
    const query = `${keyword} in ${city}`;
    
    const response = await axios.get('https://api.app.outscraper.com/maps/search-v2', {
      params: { query, limit: 50, async: false },
      headers: { 'X-API-KEY': process.env.OUTSCRAPER_KEY }
    });

    // Outscraper کا data یہاں ہوتا ہے
    const places = response.data || [];
    let added = 0;

    for (const place of places) {
      await Lead.create({
        name: place.name || 'N/A',
        phone: place.phone || 'N/A',
        email: place.email || 'N/A',
        address: place.full_address || place.address || 'N/A'
      });
      added++;
    }

    res.json({ success: true, added });
  } catch (error) {
    console.log('Scrape Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all leads
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).limit(500);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Status
app.put('/api/leads/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
