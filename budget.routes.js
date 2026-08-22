const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budget.controller');

router.route('/')
  .post(budgetController.addBudgetItem);

router.route('/:id')
  .delete(budgetController.deleteBudgetItem);

router.route('/trip/:tripId')
  .get(budgetController.getTripBudgetSummary);

module.exports = router;
