const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');  // Récupération du token
    if (!token) return res.status(401).json({ message: 'Accès refusé, token manquant' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Vérification du token
        req.user = await User.findById(decoded.id).select('-password'); // Stocker l'utilisateur dans req.user
        if (!req.user) return res.status(401).json({ message: 'Utilisateur non trouvé' });
        next();  // Passe au prochain middleware ou contrôleur
    } catch (error) {
        res.status(401).json({ message: 'Token invalide' });
    }
};

module.exports = authMiddleware;
