const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    registerUser,
    loginUser,
    getProfile
} = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.post('/register', [
    body('name')
        .notEmpty()
        .withMessage('Name is required'),
    body('email')
        .isEmail()
        .withMessage('Invalid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
], registerUser);

router.post('/login', loginUser);

router.get('/profile', protect, getProfile);

module.exports = router;