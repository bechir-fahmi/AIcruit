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
