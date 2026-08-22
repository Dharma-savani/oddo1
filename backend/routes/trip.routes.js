const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const { verifyToken } = require('../controllers/auth.controller');

// Secure all trip routes using verifyToken middleware
router.post('/', verifyToken, tripController.createTrip);
router.get('/', verifyToken, tripController.listTrips);
router.get('/:id', verifyToken, tripController.getTripById);
router.put('/:id', verifyToken, tripController.updateTrip);
router.delete('/:id', verifyToken, tripController.deleteTrip);

// Stop management routes within trips
router.post('/:id/stops', verifyToken, tripController.addStop);
router.delete('/:id/stops/:stopId', verifyToken, tripController.deleteStop);

module.exports = router;
