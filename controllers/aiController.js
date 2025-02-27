const openai = require('../config/openai');

exports.generateTest = async (req, res) => {
    try {
        const { technologies, difficulty, numberOfQuestions } = req.body;
        // Logique de génération de test avec ChatGPT
        // ...
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 