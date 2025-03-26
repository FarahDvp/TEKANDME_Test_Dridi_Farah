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
        .withMessage('Le nom est requis'),
    body('email')
        .isEmail()
        .withMessage('Email invalide'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Le mot de passe doit avoir au moins 6 caractères')
], registerUser);

router.post('/login', loginUser);

router.get('/profile', protect, getProfile);

module.exports = router;