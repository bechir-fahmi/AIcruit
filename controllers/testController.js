const Test = require('../models/Test');

exports.createTest = async (req, res) => {
    try {
        const { title, questions } = req.body;
        const test = await Test.create({ title, questions });
        res.status(201).json(test);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllTests = async (req, res) => {
    try {
        const tests = await Test.find();
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTestById = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) {
            return res.status(404).json({ message: 'Test non trouvé' });
        }
        res.json(test);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTest = async (req, res) => {
    try {
        const { title, questions, difficulty, technologies, duration, status } = req.body;
        
        const test = await Test.findById(req.params.id);
        if (!test) {
            return res.status(404).json({ message: 'Test non trouvé' });
        }
        
        // Update fields
        if (title) test.title = title;
        if (questions) test.questions = questions;
        if (difficulty) test.difficulty = difficulty;
        if (technologies) test.technologies = technologies;
        if (duration) test.duration = duration;
        if (status) test.status = status;
        
        const updatedTest = await test.save();
        res.json(updatedTest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTest = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) {
            return res.status(404).json({ message: 'Test non trouvé' });
        }
        
        await test.remove();
        res.json({ message: 'Test supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
