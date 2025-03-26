const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'Utilisateur déjà existant' });

        user = new User({ name, email, password });
        await user.save();

        res.status(201).json({
            token: generateToken(user._id),
            user: { id: user._id, name, email }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        res.json({
            token: generateToken(user._id),
            user: { id: user._id, name: user.name, email }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProfile = async (req, res) => {
    res.json(req.user);
};

module.exports = {
    registerUser,
    loginUser,
    getProfile
};