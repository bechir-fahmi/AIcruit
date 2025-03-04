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

exports.generateTestLink = async (req, res) => {
    try {
        const { testId, expiresAt } = req.body;
        const uniqueLink = generateUniqueLink();
        
        const linkTest = await LinkTest.create({
            test: testId,
            uniqueLink,
            createdBy: req.user._id,
            expiresAt: expiresAt || (Date.now() + 7 * 24 * 60 * 60 * 1000) // Default: 7 days
        });
        
        res.status(201).json({
            link: `${process.env.FRONTEND_URL}/test/${uniqueLink}`,
            expiry: linkTest.expiresAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTestByLink = async (req, res) => {
    try {
        const { linkId } = req.params;
        
        const link = await LinkTest.findOne({ uniqueLink: linkId, expiresAt: { $gt: Date.now() } })
            .populate('test');
            
        if (!link) {
            return res.status(404).json({ message: 'Lien de test invalide ou expiré' });
        }
        
        res.json(link.test);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
