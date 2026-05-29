const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Static files serve کرنے کیلئے - CSS, JS, images
app.use(express.static(path.join(__dirname, 'public')));

// Homepage route - یہی ڈیش بورڈ کھولے گا
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check - ٹیسٹ کرنے کیلئے
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Railway کیلئے 0.0.0.0 پر لسٹن لازمی ہے
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
