const express = require('express');
const router = express.Router();
const cityController = require('../controllers/city.controller');
const { verifyToken } = require('../controllers/auth.controller');

// City search and listing endpoints
router.get('/', cityController.searchCities);
router.get('/search', cityController.searchCities);
router.get('/:id', cityController.getCityById);
router.post('/', verifyToken, cityController.createCity);

module.exports = router;
