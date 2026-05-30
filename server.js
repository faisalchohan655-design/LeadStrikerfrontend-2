const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const PORT = process.env.PORT || 8080;

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ Mongo Error:', err));

// Schema
const leadSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  address: String,
  status: { type: String, default: 'New' },
  createdAt: { type: Date, default: Date.now }
});
const Lead = mongoose.model('Lead', leadSchema);

// Scrape Route
app.post('/api/scrape', async (req, res) => {
  try {
    const { keyword, location } = req.body;
    
    const response = await axios.get('https://api.app.outscraper.com/maps/search-v3', {
      params: {
        query: `${keyword} in ${location}`,
        limit: 50
      },
      headers: { 'X-API-KEY': process.env.OUTSCRAPER_API_KEY }
    });

    const places = response.data || []; // ← یہاں data نکالا
    let count = 0;

    for (const place of places) {
      await Lead.create({
        name: place.name || 'N/A',
        phone: place.phone || 'N/A',
        email: place.email || 'N/A', 
        address: place.full_address || place.address || 'N/A'
      });
      count++;
    }

    res.json({ success: true, added: count });
  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Leads
app.get('/api/leads', async (req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  res.json(leads);
});

// Update Status
app.put('/api/leads/:id', async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(lead);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
