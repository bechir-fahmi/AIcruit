const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const candidateTestController = require('../controllers/candidateTestController');
const linkTestController = require('../controllers/linkTestController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { validateInput } = require('../utils/validateInput');

// Routes de gestion des tests
router.post('/create', authMiddleware, roleMiddleware(['admin', 'recruiter']), validateInput, testController.createTest);
router.get('/all', authMiddleware, roleMiddleware(['admin', 'recruiter']), testController.getAllTests);
router.get('/:id', authMiddleware, testController.getTestById);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'recruiter']), validateInput, testController.updateTest);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), testController.deleteTest);

// Routes pour les liens de test
router.post('/generate-link', authMiddleware, roleMiddleware(['admin', 'recruiter']), linkTestController.generateTestLink);
router.get('/link/:linkId', linkTestController.getTestByLink);

// Routes pour les candidats
router.post('/submit/:linkId', validateInput, candidateTestController.submitTest);
router.get('/results/:linkId', authMiddleware, candidateTestController.getTestResults);

module.exports = router; 