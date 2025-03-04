const express = require('express');
const router = express.Router();
const testSessionController = require('../controllers/testSessionController');
const authMiddleware = require('../middleware/authMiddleware');
const antiCheatingMiddleware = require('../middleware/antiCheatingMiddleware');
const { validateInput } = require('../utils/validateInput');

// Routes pour les sessions de test
router.post('/start',
    validateInput,
    antiCheatingMiddleware.initializeSession,
    testSessionController.startSession
);

router.post('/submit-answer',
    authMiddleware,
    antiCheatingMiddleware.validateSession,
    validateInput,
    testSessionController.submitAnswer
);

router.post('/end-session',
    authMiddleware,
    antiCheatingMiddleware.validateSession,
    testSessionController.endSession
);

router.get('/session-status/:sessionId',
    authMiddleware,
    testSessionController.getSessionStatus
);

router.post('/proctor-event',
    authMiddleware,
    antiCheatingMiddleware.validateSession,
    testSessionController.recordProctorEvent
);

module.exports = router; 