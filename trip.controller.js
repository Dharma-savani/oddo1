const Trip = require('../models/trip.model');
const Stop = require('../models/stop.model');

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private (JWT Protected)
exports.createTrip = async (req, res) => {
  try {
    const { title, description, start_date, startDate, end_date, endDate } = req.body;
    const userId = req.user.id;

    const tripTitle = title;
    const tripDescription = description || '';
    const tripStartDate = start_date || startDate || null;
    const tripEndDate = end_date || endDate || null;

    if (!tripTitle) {
      return res.status(400).json({ message: 'Trip title is required.' });
    }

    const trip = await Trip.create(userId, tripTitle, tripDescription, tripStartDate, tripEndDate);

    return res.status(201).json({
      status: 'success',
      message: 'Trip created successfully.',
      trip
    });
  } catch (err) {
    console.error('Error creating trip:', err);
    return res.status(500).json({ message: 'Server error while creating trip.', error: err.message });
  }
};

// @desc    List all trips for the authenticated user
// @route   GET /api/trips
// @access  Private (JWT Protected)
exports.listTrips = async (req, res) => {
  try {
    const userId = req.user.id;
    const trips = await Trip.findAllByUserId(userId);

    // Fetch stops for each trip to enrich response
    const tripsWithStops = await Promise.all(
      trips.map(async (trip) => {
        const stops = await Stop.findByTripId(trip.id);
        return { ...trip, stops };
      })
    );

    return res.status(200).json({
      status: 'success',
      count: tripsWithStops.length,
      trips: tripsWithStops
    });
  } catch (err) {
    console.error('Error listing trips:', err);
    return res.status(500).json({ message: 'Server error while fetching trips.', error: err.message });
  }
};

// @desc    Get a single trip by ID with stops
// @route   GET /api/trips/:id
// @access  Private (JWT Protected)
exports.getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    if (trip.user_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to access this trip.' });
    }

    const stops = await Stop.findByTripId(id);

    return res.status(200).json({
      status: 'success',
      trip: {
        ...trip,
        stops
      }
    });
  } catch (err) {
    console.error('Error fetching trip details:', err);
    return res.status(500).json({ message: 'Server error while fetching trip.', error: err.message });
  }
};

// @desc    Update a trip
// @route   PUT /api/trips/:id
// @access  Private (JWT Protected)
exports.updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, start_date, startDate, end_date, endDate } = req.body;

    const existingTrip = await Trip.findById(id);

    if (!existingTrip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    if (existingTrip.user_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this trip.' });
    }

    const updatedTitle = title !== undefined ? title : existingTrip.title;
    const updatedDescription = description !== undefined ? description : existingTrip.description;
    const updatedStartDate = start_date || startDate || existingTrip.start_date;
    const updatedEndDate = end_date || endDate || existingTrip.end_date;

    const updatedTrip = await Trip.update(
      id,
      updatedTitle,
      updatedDescription,
      updatedStartDate,
      updatedEndDate
    );

    return res.status(200).json({
      status: 'success',
      message: 'Trip updated successfully.',
      trip: updatedTrip
    });
  } catch (err) {
    console.error('Error updating trip:', err);
    return res.status(500).json({ message: 'Server error while updating trip.', error: err.message });
  }
};

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
// @access  Private (JWT Protected)
exports.deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    if (trip.user_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this trip.' });
    }

    await Trip.delete(id);

    return res.status(200).json({
      status: 'success',
      message: 'Trip deleted successfully.'
    });
  } catch (err) {
    console.error('Error deleting trip:', err);
    return res.status(500).json({ message: 'Server error while deleting trip.', error: err.message });
  }
};

// @desc    Add a stop to a trip
// @route   POST /api/trips/:id/stops
// @access  Private (JWT Protected)
exports.addStop = async (req, res) => {
  try {
    const { id: tripId } = req.params;
    const userId = req.user.id;
    const { city_id, cityId, arrival_date, arrivalDate, departure_date, departureDate, stop_order, stopOrder } = req.body;

    const targetCityId = city_id || cityId;
    const arrDate = arrival_date || arrivalDate || null;
    const depDate = departure_date || departureDate || null;
    let order = stop_order || stopOrder;

    if (!targetCityId) {
      return res.status(400).json({ message: 'City ID (city_id) is required to add a stop.' });
    }

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    if (trip.user_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to modify this trip.' });
    }

    // Auto-calculate stopOrder if not specified
    if (!order) {
      const existingStops = await Stop.findByTripId(tripId);
      order = existingStops.length + 1;
    }

    const newStop = await Stop.create(tripId, targetCityId, arrDate, depDate, order);

    return res.status(201).json({
      status: 'success',
      message: 'Stop added to trip successfully.',
      stop: newStop
    });
  } catch (err) {
    console.error('Error adding stop to trip:', err);
    return res.status(500).json({ message: 'Server error while adding stop to trip.', error: err.message });
  }
};

// @desc    Delete a stop from a trip
// @route   DELETE /api/trips/:id/stops/:stopId
// @access  Private (JWT Protected)
exports.deleteStop = async (req, res) => {
  try {
    const { id: tripId, stopId } = req.params;
    const userId = req.user.id;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    if (trip.user_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to modify this trip.' });
    }

    const stop = await Stop.findById(stopId);
    if (!stop || stop.trip_id !== parseInt(tripId, 10)) {
      return res.status(404).json({ message: 'Stop not found in this trip.' });
    }

    await Stop.delete(stopId);

    return res.status(200).json({
      status: 'success',
      message: 'Stop deleted successfully.'
    });
  } catch (err) {
    console.error('Error deleting stop:', err);
    return res.status(500).json({ message: 'Server error while deleting stop.', error: err.message });
  }
};
