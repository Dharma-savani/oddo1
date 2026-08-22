const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');

router.route('/')
  .get(activityController.getActivities)
  .post(activityController.createActivity);

module.exports = router;
