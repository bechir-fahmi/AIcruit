const mongoose = require('mongoose');

const CandidateTestSchema = new mongoose.Schema({
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    responses: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
            answer: { type: String, required: true }
        }
    ],
    score: { type: Number, default: null },
    completedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CandidateTest', CandidateTestSchema);
