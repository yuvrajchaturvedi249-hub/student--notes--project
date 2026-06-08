const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 1. Signup ka rasta -> /api/auth/signup
router.post('/signup', authController.signup);

// 2. Login ka rasta -> /api/auth/login
router.post('/login', authController.login);

module.exports = router;