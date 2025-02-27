const openai = require('../config/openai');

exports.generateTest = async (req, res) => {
    try {
        const { technologies, difficulty, numberOfQuestions } = req.body;
        
        // Construire le prompt pour ChatGPT
        const prompt = `Génère ${numberOfQuestions} questions de test technique pour les technologies suivantes: ${technologies.join(', ')}. 
            Le niveau de difficulté doit être: ${difficulty}.
            Format JSON attendu:
            {
                "questions": [
                    {
                        "question": "La question",
                        "options": ["option1", "option2", "option3", "option4"],
                        "correctAnswer": "index de la bonne réponse (0-3)",
                        "explanation": "Explication de la réponse"
                    }
                ]
            }`;

        // Appeler l'API OpenAI
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 2000,
            temperature: 0.7,
        });

        // Parser et valider la réponse
        const generatedTest = JSON.parse(completion.data.choices[0].text);
        
        if (!generatedTest.questions || !Array.isArray(generatedTest.questions)) {
            throw new Error('Format de réponse invalide');
        }

        res.json(generatedTest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 