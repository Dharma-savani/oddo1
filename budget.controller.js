const Budget = require('../models/budget.model');
const Trip = require('../models/trip.model');

// @desc    Calculate budget and actual expenses for a trip
// @route   GET /api/budgets/trip/:tripId
// @access  Private (JWT Protected)
exports.calculateBudget = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    // Verify trip ownership
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    if (trip.user_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to view budget for this trip.' });
    }

    // Fetch budget allocations
    const budgets = await Budget.findByTripId(tripId);
    
    // Fetch actual activity expenses aggregated by category
    const actualExpenses = await Budget.calculateActualExpenses(tripId);

    const totalLimit = budgets.reduce((sum, item) => sum + parseFloat(item.limit_amount || 0), 0);
    const totalSpentFromActivities = actualExpenses.reduce((sum, item) => sum + parseFloat(item.total_spent || 0), 0);

    return res.status(200).json({
      status: 'success',
      tripId: parseInt(tripId, 10),
      summary: {
        totalBudgetLimit: totalLimit,
        totalActualSpent: totalSpentFromActivities,
        remainingBudget: totalLimit - totalSpentFromActivities
      },
      budgets,
      categoryExpenses: actualExpenses
    });
  } catch (err) {
    console.error('Error calculating budget:', err);
    return res.status(500).json({ message: 'Server error while calculating budget.', error: err.message });
  }
};

// @desc    Create budget allocation for a trip
// @route   POST /api/budgets
// @access  Private (JWT Protected)
exports.createBudget = async (req, res) => {
  try {
    const { trip_id, tripId, category, limit_amount, limitAmount, actual_spent, actualSpent } = req.body;
    const targetTripId = trip_id || tripId;
    const limit = limit_amount || limitAmount;
    const spent = actual_spent || actualSpent || 0.00;

    if (!targetTripId || !category || limit === undefined) {
      return res.status(400).json({ message: 'trip_id, category, and limit_amount are required.' });
    }

    const budget = await Budget.create(targetTripId, category, limit, spent);

    return res.status(201).json({
      status: 'success',
      message: 'Budget category created successfully.',
      budget
    });
  } catch (err) {
    console.error('Error creating budget:', err);
    return res.status(500).json({ message: 'Server error while creating budget.', error: err.message });
  }
};

// @desc    Delete a budget entry
// @route   DELETE /api/budgets/:id
// @access  Private (JWT Protected)
exports.deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await Budget.delete(id);

    if (!success) {
      return res.status(404).json({ message: 'Budget entry not found.' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Budget entry deleted successfully.'
    });
  } catch (err) {
    console.error('Error deleting budget:', err);
    return res.status(500).json({ message: 'Server error while deleting budget.', error: err.message });
  }
};
