const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budget.controller');
const { verifyToken } = require('../controllers/auth.controller');

// Secure budget calculation route using verifyToken
router.get('/:tripId/calculate', verifyToken, budgetController.calculateBudget);

module.exports = router;
