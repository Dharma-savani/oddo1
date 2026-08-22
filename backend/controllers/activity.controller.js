const Activity = require('../models/activity.model');

// @desc    Search/filter activities
// @route   GET /api/activities
// @access  Public / Protected
exports.searchActivities = async (req, res) => {
  try {
    const { q, search, category, stop_id, stopId, trip_id, tripId } = req.query;
    const query = search || q || '';
    const targetStopId = stop_id || stopId;
    const targetTripId = trip_id || tripId;

    let activities;

    if (targetStopId) {
      activities = await Activity.findByStopId(targetStopId);
    } else if (targetTripId) {
      activities = await Activity.findByTripId(targetTripId);
    } else {
      activities = await Activity.search(query, category);
    }

    return res.status(200).json({
      status: 'success',
      count: activities.length,
      activities
    });
  } catch (err) {
    console.error('Error searching activities:', err);
    return res.status(500).json({ message: 'Server error while fetching activities.', error: err.message });
  }
};

// @desc    Add activity to a stop
// @route   POST /api/activities
// @access  Private (JWT Protected)
exports.createActivity = async (req, res) => {
  try {
    const { stop_id, stopId, name, cost, category, description, activity_time, activityTime } = req.body;

    const targetStopId = stop_id || stopId;
    const time = activity_time || activityTime || null;

    if (!targetStopId || !name) {
      return res.status(400).json({ message: 'stop_id and activity name are required.' });
    }

    const activity = await Activity.create(
      targetStopId,
      name,
      cost || 0.00,
      category || 'General',
      description || '',
      time
    );

    return res.status(201).json({
      status: 'success',
      message: 'Activity added successfully.',
      activity
    });
  } catch (err) {
    console.error('Error creating activity:', err);
    return res.status(500).json({ message: 'Server error while adding activity.', error: err.message });
  }
};

// @desc    Delete an activity
// @route   DELETE /api/activities/:id
// @access  Private (JWT Protected)
exports.deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await Activity.delete(id);

    if (!success) {
      return res.status(404).json({ message: 'Activity not found.' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Activity deleted successfully.'
    });
  } catch (err) {
    console.error('Error deleting activity:', err);
    return res.status(500).json({ message: 'Server error while deleting activity.', error: err.message });
  }
};
