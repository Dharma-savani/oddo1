const express = require('express');
const router = express.Router();
const cityController = require('../controllers/city.controller');

router.route('/')
  .get(cityController.getCities)
  .post(cityController.createCity);

router.route('/:id')
  .get(cityController.getCityById);

module.exports = router;
