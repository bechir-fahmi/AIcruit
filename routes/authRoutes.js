const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateInput } = require('../utils/validateInput');
const rateLimit = require('express-rate-limit');

// Rate limiter configuration
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // limit each IP to 5 requests per windowMs for login attempts
});

// Routes d'authentification
router.post('/register', validateInput, authController.register);
router.post('/login', authLimiter, validateInput, authController.login);
router.post('/forgot-password', authLimiter, validateInput, authController.forgotPassword);
router.post('/reset-password', validateInput, authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/refresh-token', authController.refreshToken);

module.exports = router; 