const calculateScore = (answers, correctAnswers) => {
    let score = 0;

    answers.forEach((answer, index) => {
        if (answer === correctAnswers[index]) {
            score += 1; // +1 point pour chaque bonne réponse
        }
    });

    return (score / correctAnswers.length) * 100; // Score en pourcentage
};

module.exports = calculateScore;
