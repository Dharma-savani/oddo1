const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budget.controller');
const { verifyToken } = require('../controllers/auth.controller');

// Secure budget calculation & management routes using verifyToken
router.get('/trip/:tripId', verifyToken, budgetController.calculateBudget);
router.get('/:tripId/calculate', verifyToken, budgetController.calculateBudget);
router.post('/', verifyToken, budgetController.createBudget);
router.delete('/:id', verifyToken, budgetController.deleteBudget);

module.exports = router;
