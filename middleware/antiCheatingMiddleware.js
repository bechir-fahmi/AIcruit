const antiCheatingMiddleware = (req, res, next) => {
    // Logique de détection de triche
    // Vérification des actions suspectes
    next();
};

module.exports = antiCheatingMiddleware; 