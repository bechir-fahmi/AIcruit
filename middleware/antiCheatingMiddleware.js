const antiCheatingMiddleware = (req, res, next) => {
    // Vérifier les changements rapides de focus de fenêtre
    if (req.body.windowBlurs && req.body.windowBlurs > 5) {
        return res.status(403).json({ message: "Comportement suspect détecté: changements de fenêtre excessifs" });
    }

    // Vérifier le temps passé sur chaque question
    if (req.body.questionTimes) {
        const suspiciouslyFastAnswers = req.body.questionTimes.filter(time => time < 5); // moins de 5 secondes
        if (suspiciouslyFastAnswers.length > 2) {
            return res.status(403).json({ message: "Comportement suspect détecté: réponses trop rapides" });
        }
    }

    // Vérifier les tentatives de copier-coller
    if (req.body.copyPasteAttempts && req.body.copyPasteAttempts > 3) {
        return res.status(403).json({ message: "Comportement suspect détecté: tentatives de copier-coller" });
    }

    // Vérifier les mouvements de souris suspects
    if (req.body.mouseExits && req.body.mouseExits > 8) {
        return res.status(403).json({ message: "Comportement suspect détecté: mouvements de souris suspects" });
    }

    next();
};

module.exports = antiCheatingMiddleware;