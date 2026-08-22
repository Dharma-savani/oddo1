const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');

// Trips CRUD routes
router.route('/')
  .post(tripController.createTrip)
  .get(tripController.getAllTrips);

router.route('/:id')
  .get(tripController.getTripById)
  .put(tripController.updateTrip)
  .delete(tripController.deleteTrip);

// Trip Stops routes
router.route('/:id/stops')
  .post(tripController.addStopToTrip)
  .get(tripController.getTripStops);

router.route('/:id/stops/:stopId')
  .delete(tripController.deleteStopFromTrip);

module.exports = router;
