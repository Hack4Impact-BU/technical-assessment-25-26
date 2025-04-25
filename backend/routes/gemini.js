const express = require('express');
const router = express.Router();
const { generateResponse } = require('../controllers/geminiController');

router.post('/', generateResponse);

module.exports = router;