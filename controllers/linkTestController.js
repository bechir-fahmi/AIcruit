const LinkTest = require('../models/LinkTest');
const generateUniqueLink = require('../utils/generateUniqueLink');

exports.createTestLink = async (req, res) => {
    try {
        const { entrepriseId, testId } = req.body;
        const uniqueLink = generateUniqueLink();
        const linkTest = await LinkTest.create({ entrepriseId, testId, uniqueLink });

        res.status(201).json(linkTest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTestLinks = async (req, res) => {
    try {
        const links = await LinkTest.find().populate('entrepriseId testId');
        res.json(links);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
