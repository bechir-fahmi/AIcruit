const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const rateLimit = require('express-rate-limit');

// Rate limiter pour les appels à l'API IA
const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 100 // limite de 100 requêtes par heure
});

// Routes pour la génération de tests
router.post('/generate-test', 
    authMiddleware, 
    roleMiddleware(['admin', 'recruiter']), 
    aiLimiter,
    aiController.generateTest
);

// Routes pour l'analyse des réponses
router.post('/analyze-response',
    authMiddleware,
    aiLimiter,
    aiController.analyzeResponse
);

// Routes pour les suggestions et recommandations
router.post('/get-recommendations',
    authMiddleware,
    aiLimiter,
    aiController.getRecommendations
);

// Route pour l'évaluation du code
router.post('/evaluate-code',
    authMiddleware,
    aiLimiter,
    aiController.evaluateCode
);

module.exports = router; 