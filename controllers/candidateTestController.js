const CandidateTest = require('../models/CandidateTest');

exports.submitTest = async (req, res) => {
    try {
        const { candidateId, testId, answers } = req.body;
        const candidateTest = await CandidateTest.create({ candidateId, testId, answers });
        res.status(201).json(candidateTest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCandidateTests = async (req, res) => {
    try {
        const candidateTests = await CandidateTest.find().populate('candidateId testId');
        res.json(candidateTests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTestResults = async (req, res) => {
    try {
        const { linkId } = req.params;
        
        const candidateTest = await CandidateTest.findOne({ accessLink: linkId })
            .populate('candidate test');
            
        if (!candidateTest) {
            return res.status(404).json({ message: 'Résultats de test non trouvés' });
        }
        
        res.json(candidateTest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
