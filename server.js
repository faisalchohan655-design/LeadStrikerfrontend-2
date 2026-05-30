const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ Mongo Error:', err));

const Lead = mongoose.model('Lead', new mongoose.Schema({
  name: String, 
  phone: String, 
  email: String, 
  address: String,
  status: { type: String, default: 'New' },
  createdAt: { type: Date, default: Date.now }
}));

app.post('/api/scrape', async (req, res) => {
  try {
    const { keyword, location } = req.body;
    
    const response = await axios.get('https://api.app.outscraper.com/maps/search-v3', {
      params: { query: `${keyword} in ${location}`, limit: 50 },
      headers: { 'X-API-KEY': process.env.OUTSCRAPER_API_KEY }
    });

    const places = response.data || [];
    console.log('Found places:', places.length);
    
    let count = 0;
    for (const p of places) {
      await Lead.create({
        name: p.name || 'N/A',
        phone: p.phone || p.phone_universal || 'N/A',
        email: p.email || 'N/A', 
        address: p.full_address || p.address || 'N/A'
      });
      count++;
    }

    res.json({ success: true, added: count });
  } catch (e) {
    console.log('Error:', e.response?.data || e.message);
    res.status(500).json({ success: false, error: e.message });
  }
});

app.get('/api/leads', async (req, res) => {
  res.json(await Lead.find().sort({ createdAt: -1 }));
});

app.put('/api/leads/:id', async (req, res) => {
  res.json(await Lead.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
