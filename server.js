const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

// MongoDB Schema
const leadSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  address: String,
  status: { type: String, default: 'Active' }, // Active, Connected, Qualified, Disconnected
  createdAt: { type: Date, default: Date.now }
});
const Lead = mongoose.model('Lead', leadSchema);

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Scrape API - Outscraper Google Maps
app.post('/api/scrape', async (req, res) => {
  try {
    const { keyword, city } = req.body;
    const query = `${keyword} in ${city}`;
    
    const response = await axios.get('https://api.app.outscraper.com/maps/search-v2', {
      params: {
        query: query,
        limit: 50,
        async: false
      },
      headers: {
        'X-API-KEY': process.env.OUTSCRAPER_KEY
      }
    });

    const places = response.data || [];
    let added = 0;

    for (const place of places) {
      const lead = new Lead({
        name: place.name || 'N/A',
        phone: place.phone || 'N/A',
        email: place.email || 'N/A',
        address: place.full_address || place.address || 'N/A'
      });
      await lead.save();
      added++;
    }

    res.json({ success: true, added: added });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all leads
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Status
app.put('/api/leads/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
