const openai = require('../config/openai.js');

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

        // Appeler l'API OpenAI avec la nouvelle syntaxe
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Tu es un expert en développement logiciel qui crée des tests techniques." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
        });

        // Parser et valider la réponse
        const responseText = completion.choices[0].message.content;
        const generatedTest = JSON.parse(responseText);
        
        if (!generatedTest.questions || !Array.isArray(generatedTest.questions)) {
            throw new Error('Format de réponse invalide');
        }

        res.json(generatedTest);
    } catch (error) {
        console.error('Error generating test:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.analyzeResponse = async (req, res) => {
    try {
        const { candidateResponse, correctAnswer, question } = req.body;
        
        // Appeler l'API OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Tu es un expert en évaluation de tests techniques." },
                { role: "user", content: `Analyse la réponse suivante à la question: "${question}"\n\nRéponse du candidat: "${candidateResponse}"\n\nRéponse correcte: "${correctAnswer}"\n\nDonne un score de 0 à 10 et une explication.` }
            ],
            temperature: 0.5,
        });

        const analysis = completion.choices[0].message.content;
        
        res.json({ analysis });
    } catch (error) {
        console.error('Error analyzing response:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getRecommendations = async (req, res) => {
    try {
        const { testResults, candidateProfile } = req.body;
        
        // Appeler l'API OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Tu es un expert en recrutement technique qui fournit des recommandations." },
                { role: "user", content: `Basé sur les résultats de test suivants: ${JSON.stringify(testResults)}\n\nEt le profil du candidat: ${JSON.stringify(candidateProfile)}\n\nFournis des recommandations pour ce candidat.` }
            ],
            temperature: 0.7,
        });

        const recommendations = completion.choices[0].message.content;
        
        res.json({ recommendations });
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.evaluateCode = async (req, res) => {
    try {
        const { code, language, requirements } = req.body;
        
        // Appeler l'API OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Tu es un expert en revue de code qui évalue la qualité du code." },
                { role: "user", content: `Évalue le code suivant écrit en ${language}:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nExigences: ${requirements}\n\nFournis une évaluation détaillée avec un score sur 10, des points forts, des points faibles et des suggestions d'amélioration.` }
            ],
            temperature: 0.5,
        });

        const evaluation = completion.choices[0].message.content;
        
        res.json({ evaluation });
    } catch (error) {
        console.error('Error evaluating code:', error);
        res.status(500).json({ message: error.message });
    }
}; 