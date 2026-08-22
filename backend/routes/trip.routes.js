const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const { verifyToken } = require('../controllers/auth.controller');

// Secure all trip routes using verifyToken middleware
router.post('/', verifyToken, tripController.createTrip);
router.get('/', verifyToken, tripController.listTrips);
router.put('/:id', verifyToken, tripController.updateTrip);
router.delete('/:id', verifyToken, tripController.deleteTrip);
router.post('/:id/stops', verifyToken, tripController.addStop);

module.exports = router;
