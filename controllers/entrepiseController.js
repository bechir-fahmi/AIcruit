const Entreprise = require('../models/Entreprise');

exports.createEntreprise = async (req, res) => {
    try {
        const { name, email } = req.body;
        const entreprise = await Entreprise.create({ name, email });
        res.status(201).json(entreprise);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEntreprises = async (req, res) => {
    try {
        const entreprises = await Entreprise.find();
        res.json(entreprises);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
