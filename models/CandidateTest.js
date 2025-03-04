const mongoose = require('mongoose');

const candidateTestSchema = mongoose.Schema(
    {
        candidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        test: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Test',
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed', 'expired'],
            default: 'pending'
        },
        startTime: {
            type: Date
        },
        endTime: {
            type: Date
        },
        answers: [
            {
                question: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Question'
                },
                answer: {
                    type: String
                },
                score: {
                    type: Number,
                    default: 0
                }
            }
        ],
        totalScore: {
            type: Number,
            default: 0
        },
        feedback: {
            type: String
        },
        accessLink: {
            type: String
        },
        accessToken: {
            type: String
        },
        expiresAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

const CandidateTest = mongoose.model('CandidateTest', candidateTestSchema);

module.exports = CandidateTest; 