const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// PORT Railway سے آئے گا، ورنہ 3000
const PORT = process.env.PORT || 3000;

// CORS - اپنا frontend URL یہاں ڈال دے
app.use(cors({
  origin: 'https://leadstrikerfrontend-2.netlify.app',
  credentials: true
}));

app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB ✅'))
  .catch((err) => console.log('MongoDB Error:', err));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Root route - تاکہ Cannot GET / نہ آئے
app.get('/', (req, res) => {
  res.json({ 
    message: 'LeadStriker API is running 🚀',
    docs: '/api/test'
  });
});

// Server start - Railway والا PORT استعمال ہوگا
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
