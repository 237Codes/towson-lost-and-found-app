/* Backend (Node.js) - /server/routes/items.js */
const express = require('express');
const router = express.Router();

// Dummy route for lost & found items
router.get('/', (req, res) => {
    res.send('Lost and Found API is working');
});

module.exports = router;
