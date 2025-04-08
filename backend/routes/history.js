const express = require('express');
const router = express.Router();

// get all history entries
router.get('/', (req, res) => {
    res.json({
        message: 'get all history entries'
    })
})

// create a new history entry
router.post('/', (req, res) => {
    res.json({
        message: 'create a new history entry'
    })
})

module.exports = router;