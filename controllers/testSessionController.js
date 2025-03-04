const TestSession = require('../models/TestSession');
const CandidateTest = require('../models/CandidateTest');

exports.startSession = async (req, res) => {
    try {
        const { testId, candidateId, accessToken } = req.body;
        
        // Vérifier si le test existe et est valide pour ce candidat
        const candidateTest = await CandidateTest.findOne({
            test: testId,
            candidate: candidateId,
            accessToken,
            status: 'pending'
        });
        
        if (!candidateTest) {
            return res.status(404).json({ message: 'Test non trouvé ou déjà commencé' });
        }
        
        // Créer une nouvelle session de test
        const testSession = await TestSession.create({
            candidateTest: candidateTest._id,
            startTime: new Date(),
            status: 'in_progress',
            browserInfo: req.body.browserInfo,
            ipAddress: req.ip
        });
        
        // Mettre à jour le statut du test candidat
        candidateTest.status = 'in_progress';
        candidateTest.startTime = new Date();
        await candidateTest.save();
        
        res.status(201).json({
            sessionId: testSession._id,
            timeLimit: candidateTest.test.duration * 60, // en secondes
            message: 'Session de test démarrée avec succès'
        });
    } catch (error) {
        console.error('Error starting test session:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.submitAnswer = async (req, res) => {
    try {
        const { sessionId, questionId, answer } = req.body;
        
        // Trouver la session de test
        const testSession = await TestSession.findById(sessionId);
        if (!testSession || testSession.status !== 'in_progress') {
            return res.status(404).json({ message: 'Session de test non trouvée ou terminée' });
        }
        
        // Mettre à jour les réponses
        const candidateTest = await CandidateTest.findById(testSession.candidateTest);
        
        // Trouver l'index de la question dans les réponses
        const answerIndex = candidateTest.answers.findIndex(a => a.question.toString() === questionId);
        
        if (answerIndex >= 0) {
            // Mettre à jour une réponse existante
            candidateTest.answers[answerIndex].answer = answer;
        } else {
            // Ajouter une nouvelle réponse
            candidateTest.answers.push({
                question: questionId,
                answer,
                score: 0 // Sera évalué plus tard
            });
        }
        
        await candidateTest.save();
        
        res.json({ message: 'Réponse enregistrée avec succès' });
    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.endSession = async (req, res) => {
    try {
        const { sessionId } = req.body;
        
        // Trouver et mettre à jour la session de test
        const testSession = await TestSession.findById(sessionId);
        if (!testSession) {
            return res.status(404).json({ message: 'Session de test non trouvée' });
        }
        
        testSession.status = 'completed';
        testSession.endTime = new Date();
        await testSession.save();
        
        // Mettre à jour le test candidat
        const candidateTest = await CandidateTest.findById(testSession.candidateTest);
        candidateTest.status = 'completed';
        candidateTest.endTime = new Date();
        await candidateTest.save();
        
        // TODO: Déclencher l'évaluation automatique des réponses
        
        res.json({ message: 'Session de test terminée avec succès' });
    } catch (error) {
        console.error('Error ending test session:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getSessionStatus = async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        const testSession = await TestSession.findById(sessionId)
            .populate({
                path: 'candidateTest',
                populate: { path: 'test' }
            });
            
        if (!testSession) {
            return res.status(404).json({ message: 'Session de test non trouvée' });
        }
        
        // Calculer le temps restant
        const startTime = new Date(testSession.startTime).getTime();
        const duration = testSession.candidateTest.test.duration * 60 * 1000; // en ms
        const currentTime = Date.now();
        const timeElapsed = currentTime - startTime;
        const timeRemaining = Math.max(0, duration - timeElapsed);
        
        res.json({
            status: testSession.status,
            timeRemaining: Math.floor(timeRemaining / 1000), // en secondes
            answers: testSession.candidateTest.answers.length,
            totalQuestions: testSession.candidateTest.test.questions.length
        });
    } catch (error) {
        console.error('Error getting session status:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.recordProctorEvent = async (req, res) => {
    try {
        const { sessionId, eventType, eventData } = req.body;
        
        // Trouver la session de test
        const testSession = await TestSession.findById(sessionId);
        if (!testSession) {
            return res.status(404).json({ message: 'Session de test non trouvée' });
        }
        
        // Ajouter l'événement de surveillance
        testSession.proctorEvents.push({
            type: eventType,
            data: eventData,
            timestamp: new Date()
        });
        
        await testSession.save();
        
        res.json({ message: 'Événement enregistré avec succès' });
    } catch (error) {
        console.error('Error recording proctor event:', error);
        res.status(500).json({ message: error.message });
    }
}; 