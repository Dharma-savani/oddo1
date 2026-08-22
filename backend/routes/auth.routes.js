const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Signup Route: POST /api/auth/signup
router.post('/signup', authController.signup);

// Login Route: POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;
