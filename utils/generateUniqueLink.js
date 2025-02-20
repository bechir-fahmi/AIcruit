const crypto = require('crypto');

const generateUniqueLink = (testId, candidateId) => {
    const token = crypto.randomBytes(32).toString('hex'); // Génère un token unique
    return `${process.env.FRONTEND_URL}/test/${testId}/start?token=${token}&candidate=${candidateId}`;
};

module.exports = generateUniqueLink;
