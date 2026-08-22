const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');

// Activity search endpoint
router.get('/search', activityController.searchActivities);

module.exports = router;
