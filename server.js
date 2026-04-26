const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'quotes.json');

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

function saveData(arr) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

app.post('/api/quote', (req, res) => {
  const quote = req.body || {};
  if (!quote.name || !quote.email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const arr = readData();
    arr.push(quote);
    saveData(arr);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Failed to save quote', err);
    return res.status(500).json({ error: 'Failed to save quote' });
  }
});

// Serve static site files
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
