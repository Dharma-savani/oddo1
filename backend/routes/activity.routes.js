const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
const { verifyToken } = require('../controllers/auth.controller');

// Activity routes
router.get('/', activityController.searchActivities);
router.get('/search', activityController.searchActivities);
router.post('/', verifyToken, activityController.createActivity);
router.delete('/:id', verifyToken, activityController.deleteActivity);

module.exports = router;
