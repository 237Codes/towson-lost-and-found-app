const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

// app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173', // Your React app's URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, '../client')));

// routes
app.use('/api/items', require('./routes/items'));
app.use('/api/auth', require('./routes/authentication')); // Add authentication routes 

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(5001, () => console.log('Server running on http://localhost:5001'));
