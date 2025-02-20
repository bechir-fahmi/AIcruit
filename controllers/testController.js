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
