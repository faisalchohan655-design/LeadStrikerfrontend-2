const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://leadstrikerfrontend-2.netlify.app',
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB ✅'))
  .catch(err => console.log('MongoDB Error:', err));

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'LeadStriker API is running 🚀',
    docs: '/api/test'
  });
});

app.get('/api/leads', async (req, res) => {
  try {
    const leads = await mongoose.connection.db.collection('leads').find().toArray();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
