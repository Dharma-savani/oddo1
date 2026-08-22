const express = require('express');
const router = express.Router();
const cityController = require('../controllers/city.controller');

// City search endpoint
router.get('/search', cityController.searchCities);

module.exports = router;
