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
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', TestSchema);