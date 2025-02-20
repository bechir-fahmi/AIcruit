const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY || '1h',
    });
};

module.exports = generateToken;
