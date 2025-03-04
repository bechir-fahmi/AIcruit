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

const TestSession = require('../models/TestSession');

const initializeSession = async (req, res, next) => {
    try {
        // Vérifier les informations du navigateur
        const userAgent = req.headers['user-agent'];
        
        // Vous pouvez ajouter ici une logique pour détecter les VPN, proxies, etc.
        
        // Ajouter les informations au req pour utilisation dans le contrôleur
        req.body.browserInfo = {
            userAgent,
            // Vous pouvez extraire plus d'informations du user-agent ici
        };
        
        next();
    } catch (error) {
        console.error('Error in anti-cheating initialization:', error);
        res.status(500).json({ message: 'Erreur lors de l\'initialisation de la session' });
    }
};

const validateSession = async (req, res, next) => {
    try {
        const sessionId = req.body.sessionId || req.params.sessionId;
        
        if (!sessionId) {
            return res.status(400).json({ message: 'ID de session manquant' });
        }
        
        // Vérifier si la session existe et est active
        const session = await TestSession.findById(sessionId);
        
        if (!session) {
            return res.status(404).json({ message: 'Session non trouvée' });
        }
        
        if (session.status !== 'in_progress') {
            return res.status(403).json({ message: 'Session terminée ou suspendue' });
        }
        
        // Vérifier si la session n'a pas expiré
        const candidateTest = await TestSession.findById(session.candidateTest).populate('test');
        const startTime = new Date(session.startTime).getTime();
        const duration = candidateTest.test.duration * 60 * 1000; // en ms
        const currentTime = Date.now();
        
        if (currentTime - startTime > duration) {
            session.status = 'terminated';
            await session.save();
            return res.status(403).json({ message: 'Temps écoulé pour cette session' });
        }
        
        next();
    } catch (error) {
        console.error('Error in session validation:', error);
        res.status(500).json({ message: 'Erreur lors de la validation de la session' });
    }
};

module.exports = { antiCheatingMiddleware, initializeSession, validateSession };