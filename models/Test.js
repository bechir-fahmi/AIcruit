const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    entreprise: { type: mongoose.Schema.Types.ObjectId, ref: 'Entreprise', required: true },
    questions: [
        {
            type: { type: String, enum: ['qcm', 'code'], required: true },
            question: { type: String, required: true },
            options: [{ type: String }],
            correctAnswer: { type: String, required: function() { return this.type === 'qcm'; } },
            codeSnippet: { type: String, required: function() { return this.type === 'code'; } }
        }
    ],
    createdAt: { type: Date, default: Date.now },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    technologies: [{ type: String, required: true }],
    duration: { type: Number, required: true }, // en minutes
    isAIGenerated: { type: Boolean, default: true },
    status: { type: String, enum: ['draft', 'active', 'archived'], default: 'draft' }
});

module.exports = mongoose.model('Test', TestSchema);